---
title: 'Dapper multi-mapping relationships and value equality'
description: "So long, IEqualityComparer<T>, you'll be sorely missed."
pubDate: 'April 05 2024'
heroImage: '/images/php-dx/meme.jpeg'
category: '.NET'
keywords:
    - .NET
    - Dapper
    - SQL
---

The other day I was deep in the weeds of some data access code that relies heavily on Dapper for talking to a Postgres
database, where most curmudgeonly developers like myself tend to find themselves when fine tuning an application, and
landed on a solution to a particular problem I was having in the best form possible: removing code entirely.

## It's free value equality

As .NET devs, we've all probably been using `IEqualityComparer<T>` or `IEquatable<T>` for some time well before `record` types we're a thing,
in essence creating our own value objects to use for value object equality. In other terms, asserting object A is equivalent
to object B so long as their property values are same. Using a sample .NET 8 console app as a sandbox, this is easy to play around with:

```csharp
var instanceA = new SomeClass(42069);
var instanceB = new SomeClass(42069);

Console.WriteLine(instanceA.GetHashCode());
Console.WriteLine(instanceB.GetHashCode());

// Will print to the console:
//
// 53036123
// 7563067

// False, instance A and B have different hash codes!
Debug.Assert(instanceA == instanceB);

public class SomeClass(int SomeValue);
```

With C# 8.0 `record` types, this changed the game quite a bit for us:

```csharp
var instanceA = new SomeClass(42069);
var instanceB = new SomeClass(42069);

Console.WriteLine(instanceA.GetHashCode());
Console.WriteLine(instanceB.GetHashCode());

// Will print to the console:
//
// -1903833624
// -1903833624

// True, hash codes are the same!
Debug.Assert(instanceA == instanceB);

public record SomeClass(int SomeValue);
```

Record types have been out for nearly half a decade at this point, and are usually the first type
of object definition I reach for when writing my code that mostly uses anemic domain models of sorts.
While not always the correct choice (complex service objects are better suited for `class` objects, as an example), they're perfect for modeling value objects.

For those of us that have been .NET'ing for quite some time now, this isn't exactly breaking news. Unfortunately, _a lot_ of the .NET world runs on legacy code where `record` types do not exist. To get
the same value-based equality for `class`-based objects, we'd implement an `IEqualityComparer<T>` or
`IEquatable<T>` contract for the class we're using as a value object. Using the same example from above (and yes, I'm mixing modern C# features to demo a legacy pattern):

```csharp
var instanceA = new SomeClass(42069);
var instanceB = new SomeClass(42069);

Console.WriteLine(instanceA.GetHashCode());
Console.WriteLine(instanceB.GetHashCode());

// Will print to the console:
//
// 42069
// 42069

// True! Instance A and B have the same hash codes after implementing overrides
Debug.Assert(instanceA == instanceB);

public class SomeClass(int someValue) : IEquatable<SomeClass>
{
    public int SomeValue { get; } = someValue;

    public bool Equals(SomeClass? other)
    {
        if (other is null)
        {
            return false;
        }

        // We'd probably want to assert things like reference and
        // type equality, but we'll save that for a rainy day

        return SomeValue == other.SomeValue;
    }

    public static bool operator ==(SomeClass? left, SomeClass? right)
    {
        if (left is null && right is null)
        {
            return true;
        }

        if (left is null && right is not null)
        {
            return false;
        }

        if (left is not null && right is null)
        {
            return false;
        }

        return left!.Equals(right);
    }

    public static bool operator !=(SomeClass? left, SomeClass? right) => !(left == right);

    public override int GetHashCode() => SomeValue.GetHashCode();
}
```

Okay, great. Now our objects are equivalent by value... but that's a s@$t ton of boiler plater code
that we need to sprinkle across our code base for something as simple as making sure that two objects
are considered equal if we're only looking at their property values.

So in summary, we use `record` types when we need them, and implement equality contracts when we can't use them. This concludes my TED talk.

### Dapper, relationships, and multi-mapping

Okay, I lied, there's more to my TED talk. So I've been blindly using `record` types now for awhile and
recently came across a scenario where I _really_ appreciated their power and flexibility while using Dapper to query for data that had a few one-to-many relationships going on.

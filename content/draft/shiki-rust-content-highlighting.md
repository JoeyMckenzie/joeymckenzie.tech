---
title: 'Dapper multi-mapping relationships and value equality'
description: "So long, IEqualityComparer<T>, you'll be sorely missed."
pubDate: 'Mar 20 2024'
heroImage: '/images/dapper-value-equality/meme.jpeg'
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

As .NET devs, we've all probably been using `IEqualityComparer<T>` or `IEquatable<T>` for some time well before `record`
types we're a thing,
in essence creating our own value objects to use for value object equality. In other terms, asserting object A is
equivalent
to object B so long as their property values are same. Using a sample .NET 8 console app as a sandbox, this is easy to
play around with:

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
While not always the correct choice (complex service objects are better suited for `class` objects, as an example),
they're perfect for modeling value objects.

For those of us that have been .NET'ing for quite some time now, this isn't exactly breaking news. Unfortunately, _a
lot_ of the .NET world runs on legacy code where `record` types do not exist. To get
the same value-based equality for `class`-based objects, we'd implement an `IEqualityComparer<T>` or
`IEquatable<T>` contract for the class we're using as a value object. Using the same example from above (and yes, I'm
mixing modern C# features to demo a legacy pattern):

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

So in summary, we use `record` types when we need them, and implement equality contracts when we can't use them. This
concludes my TED talk.

### Dapper, relationships, and multi-mapping

Okay, I lied, there's more to my TED talk. So I've been blindly using `record` types now for awhile and
recently came across a scenario where I _really_ appreciated their power and flexibility while using Dapper to query for
data that had a few one-to-many relationships going on. The root of the problem was not Dapper nor the relationships
themselves, but rather Dapper's multi-mapping over model queries that have two or more one-to-many relationships where
the result set might by jagged, i.e. the parent model on the query has two one-to-many relationships where each `JOIN`
has a differing number of rows that'll relate to the parent model.

Okay, that's a bunch of jargon, so let's break it down using something I think we all can understand: beer.

Suppose we're modeling the relationships within a brewery CRM SaaS app of sorts that manages a breweries beer inventory
and employees working for said breweries. We can think of this in terms of a data model where a brewery:

- has many beers
- has many employees

Though beers and employees associated to the brewery don't necessarily have a direct link to each, if we think in terms
of a SQL query that's gets us an aggregate view of all of a brewery's beers and employees, it might looks something
like:

```sql
SELECT br.id,
       br.brewery_name AS name,
       b.id            AS beer_id,
       b.beer_name,
       b.beer_type,
       e.id            AS employee_id,
       e.first_name,
       e.last_name
FROM breweries br
         JOIN beers b ON br.id = b.brewery_id
         JOIN employees e ON br.id = e.brewery_id
WHERE br.id = @BreweryId
```

We might get something like:

| Brewery ID | Name      | Beer ID | Beer Name | Beer Type | Employee ID | First Name | Last Name |
|------------|-----------|---------|-----------|-----------|-------------|------------|-----------|
| 1          | Brewery A | 101     | Beer A    | Ale       | 201         | John       | Doe       |
| 1          | Brewery A | 102     | Beer B    | Lager     | 201         | John       | Doe       |
| 2          | Brewery B | 103     | Beer X    | Stout     | 202         | Jane       | Smith     |
| 3          | Brewery C | 104     | Beer Y    | IPA       | 203         | Michael    | Johnson   |

If we're using EF, a lot of the behind the scenes mapping will happen behind the scenes of our `.Include()` relation
mappings we might have on a `Brewery` entity model. There's a good chance a brewery will have many beers and many
employees, and we see from our example result set we'll get back some duplicate rows in the case we have different
numbers of related entities. To capture all the data from this query within a model, I might define an aggregate
model to pick up all the data I'm interested in:

```csharp
public class BreweryAggregate
{
    public required int Id { get; init; }

    public required string Name { get; init; }

    public ICollection<Beer> Beers { get; } = [];

    public ICollection<Employee> Employees { get; } = [];

    public override string ToString()
    {
        return $"""
            Id: {Id}
            Name: {Name}
            Beers: [{string.Join(", ", Beers.Select(b => b.Name))}]
            Employees: [{string.Join(", ", Employees.Select(e => $"{e.FirstName} {e.LastName}"))}]
            """;
    }
}
```

Where I might have some accompanying `Beer` and `Employee` entity models (with an accompanying model to capture common
fields):

```csharp
public class Beer : EntityBase
{
    public required string Name { get; init; }

    public required string Type { get; init; }

    public required int BreweryId { get; init; }
}

public class Brewery : EntityBase
{
    public required string Name { get; init; }
}

public class Employee : EntityBase
{
    public required string FirstName { get; init; }

    public required string LastName { get; init; }

    public required int BreweryId { get; init; }
}

public abstract class EntityBase
{
    public required int Id { get; init; }

    public required DateTime CreatedAt { get; init; }

    public required DateTime UpdatedAt { get; init; }
}
```

Now within some data access code, I might use this aggregate model to retrieve the data and map it out:

```csharp
public async Task<BreweryAggregate?> GetBreweryAsync(int id, CancellationToken cancellationToken)
{
    const string sql = """
                       SELECT br.id,
                              br.brewery_name AS name,
                              br.created_at,
                              br.updated_at,
                              b.id AS beer_id,
                              b.beer_name AS name, // Column alias here to avoid clashing with psql's `name` keyword
                              b.beer_type AS type, // Column alias here to avoid clashing with psql's `type` keyword
                              b.created_at,
                              b.updated_at,
                              e.id AS employee_id,
                              e.first_name,
                              e.last_name,
                              e.created_at,
                              e.updated_at
                       FROM breweries br
                       JOIN beers b ON br.id = b.brewery_id
                       JOIN employees e ON br.id = e.brewery_id
                       WHERE br.id = @BreweryId
                       """;

    BreweryAggregate? breweryAggregate = null;

    await _connection.QueryAsync<BreweryAggregate, Beer, Employee, BreweryAggregate>(
        sql,
        (brewery, beer, employee) =>
        {
            // On first pass, we'll assign the brewery based on the first row returned
            breweryAggregate ??= brewery;

            // Next, we'll add the relationships
            breweryAggregate.Beers.Add(beer);
            breweryAggregate.Employees.Add(employee);

            return breweryAggregate;
        },
        new { BreweryId = id },
        splitOn: "beer_id, employee_id"
    );

    return breweryAggregate;
}
```

At a quick glance, the code above:

- Defines a query to pull all the data we need for a brewery with all the included relations to beers and employees
- Defines some column breaks, or `splitOn` in Dapper terms, to tell Dapper what columns are associated to the models we
  want mapped
- Defines a closure for Dapper to callback to for each record we get back in the result
    - We'll map the aggregate model on first pass, where subsequent iterations won't be assigned since we're using
      the `??=` null-coalescing assignment operator
    - On each pass, we'll also add the associated beer/employee that Dapper mapped out for us in the brewery aggregates
      list relationships (_foreshadowing intensifies_)
- Lastly, we pass the query function an anonymous object to use in order to parameterize the query so our security
  officers don't slap us with an 8 hour OWASP training on SQL injection

To use this code, I've spun up a simple console app that uses [Npgsql](https://www.npgsql.org/) as a Postgres driver.
Using a few helper .NET libraries for configuration, I can run some code to pull from the database and pretty-print to
the console a friendly version of our `BreweryAggregate` model:

```csharp
using System.Diagnostics;
using Dapper;
using HopTracker;
using HopTracker.Repositories;
using Microsoft.Extensions.Configuration;

var config = new ConfigurationBuilder().AddUserSecrets<Configuration>().Build();
using var breweryRepository = new BreweryRepository(config.GetConnectionString("Postgres"));
using var tokenSource = new CancellationTokenSource(TimeSpan.FromSeconds(1));

// Sticking with Postgres convention of snake_case columns and rows, We'll tell Dapper to map those out to their PascalCase equivalents by default
DefaultTypeMap.MatchNamesWithUnderscores = true;

var cancellationToken = tokenSource.Token;
var brewery = await breweryRepository.GetBreweryAsync(1, cancellationToken);

Console.WriteLine(brewery);
```

Running this code, we'll see something interesting in the console:

```bash
$ dotnet run

Id: 1
Name: Fall River Brewery
Beers: [Hexagenia, Widowmaker]
Employees: [Sam Adams, Sam Adams] // Oh no, duplicate employees!
```

So we've gotta problem. Our multi-mapping closure pushed in the same employee twice, because we had two rows returned
as we `JOIN`ed on the beers table that had multiple beers associated to the brewery with only one employee (talk about
bootstrapping your business).

We've gotta few options here to combat this scenario to guarantee that we're only ever returned unique beers and
employees
mapped back to the brewery aggregate model:

- Check if the employee/beer already exists in the current list of beers/employees that are mapped to the brewery
  aggregate
- Use `record` types

Let's pretend it 2017 and we don't have record types just yet. If we take option 1, we'll probably want an equality
contract in place on our `Employee` model so we can use a `.Contains()` with the comparer. Implementing
the `IEquatable<Employee>` contract would have our `Employee` now looking something like:

```csharp
namespace HopTracker.Entities;

public class Employee : EntityBase, IEquatable<Employee>
{
    public required string FirstName { get; init; }

    public required string LastName { get; init; }

    public required int BreweryId { get; init; }

    public bool Equals(Employee? other)
    {
        if (other is null)
        {
            return false;
        }

        // Again, we *might* want to check for reference and type equality... but I'm too lazy to do that right now

        return string.Equals(FirstName, other.FirstName, StringComparison.CurrentCultureIgnoreCase)
            && string.Equals(LastName, other.LastName, StringComparison.CurrentCultureIgnoreCase)
            && BreweryId == other.BreweryId;
    }

    public static bool operator ==(Employee? left, Employee? right)
    {
        if (left is null && right is null)
        {
            return true;
        }

        return left?.Equals(right) ?? false;
    }

    public static bool operator !=(Employee? left, Employee? right) => !(left == right);
}
```

And then, we can update our model mapping query:

```csharp
public async Task<BreweryAggregate?> GetBreweryAsync(int id, CancellationToken cancellationToken)
{
    // ...other stuff

    await _connection.QueryAsync<BreweryAggregate, Beer, Employee, BreweryAggregate>(
        sql,
        (brewery, beer, employee) =>
        {
            // On first pass, we'll assign the brewery based on the first row returned
            breweryAggregate ??= brewery;

            // Next, we'll add the relationships
            breweryAggregate.Beers.Add(beer);

            // Only add the employee *if* we haven't done so already, where
            // `.Contains()` will implicitly use the equality contract we've defined
            if (!breweryAggregate.Employees.Contains(employee))
            {
                breweryAggregate.Employees.Add(employee);
            }

            return breweryAggregate;
        },
        new { BreweryId = id },
        splitOn: "beer_id, employee_id"
    );

    return breweryAggregate;
```

Now if we run our code:

```bash
$ dotnet run

Id: 1
Name: Fall River Brewery
Beers: [Hexagenia, Widowmaker]
Employees: [Sam Adams] // Nice, only 1 employee as expected!
```

Great, we've got our employee that we've expected to be there without any duplicates. But... we have the technology to
make this _even_ easier. Let's move all our entity models to record types, and we can get rid of the equality contract
altogether:

```csharp

public record Beer : EntityBase
{
    public required string Name { get; init; }

    public required string Type { get; init; }

    public required int BreweryId { get; init; }
}

public record Brewery : EntityBase
{
    public required string Name { get; init; }
}

public record Employee : EntityBase
{
    public required string FirstName { get; init; }

    public required string LastName { get; init; }

    public required int BreweryId { get; init; }
}

public abstract record EntityBase
{
    public required int Id { get; init; }

    public required DateTime CreatedAt { get; init; }

    public required DateTime UpdatedAt { get; init; }
}
```

And if we run our code _yet again_:

```bash
$ dotnet run

Id: 1
Name: Fall River Brewery
Beers: [Hexagenia, Widowmaker]
Employees: [Sam Adams] // Still no duplicates!
```

We're still checking if our brewery aggregate employees list `.Contains()` the employee, which will use the generated
equality contract behind the scenes (take a look at [sharplab](https://sharplab.io) and play around
with `class`/`record` types). What if we could make this code even _leaner_? Turns out, we can by using `HashSet`s.
Let's update our `BreweryAggregate` to utilize those instead:

```csharp
public async Task<BreweryAggregate?> GetBreweryAsync(int id, CancellationToken cancellationToken)
{
    // ...other stuff

    await _connection.QueryAsync<BreweryAggregate, Beer, Employee, BreweryAggregate>(
        sql,
        (brewery, beer, employee) =>
        {
            // On first pass, we'll assign the brewery based on the first row returned
            breweryAggregate ??= brewery;

            // Next, we'll add the relationships
            breweryAggregate.Beers.Add(beer);

            // No `.Contains()` check needed, we get value equality for free and the set will check it for us
            breweryAggregate.Employees.Add(employee);

            return breweryAggregate;
        },
        new { BreweryId = id },
        splitOn: "beer_id, employee_id"
    );

    return breweryAggregate;
```

And again, if we run our code:

```bash
$ dotnet run

Id: 1
Name: Fall River Brewery
Beers: [Hexagenia, Widowmaker]
Employees: [Sam Adams] // *Still* no duplicates!
```

As we expect, no duplicate employees and we got to use even _less_ code. My favorite code to write is the code I don't
have to write (trademarking that).

### TL;DR

Model relationships and Dapper can be tricky at first, as it requires a bit more elbow grease to get the same niceties
of EF out-of-the-box. I've always been a fan of slim ORMs and firmly believe in the power of raw SQL. All of the sample
code for this post can be
found [here](https://github.com/JoeyMckenzie/joeymckenzie.tech/tree/main/examples/dotnet/HopTracker) on my GitHub. As
always, I hope someone out there finds this useful.

Until next time, friends!

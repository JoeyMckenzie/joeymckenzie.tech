---
title: 'Nullable reference types and designing with intent'
description: 'Null reference exceptions can be a thing of the path, but with great power comes great responsibility.'
pubDate: 'Nov 05 2019'
heroImage: 'https://imgs.xkcd.com/comics/compiler_complaint.png'
category: '.NET'
keywords:
    - C#
    - .net
    - .net core
    - nullable reference types
---

It's almost 5 o'clock, you've just deployed the latest API build into your test environment for other teams to start consuming and integrating into their applications, and the weekend is right around the corner. Then, the Slack messages begin.

> Steve from that one team: Hey, you guys just released a new build, right? Looks like we're getting 500s calling your team's API.`

Naturally, we check the logs in the test environment using our favorite application insight tool (we happen to use [Splunk](https://www.splunk.com/) in my company), and aimlessly attempt to find any sign of failure, praying to the higher powers that may be to just be the client that has the issue.

Then, it happens:

```
ERROR: NullReferenceException at (35,16) in Program.cs
```

Ugh... of course, and only on a Friday. The previous scenario is something we developers are all too familiar with, and our mortal enemy, the `NullReferenceException` has been besting even our most experienced code slingers for over half of a decade. Since its inception in the early 1960s, `null` has been a staple of computer science, software engineering, and expression of application intent in nearly every facet of building applications. We've built million dollar software systems based on the idea, and even worse, have caused billions (yes, with a "b") of dollars of damage in the form of irrecoverable business data. Unfortunately, one could argue that `null` is here to stay, deeply rooted in many of the world's most complex software systems that power entire economies, and there's no plans to re-engineer its original design intent. With the rise of object-oriented programming, the `null` pointer has possibly been one of the most common issues in our software applications. Take for example the following:

```csharp
var myObject= new MyObject
{
    Foo = "Bar"
};

// Assigning another object to the same reference that myObject points to
var anotherObject = myObject;
anotherObject.Foo = "Not Bar";

Console.WriteLine(myObject.Foo); // Prints "Not Bar"
```

Nothing out of the ordinary here, as we software engineers see this kind of stuff all over our codebases. Sharing references between objects (one could make the argument) forms the core of object-oriented programming. Pointers, pieces of our stack allocated memory that "point" to our reference values in memory, are easy to pass around, manipulate, and conveniently dereference and go about our merry way. Pointer references, although great as they may be, present the issue that has plagued nearly every software application at one point, or another: the null pointer.

Take for example the extension of our code from above:

```csharp
anotherObject.Foo = null;
Console.WriteLine(myObject.Foo.Length);
```

What happens now? `anotherObject` assigns our `Foo` property to an absent value, all while we attempt to dereference that same property value and retrieve the length on the next line. Run the program, and watch the catastrophe in action:

```
Unhandled exception. System.NullReferenceException: Object reference not set to an instance of an object.
```

_Hello darkness, my old friend..._ the infamous `NullReferenceException`. _Queue the obvious rhetorical question_ - is there anything we can do to prevent this behavior? Enter C# 8.0 and [nullable reference types](https://docs.microsoft.com/en-us/dotnet/csharp/nullable-references), our `NullReferenceException` saving grace. As a professional .NET Core amateur, I'll do what I do best and explore this shiny new feature of C# in all its glory. Let's spin up a simple console app reflecting the previous example code to start things off:

```
> dotnet new console -n NullableReferencesExample
```

Now, in our `Program.cs` file, let's add the following:

```csharp
using System;

namespace NullableReferencesExample
{
    class Program
    {
        static void Main(string[] args)
        {
            var myObject= new MyObject
            {
                Foo = "Bar"
            };

            var anotherObject = myObject;
            anotherObject.Foo = "Not Bar";

            Console.WriteLine(myObject.Foo);

            anotherObject.Foo = null;
            Console.WriteLine(myObject.Foo.Length);
        }
    }

    internal class MyObject
    {
        public string Foo { get; set; }
    }
}
```

Go ahead and run a quick `dotnet restore`, and let's build our project with a `dotnet build`:

```
Microsoft (R) Build Engine version 16.3.0+0f4c62fea for .NET Core
Copyright (C) Microsoft Corporation. All rights reserved.

  Restore completed in 22.78 ms for /path/to//NullableReferencesExample/NullableReferencesExample.csproj.
  NullableReferencesExample -> /path/to//NullableReferencesExample/bin/Debug/netcoreapp3.0/NullableReferencesExample.dll

Build succeeded.
    0 Warning(s)
    0 Error(s)

Time Elapsed 00:00:02.44
```

Our build completes just fine, with no signs of terror ahead even though we've knowingly written an inevitable disaster within our code. If we run this application with a `dotnet run`, we get exactly what we expect. Let's capture the build warning ahead of time by bringing in C# 8.0 and the nullable context to our project scope by adding the following to our `PropertyGroup` section of our `NullableReferencesExample.csproj`:

```xml
<PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp3.0</TargetFramework>
    <Nullable>enable</Nullable>
    <LangVersion>8.0</LangVersion>
</PropertyGroup>
```

Notice that we add the `<Nullable>enable</Nullable>` property; with this tag, we've now enabled nullable references throughout our _entire_ project. In layman's terms, now every where in our project that a reference type exists _without_ being declared as nullable, the compiler will assume that **we cannot assign those values as `null`**. This is huge. If you've ever programmed in a language like Rust, you've seen this concept firsthand. Briefly for those that haven't, the concept of `null` does not _really_ exist in Rust, which is one of the reasons (along with _many_ others) an army of developers have adopted it as one of the most loved languages, according to the last [Stack Overflow developer survey](https://insights.stackoverflow.com/survey/2019). By introducing this nullable context for all reference types in our code, the compiler will implement _strict_ rules anytime we do not initialize a non-nullable reference type, dereference a nullable reference type without checking for null, etc. Let's rebuild our project to see this in action with a quick `dotnet build`:

```
Microsoft (R) Build Engine version 16.3.0+0f4c62fea for .NET Core
Copyright (C) Microsoft Corporation. All rights reserved.

  Restore completed in 21.09 ms for /path/to/NullableReferencesExample/NullableReferencesExample.csproj.
Program.cs(26,23): warning CS8618: Non-nullable property 'Foo' is uninitialized. Consider declaring the property as nullable. [/path/to/NullableReferencesExample/NullableReferencesExample.csproj]
Program.cs(19,33): warning CS8625: Cannot convert null literal to non-nullable reference type. [/path/to/NullableReferencesExample/NullableReferencesExample.csproj]
  NullableReferencesExample -> /path/to//NullableReferencesExample/bin/Debug/netcoreapp3.0/NullableReferencesExample.dll

Build succeeded.

Program.cs(26,23): warning CS8618: Non-nullable property 'Foo' is uninitialized. Consider declaring the property as nullable. [/path/to/NullableReferencesExample/NullableReferencesExample.csproj]
Program.cs(19,33): warning CS8625: Cannot convert null literal to non-nullable reference type. [/path/to/NullableReferencesExample/NullableReferencesExample.csproj]
    2 Warning(s)
    0 Error(s)

Time Elapsed 00:00:02.61
```

Low and behold, the compiler warnings we hoped for (the good kind, at least) alert us that we have not initialized a non-nullable reference type (our `Foo` property in our `MyObject` class) and that we've assigned our `Foo` property to `null` (from the compiler's perspective, we shouldn't be doing that). In our new world of nullable reference types, we have to specify to the compiler when our reference types have the possibility of being null, and where exactly we might make those assignments. Now, coming from a language like Rust, nullable reference types are not to say there is no longer a concept of `null` in C#; should we opt in for the nullable context, we must tell the compiler what types have the ability to be null. By designing our code with this idea in mind, coupled with the compiler assisting us with its strict compile time reference checking, we gain an added layer of code security and the possibility of eliminating any chance of a `NullReferenceException` (not to say we'll _never_ get one, we simply greatly reduce the chance if we implement the proper design).

We'll go ahead and address our current compiler warnings using this new concept of nullable reference types, but before we do, let's discuss the different ways we might be able to accomplish this.

-   In our `MyObject` class, we could make our `Foo` property a `string?` type rather than just a `string`
-   We could keep our typing of `string` and override the compiler warnings, essentially telling it "hey, I know this could be `null`, and that's okay"
-   We could keep our typing of string `string` and add a single constructor to guarantee the `MyObject` class always has a valid `Foo` string value

So, what should we do? Well, the answer is simple: **it depends**. Let's think about the context for our `MyObject` class. In the real world, we build applications designed to solve real world problems, usually built around a central domain architecture. What does our `MyObject` class represent? Is there a business-driven reason as to why the `Foo` property might not exist on an instance of `MyObject`? For our use case, let's define a rule that there is a valid reason for `Foo` to be absent of value. So, let's declare it as nullable:

```csharp
internal class MyObject
{
    public string? Foo { get; set; }
}
```

With our build errors now fixed, let's add a method to snag the length of a `string` argument passed in back to the caller:

```csharp
private static int GetLength(string someStringValue)
{
    return someStringValue.Length;
}
```

Now back in our `Main` method, let's call this function to grab a reference to the length of another `MyObject` instance:

```csharp
var mySecondObject = new MyObject();
var fooLength = GetLength(mySecondObject.Foo);
```

and if we build our project, we'll get the following warnings:

```
Program.cs(23,39): warning CS8604: Possible null reference argument for parameter 'someStringValue' in 'int Program.GetLength(string someStringValue)'.
```

What caused this warning? The compiler noticed that we we're passing a nullable reference type (our `string?` type `Foo` property) to a method expecting a non-nullable string type. Without the nullable context enabled, we would get **no** warnings from the compiler; within the nullable context, the compiler is protecting us from runtime `NullReferenceException`s _because_ of this compile time analysis. Back in our `Main` method, if we add a null check before calling our `GetLength` method and compile:

```csharp
var mySecondObject = new MyObject();
if (mySecondObject.Foo != null)
{
    var fooLength = GetLength(mySecondObject.Foo);
}
```

our project compiles successfully with no warnings, since the compiler sees that we are _guaranteeing_ a non-nullable string will be passed into `GetLength()`. We could also make `GetLength()` accept a nullable string type and using the `?` operator while dereferencing `someStringValue`; the compiler will be happy either way.

### Another Example

Let's see how we might be able to leverage the power of nullable reference types with another example. I've recently written a series of posts guiding readers as we build a real world application using .NET Core and Dapper centered around a fictional brewery management software called Dappery. I'll take a few examples from those posts and use them here, since you might already be familiar.

Let's create a brewery class, and see how we can use nullable reference types to safely construct instances of this class and add beers to an associated brewery:

```csharp
using System;
using System.Collections.Generic;

namespace NullableReferencesExample
{
    public class Brewery
    {
        public ICollection<Beer>? Beers { get; set; }

        public string Name { get; set; }

        public void AddBeer(string name, double abv, byte ibu)
        {
            Beers?.Add(new Beer
            {
                Name = name,
                Style = style,
                Abv = abv,
                Ibu = ibu
            });
        }

        public void PrintBeers()
        {
            Console.WriteLine($"----- {Name} has {Beers?.Count} beers -----");
            foreach (var beer in Beers)
            {
                Console.WriteLine($"----- {beer.Name} -----");
                Console.WriteLine($"| Style: {beer.Style} |");
                Console.WriteLine($"| ABV: {beer.Abv} |");
                Console.WriteLine($"| IBU: {beer.Ibu} |");
            }
        }
    }
}
```

and our associated beer class that we'll use in conjunction with our `Brewery` class:

### Beer.cs

```csharp
namespace NullableReferencesExample
{
    public class Beer
    {
        public string Name { get; set; }

        public string Style { get; set; }

        public double Abv { get; set; }

        public byte Ibu { get; set; }

        public Brewery Brewery { get; set; }
    }
}
```

Take a look at our `Brewery` class and notice how we've declared our collection of `Beer`s as a nullable reference; this is an intentional design decision (something we should always keep in mind when working in the nullable context). We're expressing our intent to both the compiler and developers working with this code after us that "hey, there is a _chance_ that a brewery could not have a reference to any beers." Should we initialize our list to an empty collection of beers? We totally could, but for the purpose of us exploring the nullable reference context, we'll leave our collection as nullable for now. To not overload us with compiler warnings, let's add the new `#nullable disable` preprocessor directive at the top of our `Beer.cs` class and run `dotnet build` to see what warnings we might get:

```
Brewery.cs(20,34): warning CS8602: Dereference of a possibly null reference.
Brewery.cs(10,23): warning CS8618: Non-nullable property 'Name' is uninitialized. Consider declaring the property as nullable.
```

Interesting... take a look at that first warning: `Brewery.cs(20,34): warning CS8602: Dereference of a possibly null reference.` Looking at our code in `Brewery.cs`, we're iterating over our `Beers` collection, which we declared as nullable, telling the compiler there's a chance the enumerable could be null. Let's fix this by checking that we have a collection before iterating through each beer within the `PrintBeers` method:

```csharp
public void PrintBeers()
{
    Console.WriteLine($"----- {Name} has {Beers?.Count} beers -----");

    if (Beers != null)
    {
        foreach (var beer in Beers)
        {
            Console.WriteLine($"----- {beer.Name} -----");
            Console.WriteLine($"| Style: {beer.Style} |");
            Console.WriteLine($"| ABV: {beer.Abv} |");
            Console.WriteLine($"| IBU: {beer.Ibu} |");
        }
    }
}
```

Addressing our second compiler warning, let's initialize the `Name` property since we're telling the compiler this is a non-nullable string reference, so callers of our code can safely dereference a brewery object's `Name` without fear of the value being null. We'll initialize the `Name` property while instantiating a `Brewery` object, making our code correct by construction. While we're at it, we'll refactor the initialization of the `Beers` collection as well:

```csharp
using System;
using System.Collections.Generic;

namespace NullableReferencesExample
{
    public class Brewery
    {
        public Brewery(string name) => Name = name;

        public ICollection<Beer>? Beers { get; set; }

        public string Name { get; }

        public void AddBeer(string name, string style, double abv, byte ibu)
        {
            Beers ??= new List<Beer>();
            Beers.Add(new Beer
            {
                Name = name,
                Style = style,
                Abv = abv,
                Ibu = ibu
            });
        }

        public void PrintBeers()
        {
            Console.WriteLine($"----- {Name} has {Beers?.Count ?? 0} beers -----");

            if (Beers is null)
            {
                Console.WriteLine("No beers found");
                return;
            }

            foreach (var beer in Beers)
            {
                Console.WriteLine($"----- {beer.Name} -----");
                Console.WriteLine($"| Style: {beer.Style} |");
                Console.WriteLine($"| ABV: {beer.Abv} |");
                Console.WriteLine($"| IBU: {beer.Ibu} |");
            }
        }
    }
}
```

In our `AddBeer` method, notice our usage of the null-coalescing assignment operator `??=`. Recently added in C# 8.0, `??=` is a derivative of the `??` null-coalescing operator. Using `??=`, our operand on the left side will be assigned to the evaluation of the right side, if our left side operand evaluates to null. Anytime we instantiate a brewery object and attempt to add a beer, we'll initialize our beer collection on the first beer added. To make things interesting, let's give our breweries an address, since I've never heard of a virtual brewery (yet):

### Address.cs

```csharp
namespace NullableReferencesExample
{
    public class Address
    {
        public Address(string streetAddress, string city, string state, string zipCode, string? zipCodeExtension) =>
            (StreetAddress, City, State, ZipCode, ZipCodeExtension) = (streetAddress, city, state, zipCode, zipCodeExtension);

        public string StreetAddress { get; }

        public string City { get; }

        public string State { get; }

        public string ZipCode { get; }

        public string? ZipCodeExtension { get; }
    }
}
```

and back in our `Brewery.cs` class, let's add an `Address` property:

```csharp
using System;
using System.Collections.Generic;

namespace NullableReferencesExample
{
    public class Brewery
    {
        public Brewery(string name, Address address) =>
            (Name, Address) = (name, address);

        public ICollection<Beer>? Beers { get; set; }

        public Address Address { get; }

        public string Name { get; }

        public void AddBeer(string name, string style, double abv, byte ibu)
        {
            Beers ??= new List<Beer>();
            Beers.Add(new Beer(name, style, abv, ibu, this));
        }

        public void PrintBeers()
        {
            Console.WriteLine($"----- {Name} has {Beers?.Count ?? 0} beers -----");

            if (Beers is null)
            {
                Console.WriteLine("No beers found");
                return;
            }

            foreach (var beer in Beers)
            {
                Console.WriteLine($"----- {beer.Name} -----");
                Console.WriteLine($"| Style: {beer.Style} |");
                Console.WriteLine($"| ABV: {beer.Abv} |");
                Console.WriteLine($"| IBU: {beer.Ibu} |");
            }
        }

        public void PrintAddress()
        {
            Console.WriteLine("---- Address -----");
            Console.WriteLine($"Street: {Address.StreetAddress}");
            Console.WriteLine($"City: {Address.City}");
            Console.WriteLine($"State: {Address.State}");
            Console.WriteLine(string.IsNullOrWhiteSpace(Address.ZipCodeExtension) ? $"Zip Code: {Address.ZipCode}" : $"Zip Code: {Address.ZipCode}-{Address.ZipCodeExtension}");
        }
    }
}
```

Notice that our `Address` property, within our nullable reference context, is _not_ allowed to be null as we did not declare it as nullable. In our `PrintAddress`, the compiler knows our `Address` property is non-nullable, and we can safely dereference the property without having to check if `Address` exists, avoiding any chance of a `NullReferenceException`. If we build our project at this point, we should see no warnings and the compiler should happy. Let's go ahead and remove the `#nullable disable` preprocessor directive from out `Beer.cs` file and build our project one more time to see the new set of compiler warnings we'll get:

```
Beer.cs(8,23): warning CS8618: Non-nullable property 'Name' is uninitialized. Consider declaring the property as nullable.
Beer.cs(10,23): warning CS8618: Non-nullable property 'Style' is uninitialized. Consider declaring the property as nullable.
Beer.cs(16,24): warning CS8618: Non-nullable property 'Brewery' is uninitialized. Consider declaring the property as nullable.
```

As expected, we get three warnings due to our three reference type properties not being initialized in the `Beer.cs` class. Notice we only received the warnings for our `string` and `Brewery` reference types, as the `byte` and `double` are value types stored on the stack that will take on their `default` value if not supplied a value at construction time. For our use case, let's about think our intent for the `Beer` class: a beer should have a name, a brewing style (lager, IPA, etc.), and should be associated to a brewery. Each of these properties should be a **non-nullable** reference type, which means that at construction time, we need to supply an initial **non-null** value. To best solve our problem, rather than using the override `default!` assignment on each of these properties, or declaring each as nullable when we know these properties should _not_ be null, let's add a constructor that will assure us values of each of these properties anytime we instantiate a `Beer` object:

```csharp
namespace NullableReferencesExample
{
    public class Beer
    {
        public Beer(string name, string style, double abv, byte ibu, Brewery brewery) =>
            (Name, Style, Abv, Ibu, Brewery) = (name, style, abv, ibu, brewery);

        public string Name { get; }

        public string Style { get; }

        public double Abv { get; }

        public byte Ibu { get; }

        public Brewery Brewery { get; }
    }
}
```

This is all fine and dandy, as we've explored some of the compiler warnings we could possibly get in a nullable context, but what happens if we ignore those warnings and assign things as `null` anyway? Let's clean out our `Main` method in `Program.cs` and start adding some breweries and beers:

```csharp
namespace NullableReferencesExample
{
    class Program
    {
        static void Main(string[] args)
        {
            var breweryAddress = new Address("1030 E Cypress Ave.", "Redding", "CA", "96002");
            var brewery = new Brewery("Fall River Brewery", breweryAddress);

            var anotherBreweryAddress = new Address("1075 E 20th St.", "Chico", null, "95928");
            var anotherBrewery = new Brewery("Sierra Nevada Brewing Company", anotherBreweryAddress);
        }
    }
}
```

and if we build our project:

```
Program.cs(10,83): warning CS8625: Cannot convert null literal to non-nullable reference type.
```

Again, the compiler is warning us that we've assigned a `null` value to a non-nullable string reference type in our driver program. Coupled with the declaration of non-null reference types within our `Beer` class, we've now protected any instantiation of a `Beer` object to _always_ expect a non-null value for any of it's injected values. Now, what if we choose to ignore this warning and do something like:

```csharp
Console.WriteLine(anotherBreweryAddress.State.Length);
```

in our application? The compiler _won't_ give us any warnings, because from its perspective, the `State` property is non-null so this code would be totally valid. Enabling the nullable reference type context is only half of the solution to eliminating `NullReferenceException`s; we, the developers, are response to design our code with _intent_. Coupled with the nullable context, we are now responsible for architecting our code, declaring which properties the compiler should expect to be null, and conversely allowing the compiler to warn us when we've dereferenced a value that could possibly be null. Let's give our `Main` method a little more logic to top things off:

```csharp
namespace NullableReferencesExample
{
    class Program
    {
        static void Main(string[] args)
        {
            var breweryAddress = new Address("1030 E Cypress Ave.", "Redding", "CA", "96002");
            var brewery = new Brewery("Fall River Brewery", breweryAddress);
            brewery.AddBeer("Hexagenia", "Indian Pale Ale", 7.1, 120);
            brewery.PrintAddress();
            brewery.PrintBeers();

            var anotherBreweryAddress = new Address("1075 E 20th St.", "Chico", "CA", "95928");
            var anotherBrewery = new Brewery("Sierra Nevada Brewing Company", anotherBreweryAddress);
            anotherBrewery.PrintAddress();
            anotherBrewery.PrintBeers();
        }
    }
}
```

If we build our project now with a quick `dotnet build`, we see there are no compiler warnings, ensuring us each of our instantiated breweries has been properly constructed, and we've eliminated any chance of null references. If we run our project with `dotnet run`, we see the following:

```
---- Address -----
Street: 1030 E Cypress Ave.
City: Redding
State: CA
Zip Code: 96002

----- Fall River Brewery has 1 beers -----
----- Hexagenia -----
| Style: Indian Pale Ale |
| ABV: 7.1 |
| IBU: 120 |

---- Address -----
Street: 1075 E 20th St.
City: Chico
State: CA
Zip Code: 95928

----- Sierra Nevada Brewing Company has 0 beers -----
No beers found
```

### Wrapping Things Up

The nullable reference context new to C# 8.0, allowing us to leverage nullable reference types, is an incredibly powerful tool for developers to construct clean, safe code. With nullable reference types and proper application architecture, we can nearly eliminate nearly _any_ chance of a `NullReferenceException` within our code, guaranteeing compile and runtime safety while building an added layer of code security within our programs. This likely won't be the last time we explore nullable reference types, and if you've been following along with our series on [building a real world application using Dapper and .NET Core](https://betweentwobrackets.netlify.com/2019-10-06-net-core-dapper-and-crud-buzzword-bingo/), we'll see how to utilize the nullable reference context throughout our application for similar benefits.

Until next time, amigos!

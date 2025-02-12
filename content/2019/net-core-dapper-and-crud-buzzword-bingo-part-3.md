---
title: 'Clean architecture, Dapper, MediatR, and buzzword bingo (part 3)'
description: 'Testing code with xUnit, Dapper, and Shouldly.'
pubDate: 'Nov 19 2019'
heroImage: '/images/net-core-dapper-and-crud-series/part-3/shouldly-xunit-meme.jpeg'
category: '.NET'
keywords:
    - .net
    - c#
    - dapper
    - mediatr
---

Two layers down, two to go. While we've made some great progress in
our [last post](/images/net-core-dapper-and-crud-buzzword-bingo-part-2/), I wanted to carve out at least one section in
our series discussing testing our application. So far, we've built our domain and persistence layers, but we have yet to
actually implement any transactional processes that require the higher up layers that will run the code we've written so
far to confirm its correctness. Rather than wait until we've built out our API layer to begin testing our implementation
of the data layer (that would be more integration testing, one could argue), a better solution would be to take some
time to write some simple and quick unit tests around our persistence layer. With our data layer fully unit tested, we
won't have to wait to have an API to interact with via Postman, or some other application testing tool, to ensure he
code we have so far is giving us the result sets we expect. With our code unit tested in this fashion, we can use said
tests as contracts for our expectation of each operation within our repositories, and grant ourself the ability to
safely refactor without fear of unknowingly breaking the application (at least within the persistence layer).

Feel free to checkout the code in this
post [here](https://github.com/JoeyMckenzie/Dappery/tree/master/tests/Dappery.Data.Tests). Before we jump into writing
the unit tests, let's discuss the tools, approach, and mindset we'll use for writing our tests in each layer of our
application (excluding our domain layer, as there is really not much logic there by design):

-   Within each layer, we'll use a combination of [xUnit](https://xunit.net/)
    and [Shouldly](https://github.com/shouldly/shouldly), my preferred unit test and assertion frameworks, respectively
-   In our `Dappery.Data` project, we'll write units tests around each operation in our `BeerRepository`
    and `BreweryRepository` classes, utilizing the seeded database we setup for our in-memory SQLite database provider in
    our `UnitOfWork` class
-   In our `Dappery.Core` project, which contains all of our business and cross-cutting concern logic, we'll again use
    xUnit and Shouldly, with unit tests surrounding each query/command action that we will be sending to our MediatR
    request factory to create the corresponding handlers, as well as verifying proper mappings and responses in each
    scenario
-   In our `Dappery.Api` project, we'll write a suite of integration tests that will act as our end-to-end spec,
    effectively testing all of our request transactions from API interface to database interaction, and everything
    inbetween (creating a _use case_ for our application)

### Testing our Persistence Layer

Before we jump into writing our unit tests for our `Dappery.Data` project, we'll setup just a bit of test infrastructure
code that will assist us with creating an in-memory SQLite database to use within the scope of each test and setup our
dependencies that our repositories will need. Some of you might be asking the question, however, why use an in-memory
database to test, and not the actual database our application will be using? Without launching into a diatribe about
which method is best for our application, let me start by saying that _either_ approach is viable; we just so happen to
be using the in-memory database for ease of testing and project bootstrapping. There are perfectly valid reasons for
using both approaches, for example:

-   Within an enterprise environment, one of your team's APIs may contain one, or more, dependencies on another team's API
    and the persisted data it utilizes, which is good fit for testing against a live non-production (production in the
    case of live smoke testing) database consumed by all teams
-   Utilizing a common datastore between applications can, however, create a brittle dependency on the physical _data_ you
    are asserting against - should someone remove an expected record from the database that your dependent API returns,
    our tests will break (if we are not mocking the API calls)
-   In-memory test databases are great for internal application request transactions and execution paths that have little
    to no external API dependency - our data can be seeded, manipulated, and scrubbed/removed inbetween tests without fear
    of another manager yelling at us for deleting test data
-   Although, with the introduction of multiple API dependencies, mocking entire databases and tables from dependent APIs
    can quickly become unwieldy and introduce complexity in the form of data management that may not be particularly your
    API's domain concern

So, what's the answer to our self imposed rhetorical question about which method to use? A good ole fashioned, **it
depends**. For our use case, we don't have any external APIs that we rely on and no data dependency that is out of our
domain, so we'll roll our own in-memory database that will be seeded, modified, and torn down in between each test to
ensure a fresh test fixture. Since we'll be using xUnit, we can leverage the testing library's disposable interfaces,
shared contexts, and dependency injection to write our unit test in a clean, simple fashion. Now, since this is not
_really_ a detailed how-to article with xUnit, I'll quickly gloss over some of our infrastructure code that will form
the basis of each unit test class that we'll write, utilizing the disposable paradigm xUnit encourages us to use, and
then we'll jump into each test by repository and action.

For our unit tests, we'll be heavily relying on xUnit's concept
of [collection fixtures](https://xunit.net/docs/shared-context). From the xUnit documentation for collection fixtures:

> When to use: when you want to create a single test context and share it among tests in several test classes, and have
> it cleaned up after all the tests in the test classes have finished.

In essence, an xUnit collection fixture allows us to share objects, which our case is the in-memory database, between
unit test classes. While our MediatR request handlers will only have a single Unit of Work dependency, collection
fixures really shine when we're testing classes with several dependencies that we might want to spread across multiple
class files to keep our test domains of a single responsibility. I like to think of a collection fixture as the unit
test bootstrapping file, similar to a `Startup.cs` file in an ASP.NET Core web project. In our collection fixture, we'll
bootstrap our in-memory database with seeded data and supply implementations for our Unit of Work and repository
classes. Since talk is cheap, let's go ahead and start setting things up by creating a unit test project for
our `Dappery.Data` project within our `tests` folder:

```
~/Dappery/tests$ dotnet new xunit -n Dappery.Data.Tests
~/Dappery/tests$ dotnet sln ../Dappery.sln add tests/Dappery.Data.Tests/Dappery.Data.Tests.csproj
```

Again, I'm one of those weirdos that prefers the command line, so feel free to add the project via your IDE if you want.
Next, we'll reference our `Dappery.Data` project in our new test project, which just boils down to adding the package
reference in our `Dappery.Data.Tests.csproj` file:

```xml

<ItemGroup>
    <ProjectReference Include="..\..\src\Dappery.Core\Dappery.Core.csproj"/>
    <ProjectReference Include="..\..\src\Dappery.Data\Dappery.Data.csproj"/>
</ItemGroup>
```

Notice we've also referenced our `Dappery.Core` project, which we'll see later that we'll require this dependency to
access our `IUnitOfWork` and repository interfaces. Let's go ahead and add a `DataCollectionFixture.cs` class within
our `tests/Dappery.Data.Tests` project that will serve as our central collection fixture for our persistence tests.

### DataCollectionFixture.cs

```csharp
namespace Dappery.Data.Tests
{
    using Xunit;

    [CollectionDefinition("DataCollectionFixture")]
    public class DataCollectionFixture : ICollectionFixture<TestFixture>
    {
    }
}
```

Nothing special, mostly just boilerplate code that tells xUnit how to define our collection fixture, which we'll
implement with a `TestFixture.cs` file in the same directory:

### TestFixture.cs

```csharp
namespace Dappery.Data.Tests
{
    using System;
    using Core.Data;

    public class TestFixture : IDisposable
    {
        protected TestFixture()
        {
            UnitOfWork = new UnitOfWork(null);
        }

        protected IUnitOfWork UnitOfWork { get; }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        private void Dispose(bool disposing)
        {
            if (disposing)
            {
                UnitOfWork.Dispose();
            }
        }
    }
}
```

Again, nothing too complicated here. We simply define our `TestFixture` which all unit tests will use as a base, and
note that this class inherits from the `IDisposable` interface - this is where the xUnit magic happens. With this
inheritance, our `TestFixture` class will be disposed of inbetween unit test runs, tearing down our database (
bootstrapped through our `UnitOfWork`), and ensuring we have a fresh test fixture clean from persisted changes made in
previous tests. We define a read-only `UnitOfWork` property that each of our inheritors will be able to access, and
finish off with a simple resource clean up disposable implementation that will be utilized by xUnit when it disposes of
our `TestFixture` between test runs. Notice that we instantiate our `UnitOfWork` using the implementation defined in
our `Dappery.Data` project, which we setup to accept a nullable `string?` value that, when `null`, initializes a seeded
in-memory SQLite database for us that we'll assert against during our unit tests.

With our initial infrastructure out of the way, let's go ahead and create a `BeerRepositoryTest.cs` file and write our
first test case:

### BeerRepositoryTest.cs

```csharp
namespace Dappery.Data.Tests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Domain.Entities;
    using Shouldly;
    using Xunit;

    public class BeerRepositoryTest : TestFixture
    {
        [Fact]
        public async Task GetAllBeers_WhenInvokedAndBeersExist_ReturnsValidListOfBeers()
        {
            // Arrange
            using var unitOfWork = UnitOfWork;

            // Act
            var beers = (await unitOfWork.BeerRepository.GetAllBeers()).ToList();
            unitOfWork.Commit();

            // Assert
            beers.ShouldNotBeNull();
            beers.ShouldBeOfType<List<Beer>>();
            beers.ShouldNotBeEmpty();
            beers.All(b => b.Brewery != null).ShouldBeTrue();
            beers.All(b => b.Brewery.Address != null).ShouldBeTrue();
            beers.All(b => b.Brewery.Address.BreweryId == b.Brewery.Id).ShouldBeTrue();
            beers.ShouldContain(b => b.Name == "Hexagenia");
            beers.FirstOrDefault(b => b.Name == "Hexagenia")?.BeerStyle.ShouldBe(BeerStyle.Ipa);
            beers.ShouldContain(b => b.Name == "Widowmaker");
            beers.FirstOrDefault(b => b.Name == "Widowmaker")?.BeerStyle.ShouldBe(BeerStyle.DoubleIpa);
            beers.ShouldContain(b => b.Name == "Hooked");
            beers.FirstOrDefault(b => b.Name == "Hooked")?.BeerStyle.ShouldBe(BeerStyle.Lager);
            beers.ShouldContain(b => b.Name == "Pale Ale");
            beers.FirstOrDefault(b => b.Name == "Pale Ale")?.BeerStyle.ShouldBe(BeerStyle.PaleAle);
            beers.ShouldContain(b => b.Name == "Hazy Little Thing");
            beers.FirstOrDefault(b => b.Name == "Hazy Little Thing")?.BeerStyle.ShouldBe(BeerStyle.NewEnglandIpa);
        }
    }
}
```

Alright, let's breakdown this test:

-   We're using the AAA pattern - Arrange, Act, Assert - which you'll see me make extensive use of throughout our projects
    as it encourages us to keep out unit tests _simple_ and not too complex (as they should be, massive and complicated
    unit test cases are a code smell)
-   We're using the new `using` syntax for disposable classes that shipped with C# 8.0 to grab a reference to
    our `UnitOfWork` and ensure its resources it creates are properly disposed of once our test is finished - this
    behavior mimics how we'll inject a scoped instance in our API layer using built-in ASP.NET Core dependency injection
-   We commit our transactions within our unit of work, as our UoW begins a transaction when initialized - while not
    entirely necessary for our in-memory unit test database, it's always a good practice to end our transactions even the
    case of read-only queries as to not keep lingering connections that may come back to bite us
-   We dispose of _both_ our `UnitOfWork`, once the reference falls out of scope, and the collection test fixture; while
    not entirely necessary, it's a good practice to get into (disposing resources at each level)
-   We make use of `async`/`await` to allow for blocking until we receive a response from our in-memory database before
    continuing onto our assertions
-   We use the `Shouldly` object extension methods to assert the various properties, types, and collection objects we're
    expecting in the response
-   `Shouldly` natively supports use of LINQ and expression predicates, making assertions fluid and easy to read - one of
    the many reason I _love_ the library

If we run this unit test, using either the Visual Studio/Rider test runner, or running `dotnet test`, we'll see that
this test passes. If we step through this code via a debug session, we can see exactly what is returned within our
repository, each query executing and what its result yields, etc. I'll leave that as an exercise for the reader, but
always worth while to validate that our unit tests are truly yielding the results we expect. Let's add an empty test
for `GetAllBeers()` and a couple of tests for our `GetBeerById()` repository methods:

```csharp
// ...previous tests

[Fact]
public async Task GetAllBeers_WhenNoBeersExist_ReturnsEmptyListOfBeers()
{
    // Arrange, remove all the beers from our database
    using var unitOfWork = UnitOfWork;
    await unitOfWork.BeerRepository.DeleteBeer(1);
    await unitOfWork.BeerRepository.DeleteBeer(2);
    await unitOfWork.BeerRepository.DeleteBeer(3);
    await unitOfWork.BeerRepository.DeleteBeer(4);
    await unitOfWork.BeerRepository.DeleteBeer(5);

    // Act
    var beers = (await unitOfWork.BeerRepository.GetAllBeers()).ToList();
    unitOfWork.Commit();

    // Assert
    beers.ShouldNotBeNull();
    beers.ShouldBeOfType<List<Beer>>();
    beers.ShouldBeEmpty();
}

[Fact]
public async Task GetBeerById_WhenInvokedAndBeerExists_ReturnsValidBeer()
{
    // Arrange
    using var unitOfWork = UnitOfWork;

    // Act
    var beer = await unitOfWork.BeerRepository.GetBeerById(1);
    unitOfWork.Commit();

    // Assert, validate a few properties
    beer.ShouldNotBeNull();
    beer.ShouldBeOfType<Beer>();
    beer.Name.ShouldBe("Hexagenia");
    beer.BeerStyle.ShouldBe(BeerStyle.Ipa);
    beer.Brewery.ShouldNotBeNull();
    beer.Brewery.Name.ShouldBe("Fall River Brewery");
    beer.Brewery.Address.ShouldNotBeNull();
    beer.Brewery.Address.City.ShouldBe("Redding");
}

[Fact]
public async Task GetBeerById_WhenInvokedAndBeerDoesNotExist_ReturnsNull()
{
    // Arrange
    using var unitOfWork = UnitOfWork;

    // Act
    var beer = await unitOfWork.BeerRepository.GetBeerById(10);
    unitOfWork.Commit();

    // Assert, validate a few properties
    beer.ShouldBeNull();
}
```

Nothing too complex here, just some simple positive/negative test cases for finding a beer given an ID from the caller.
One thing to note is in our `GetAllBeers_WhenNoBeersExist_ReturnsEmptyListOfBeers` method, we use the `unitOfWork` to
remove all the beers in our test database (probably not the most efficient way, quick and dirty for now), and assert
against the empty list that gets returned. While this might not seem too interesting, the beauty is that xUnit,
alongside the infrastructure code we setup, will clean up this modified database that we've 'dirtied' the context of,
and create an entirely fresh database on the next run, disregarding any transactional changes we made in a previous
test. We simply retrieve the beer within our test database and assert the properties `Should` be what we expect. One of
the reasons I prefer using Shouldly is the response messages we receive when a test fails. Let's take a look at an
example be changing our assertion of our `GetBeerById_WhenInvokedAndBeerExists_ReturnsValidBeer()` test method above to
expect an incorrect beer name:

```csharp
[Fact]
public async Task GetBeerById_WhenInvokedAndBeerExists_ReturnsValidBeer()
{
    // Arrange
    using var unitOfWork = UnitOfWork;

    // Act
    var beer = await unitOfWork.BeerRepository.GetBeerById(1);
    unitOfWork.Commit();

    // Assert, validate a few properties
    beer.ShouldNotBeNull();
    beer.ShouldBeOfType<Beer>();
    beer.Name.ShouldBe("A beer that doesn't exist"); // This beer was NOT seeded in our database
    beer.BeerStyle.ShouldBe(BeerStyle.Ipa);
    beer.Brewery.ShouldNotBeNull();
    beer.Brewery.Name.ShouldBe("Fall River Brewery");
    beer.Brewery.Address.ShouldNotBeNull();
    beer.Brewery.Address.City.ShouldBe("Redding");
}
```

If we run this run this test, we see the following in the console from Shouldly:

```
Dappery.Data.Tests.BeerRepositoryTest.GetBeerById_WhenInvokedAndBeerExists_ReturnsValidBeer:
    Outcome: Failed
    Error Message:
    Shouldly.ShouldAssertException : beer.Name
    should be
"A beer that doesn't exist"
    but was
"Hexagenia"
    difference
Difference     |  |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
               | \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/
Index          | 0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17   18   19   20   ...
Expected Value | A    \s   b    e    e    r    \s   t    h    a    t    \s   d    o    e    s    n    '    t    \s   e    ...
Actual Value   | H    e    x    a    g    e    n    i    a                                                                ...
Expected Code  | 65   32   98   101  101  114  32   116  104  97   116  32   100  111  101  115  110  39   116  32   101  ...
Actual Code    | 72   101  120  97   103  101  110  105  97                                                               ...

Difference     |       |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
               |      \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/  \|/
Index          | ...  4    5    6    7    8    9    10   11   12   13   14   15   16   17   18   19   20   21   22   23   24
Expected Value | ...  e    r    \s   t    h    a    t    \s   d    o    e    s    n    '    t    \s   e    x    i    s    t
Actual Value   | ...  g    e    n    i    a
Expected Code  | ...  101  114  32   116  104  97   116  32   100  111  101  115  110  39   116  32   101  120  105  115  116
Actual Code    | ...  103  101  110  105  97
```

Of the many reasons I love using Shouldly in all my unit test projects, this is one of my favorites. Shouldly points out
exactly what it expected, what it received, and the index differences in the string. Now, this isn't an infomercial on
trying to sell you on using Shouldly, but informative failure messages like this can help you quickly identify
inconsistencies in your code and fix things at a faster rate than traditional assertion frameworks. Let's finish out
our `BeerRepositoryTest.cs` file by adding the unit tests that will exercise our database commands for our create,
update, and delete operations:

```csharp
// ...previous query tests

[Fact]
public async Task CreateBeer_WhenBeerIsValid_ReturnsNewlyInsertedBeer()
{
    // Arrange
    using var unitOfWork = UnitOfWork;
    var beerToInsert = new Beer
    {
        Name = "Lazy Hazy",
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
        BreweryId = 1,
        BeerStyle = BeerStyle.NewEnglandIpa
    };

    // Act
    var beerId = await unitOfWork.BeerRepository.CreateBeer(beerToInsert);
    var insertedBeer = await unitOfWork.BeerRepository.GetBeerById(beerId);
    unitOfWork.Commit();

    insertedBeer.ShouldNotBeNull();
    insertedBeer.ShouldBeOfType<Beer>();
    insertedBeer.Brewery.ShouldNotBeNull();
    insertedBeer.Brewery.Address.ShouldNotBeNull();
    insertedBeer.Brewery.Beers.ShouldNotBeEmpty();
    insertedBeer.Brewery.Beers.Count.ShouldBe(4);
    insertedBeer.Brewery.Beers.ShouldContain(b => b.Id == insertedBeer.Id);
    insertedBeer.Brewery.Beers.FirstOrDefault(b => b.Id == insertedBeer.Id)?.Name.ShouldBe(beerToInsert.Name);
}

[Fact]
public async Task UpdateBeer_WhenBeerIsValid_ReturnsUpdateBeer()
{
    // Arrange
    using var unitOfWork = UnitOfWork;
    var beerToUpdate = new Beer
    {
        Id = 1,
        Name = "Colossus Imperial Stout",
        UpdatedAt = DateTime.UtcNow,
        BeerStyle = BeerStyle.Stout,
        BreweryId = 1,
    };

    // Act
    await unitOfWork.BeerRepository.UpdateBeer(beerToUpdate);
    var updatedBeer = await unitOfWork.BeerRepository.GetBeerById(beerToUpdate.Id);
    unitOfWork.Commit();

    updatedBeer.ShouldNotBeNull();
    updatedBeer.ShouldBeOfType<Beer>();
    updatedBeer.Brewery.ShouldNotBeNull();
    updatedBeer.Brewery.Address.ShouldNotBeNull();
    updatedBeer.Brewery.Beers.ShouldNotBeEmpty();
    updatedBeer.Brewery.Beers.Count.ShouldBe(3);
    updatedBeer.Brewery.Beers.ShouldContain(b => b.Id == beerToUpdate.Id);
    updatedBeer.Brewery.Beers.ShouldNotContain(b => b.Name == "Hexagenia");
    updatedBeer.Brewery.Beers.FirstOrDefault(b => b.Id == beerToUpdate.Id)?.Name.ShouldBe(beerToUpdate.Name);
}

[Fact]
public async Task DeleteBeer_WhenBeerExists_RemovesBeerFromDatabase()
{
    // Arrange
    using var unitOfWork = UnitOfWork;
    (await unitOfWork.BeerRepository.GetAllBeers())?.Count().ShouldBe(5);

    // Act
    var removeBeerCommand = await unitOfWork.BeerRepository.DeleteBeer(1);
    var breweryOfRemovedBeer = await unitOfWork.BreweryRepository.GetBreweryById(1);
    (await unitOfWork.BeerRepository.GetAllBeers())?.Count().ShouldBe(4);
    unitOfWork.Commit();

    // Assert
    removeBeerCommand.ShouldNotBeNull();
    removeBeerCommand.ShouldBe(1);
    breweryOfRemovedBeer.ShouldNotBeNull();
    breweryOfRemovedBeer.Beers.ShouldNotBeNull();
    breweryOfRemovedBeer.Beers.ShouldNotBeEmpty();
    breweryOfRemovedBeer.Beers.ShouldNotContain(b => b.Name == "Hexagenia");
}
```

Notice that our tests are simple and clean, naively testing the happy paths for all three commands since, by design, our
persistence layer has one job, and one job only: query and command the database. No (checked) exceptions are thrown in
this layer, so we don't need any assertion tests to failure cases, and since our validations/mappings will be done in
the core business logic layer (as they should be), we exclude tests of that nature as well. With our unit tests in
place, we're free to modify our logic within our persistence layer any way we see fit as a simple `dotnet test` will
tell us if we've broken any existing functionality. Our brewery repository tests will be very similar to our beer
repository tests, so let's create a `BreweryRepositoryTest.cs` file within our unit test project with the following
tests:

### BreweryRepositoryTest.cs

```csharp
namespace Dappery.Data.Tests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Domain.Entities;
    using Shouldly;
    using Xunit;

    public class BreweryRepositoryTest : TestFixture
    {
        [Fact]
        public async Task GetAllBreweries_WhenInvokedAndBreweriesExist_ReturnsValidListOfBreweries()
        {
            // Arrange
            using var unitOfWork = UnitOfWork;

            // Act
            var breweries = (await unitOfWork.BreweryRepository.GetAllBreweries()).ToList();
            unitOfWork.Commit();

            // Assert
            breweries.ShouldNotBeNull();
            breweries.ShouldNotBeEmpty();
            breweries.Count.ShouldBe(2);
            breweries.All(br => br.Address != null).ShouldBeTrue();
            breweries.All(br => br.Beers != null).ShouldBeTrue();
            breweries.All(br => br.Beers.Any()).ShouldBeTrue();
            breweries.FirstOrDefault(br => br.Name == "Fall River Brewery")?.Beers
                .ShouldContain(b => b.Name == "Hexagenia");
            breweries.FirstOrDefault(br => br.Name == "Fall River Brewery")?.Beers
                .ShouldContain(b => b.Name == "Widowmaker");
            breweries.FirstOrDefault(br => br.Name == "Fall River Brewery")?.Beers
                .ShouldContain(b => b.Name == "Hooked");
            breweries.FirstOrDefault(br => br.Name == "Sierra Nevada Brewing Company")?.Beers
                .ShouldContain(b => b.Name == "Pale Ale");
            breweries.FirstOrDefault(br => br.Name == "Sierra Nevada Brewing Company")?.Beers
                .ShouldContain(b => b.Name == "Hazy Little Thing");
        }

        [Fact]
        public async Task GetAllBreweries_WhenInvokedAndNoBreweriesExist_ReturnsEmptyList()
        {
            // Arrange
            using var unitOfWork = UnitOfWork;
            await unitOfWork.BreweryRepository.DeleteBrewery(1);
            await unitOfWork.BreweryRepository.DeleteBrewery(2);

            // Act
            var breweries = (await unitOfWork.BreweryRepository.GetAllBreweries()).ToList();
            unitOfWork.Commit();

            // Assert
            breweries.ShouldNotBeNull();
            breweries.ShouldBeOfType<List<Brewery>>();
            breweries.ShouldBeEmpty();
        }

        [Fact]
        public async Task GetBreweryById_WhenInvokedAndBreweryExist_ReturnsValidBreweryWithBeersAndAddress()
        {
            // Arrange
            using var unitOfWork = UnitOfWork;

            // Act
            var brewery = await unitOfWork.BreweryRepository.GetBreweryById(1);
            unitOfWork.Commit();

            // Assert
            brewery.ShouldNotBeNull();
            brewery.ShouldBeOfType<Brewery>();
            brewery.Address.ShouldNotBeNull();
            brewery.Beers.ShouldNotBeNull();
            brewery.Beers.ShouldNotBeEmpty();
            brewery.BeerCount.ShouldBe(3);
            brewery.Beers.ShouldContain(b => b.Name == "Hexagenia");
            brewery.Beers.ShouldContain(b => b.Name == "Widowmaker");
            brewery.Beers.ShouldContain(b => b.Name == "Hooked");
        }

        [Fact]
        public async Task GetBreweryById_WhenInvokedAndNoBreweryExist_ReturnsNull()
        {
            // Arrange
            using var unitOfWork = UnitOfWork;

            // Act
            var brewery = await unitOfWork.BreweryRepository.GetBreweryById(11);
            unitOfWork.Commit();

            // Assert
            brewery.ShouldBeNull();
        }

        [Fact]
        public async Task CreateBrewery_WhenBreweryIsValid_ReturnsNewlyInsertedBrewery()
        {
            // Arrange
            using var unitOfWork = UnitOfWork;
            var breweryToInsert = new Brewery
            {
                Name = "Bike Dog Brewing Company",
                Address = new Address
                {
                    StreetAddress = "123 Sacramento St.",
                    City = "Sacramento",
                    State = "CA",
                    ZipCode = "95811",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Act
            var breweryId = await unitOfWork.BreweryRepository.CreateBrewery(breweryToInsert);
            var insertedBrewery = await unitOfWork.BreweryRepository.GetBreweryById(breweryId);
            unitOfWork.Commit();

            // Assert
            insertedBrewery.ShouldNotBeNull();
            insertedBrewery.ShouldBeOfType<Brewery>();
            insertedBrewery.Address.ShouldNotBeNull();
            insertedBrewery.Address.StreetAddress.ShouldBe(breweryToInsert.Address.StreetAddress);
            insertedBrewery.Address.BreweryId.ShouldBe(3);
            insertedBrewery.Beers.ShouldBeEmpty();
        }

        [Fact]
        public async Task UpdateBrewery_WhenBreweryIsValidAndAddressIsNotUpdated_ReturnsUpdatedBrewery()
        {
            // Arrange
            using var unitOfWork = UnitOfWork;
            var breweryToUpdate = new Brewery
            {
                Id = 2,
                Name = "Sierra Nevada Brewing Company Of Brewing",
                Address = new Address
                {
                    StreetAddress = "1075 E 20th St",
                    City = "Chico",
                    State = "CA",
                    ZipCode = "95928",
                    UpdatedAt = DateTime.UtcNow,
                    BreweryId = 2
                },
                UpdatedAt = DateTime.UtcNow
            };

            // Act
            await unitOfWork.BreweryRepository.UpdateBrewery(breweryToUpdate);
            var updatedBrewery = await unitOfWork.BreweryRepository.GetBreweryById(breweryToUpdate.Id);
            unitOfWork.Commit();

            // Assert
            updatedBrewery.ShouldNotBeNull();
            updatedBrewery.ShouldBeOfType<Brewery>();
            updatedBrewery.Address.ShouldNotBeNull();
            updatedBrewery.Address.StreetAddress.ShouldBe(breweryToUpdate.Address.StreetAddress);
            updatedBrewery.Address.BreweryId.ShouldBe(2);
            updatedBrewery.Beers.ShouldNotBeNull();
            updatedBrewery.Beers.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task UpdateBrewery_WhenBreweryIsValidAndAddressIsUpdated_ReturnsUpdatedBrewery()
        {
            // Arrange
            using var unitOfWork = UnitOfWork;
            var breweryToUpdate = new Brewery
            {
                Id = 2,
                Name = "Sierra Nevada Brewing Company Of Brewing",
                Address = new Address
                {
                    Id = 2,
                    StreetAddress = "123 Happy St.",
                    City = "Redding",
                    State = "CA",
                    ZipCode = "96002",
                    UpdatedAt = DateTime.UtcNow,
                    BreweryId = 2
                },
                UpdatedAt = DateTime.UtcNow
            };

            // Act
            await unitOfWork.BreweryRepository.UpdateBrewery(breweryToUpdate, true);
            var updatedBrewery = await unitOfWork.BreweryRepository.GetBreweryById(breweryToUpdate.Id);
            unitOfWork.Commit();

            // Assert
            updatedBrewery.ShouldNotBeNull();
            updatedBrewery.ShouldBeOfType<Brewery>();
            updatedBrewery.Address.ShouldNotBeNull();
            updatedBrewery.Address.StreetAddress.ShouldBe(breweryToUpdate.Address.StreetAddress);
            updatedBrewery.Address.ZipCode.ShouldBe(breweryToUpdate.Address.ZipCode);
            updatedBrewery.Address.City.ShouldBe(breweryToUpdate.Address.City);
            updatedBrewery.Address.BreweryId.ShouldBe(2);
            updatedBrewery.Beers.ShouldNotBeNull();
            updatedBrewery.Beers.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task DeleteBrewery_WhenBreweryExists_RemovesBreweryAndAllAssociatedBeersAndAddress()
        {
            // Arrange
            using var unitOfWork = UnitOfWork;
            (await unitOfWork.BreweryRepository.GetAllBreweries())?.Count().ShouldBe(2);
            (await unitOfWork.BeerRepository.GetAllBeers())?.Count().ShouldBe(5);


            // Act
            var removedBrewery = await unitOfWork.BreweryRepository.DeleteBrewery(1);
            var breweries = (await unitOfWork.BreweryRepository.GetAllBreweries()).ToList();
            (await unitOfWork.BeerRepository.GetAllBeers())?.Count().ShouldBe(2);
            unitOfWork.Commit();

            // Assert
            removedBrewery.ShouldNotBeNull();
            removedBrewery.ShouldBe(1);
            breweries.ShouldNotBeNull();
            breweries.Count.ShouldBe(1);
            breweries.ShouldNotContain(br => br.Name == "Fall River Brewery");
        }
    }
}
```

Again, pretty similar to the tests within our beer repository file. We see a few scenarios testing our retrieval
methods, and one test each for our commands to create, update, and delete breweries that also exercise the connection
between breweries and beers. Toss in a few nullable `?` operators to make the compiler happy, and we've got a working
unit test project. Let's run one final `dotnet test` to make sure our tests look good so far now that we've covered all
of our operations in either repository:

```
Test run for /path/to/Dappery/tests/Dappery.Data.Tests/bin/Debug/netcoreapp3.0/Dappery.Data.Tests.dll(.NETCoreApp,Version=v3.0)
Microsoft (R) Test Execution Command Line Tool Version 16.3.0
Copyright (c) Microsoft Corporation.  All rights reserved.

Starting test execution, please wait...

A total of 1 test files matched the specified pattern.

Test Run Successful.
Total tests: 15
     Passed: 15
 Total time: 1.8437 Seconds
```

Music to a developer's ears: 15 tests ran, 15 passed. While it is in fact possible to swap out our in-memory SQLite
database for disk-based SQL Server, or Postgres, I prefer to use the mock in-memory versions simply because the database
context is refreshed easily for us between test runs and ready to go for any need we may be using it for. As a
disclaimer, we _will_ be writing more unit tests for our project, both at the unit and functional level, but I'll allude
to each test project within the section during that
time. [Here's](https://github.com/JoeyMckenzie/Dappery/tree/master/tests/Dappery.Data.Tests) the code we've written so
far for our persistence layer. Let's go ahead and leave things here now, and head on to the meat and potatoes of the
project: the core business layer!

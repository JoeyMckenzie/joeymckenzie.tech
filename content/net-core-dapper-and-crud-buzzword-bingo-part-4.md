---
title: 'Clean architecture, Dapper, MediatR, and buzzword bingo (part 4)'
description: 'Write encapsulated business logic with the help of MediatR and the CQRS pattern.'
pubDate: 'Feb 02 2020'
heroImage: '/blog/net-core-dapper-and-crud-series/part-4/use-automapper-meme.jpeg'
category: '.NET'
---

The wait is finally over (sort of). As we recover from the scrupulous amount of Christmas cookies we consumed during our annual holiday bulking season (at least what I tell myself), I figured it's time to jump into the bulk of our fictional brewery app, Dappery. So far, we've:

- Defined our domain layer and business entities used application wide
- Implemented our data access layer with the help of repositories wrapped in a unit of work
- Written unit tests for our persistence layer to ensure future proofing our code

And with most of the groundwork out of the way, we can finally jump into the core layer of Dappery. Before we dive into the code, let's remind ourselves of _why_ exactly we've split our core business logic layer out into a high level detail of our application, with the lower level details (data access and API layers, in our case) _depending_ on this layer:

1. Our core business logic layer is the most complex in terms of duties it performs (not so much code-wise)
2. Encompassing the business logic with this layer prevents rules and policies from leaking into the low level details (the data access layer should not know _how_ the data is mapped, for example)
3. We invert the dependency of the API layer and the business layer, as the API layer now depends on the core business layer
4. The API layer has no notion of exactly _how_ we interact with our data, it only talks to the core logic to perform services

Noting the super meta meme at the top, some of you may be asserting through clenched teeth "hey, AutoMapper is awesome!" and rightfully so, [AutoMapper](https://github.com/AutoMapper/AutoMapper) _is_ in fact awesome. I'm a firm believer in the library and use it quite extensively in other applications. **However**, I believe for our use case, the overhead of an entire mapping library that we will grossly under utilize the capabilities of, writing a few custom mappers within our core business logic layer will suffice. With that said, mapper libraries like AutoMapper do make writing the mind numbing boilerplate mapping code in large, complex applications much easier (as long as you know where a few of the "gotchas" can happen).

Alright, with the preamble out of the way, let's get a game plan going for how we'll implement this layer:

- We'll use our data access layer contracts (i.e. the interfaces we've defined in this layer) to access our database
- Using MediatR, we'll break our requests into queries and commands, effectively containing a finite set of application features that will be easier to code to and debug
- While it may seem a little boilerplate-y, we avoid things like the [God Object](https://en.wikipedia.org/wiki/God_object) anti-pattern, where everything gets shoved into one helper or
  service class
- We'll write two custom mappers that will map our beer and brewery entities into DTOs and resource to transport the database entities out of the lower levels
- Each feature request will be validated using the [FluentValidation](https://github.com/JeremySkinner/FluentValidation) library, acting as a guard between the API layer and core business layer to protect invalid state from making its way to the database
- We'll handle invalid scenarios in this layer and enforce business rules

As we can see, that's a lot of stuff - thus the reason our core business layer is in a layer of its own, independent of the lower level details. Without further ado, let's cut the chit chat and get down to business (pun intended). Let's start off by creating a `Breweries` directory within our `Dappery.Core` project, followed by creating two additional directories of `Queries` and `Commands` nested beneath our newly created `Breweries` directory. Let's add one more folder underneath `Breweries/Commands` called `CreateBrewery`. I know, I know... that's some deep structure we're building, but the architecture will help keep our application flows and paths neatly separated and easy to drill down into. Underneath `Breweries/Commands/CreateBeer`, let's add a new C# file called `CreateBreweryCommand.cs` that will serve as the issuing command MediatR will emit to our application layer to begin the transaction for adding a brewery to the database.

### CreateBreweryCommand.cs

```csharp
namespace Dappery.Core.Breweries.Commands.CreateBrewery
{
    using Domain.Dtos.Brewery;
    using Domain.Media;
    using MediatR;

    public class CreateBreweryCommand : IRequest<BreweryResource>
    {
        public CreateBreweryCommand(CreateBreweryDto dto) => Dto = dto;

        public CreateBreweryDto Dto { get; }
    }
}
```

The `IRequest<BreweryResource>` parent interface we're inheriting from is a MediatR interface that registers with our MediatR instance, with `BreweryResource` being the response type we should expect when this request is issued. A pretty simple command, as we do nothing more than construct the request DTO that is passed into the business logic layer from the API layer (which we'll implement a little later), with `CreateBreweryCommand` being the wrapper for the data we'll eventually use. We could also issue commands directly from the API layer, rather than wrapping requests for that layer in a command, or query - this is just my preference, so the API layer does not need to know what dependencies our commands and queries have, just that it needs to send its version of the object request. With our command in place, let's add a validator within the same directory by creating `CreateBreweryCommandValidator.cs`:

### CreateBreweryCommandValidator.cs

```csharp
namespace Dappery.Core.Breweries.Commands.CreateBrewery
{
    using Extensions;
    using FluentValidation;

    public class CreateBreweryCommandValidator : AbstractValidator<CreateBreweryCommand>
    {
        public CreateBreweryCommandValidator()
        {
            RuleFor(b => b.Dto)
                .NotNull()
                .WithMessage("A request must contain valid creation data");

            RuleFor(b => b.Dto.Name)
                .NotNullOrEmpty();

            RuleFor(b => b.Dto.Address)
                .NotNull()
                .WithMessage("Must supply the address of the brewery when creating");

            RuleFor(b => b.Dto.Address!.City)
                .NotNullOrEmpty();

            RuleFor(b => b.Dto.Address!.State)
                .HasValidStateAbbreviation();

            RuleFor(b => b.Dto.Address!.StreetAddress)
                .HasValidStreetAddress();

            RuleFor(b => b.Dto.Address!.ZipCode)
                .HasValidZipCode();
        }
    }
}
```

Using the FluentValidation interface `AbstractValidator<CreateBreweryCommand>`, we're telling our validator instance (registered at startup, which again, we'll eventually see) that requests sending a `CreateBreweryCommand` need to adhere to the simple validation rules we've defined within the constructor of the class. Anytime we attempt to validate an instance of the `CreateBreweryCommand` using the FluentValidation `ValidationContext` class (which we'll see in just a bit), the library will give us back a context containing any errors the instantiated class contains. Since we've opted in to enable nullable reference types in our `Dappery.Core.csproj` file (inheriting from `Dappery.targets` - a place to define build commonality amongst multiple projects and solutions), we use the `!` bang operator to tell the compiler "I know that `Address` has the possibility to be null, but that won't happen" because of the previous validation we've defined that will fire if we receive any DTO that does not have an `Address` instance. The last three validations actually use custom validators I've defined in a separate rule behavior class within an `Extensions` folder at the base of our `Dappery.Core` project:

### RuleBuilderExtensions.cs

```csharp
namespace Dappery.Core.Extensions
{
    using System.Text.RegularExpressions;
    using FluentValidation;

    public static class RuleBuilderExtensions
    {
        // Normally, would put things like this in a shared project, like a separate Dappery.Common project
        private static readonly Regex ValidStateRegex = new Regex("^((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))$");
        private static readonly Regex StreetAddressRegex = new Regex("\\d{1,5}\\s(\\b\\w*\\b\\s){1,2}\\w*\\.");
        private static readonly Regex ZipCodeRegex = new Regex("^\\d{5}$");

        public static void NotNullOrEmpty<T>(this IRuleBuilder<T, string?> ruleBuilder)
        {
            ruleBuilder.Custom((stringToValidate, context) =>
            {
                if (string.IsNullOrWhiteSpace(stringToValidate))
                {
                    context.AddFailure($"{context.PropertyName} cannot be null, or empty");
                }
            });
        }

        public static void HasValidStateAbbreviation<T>(this IRuleBuilder<T, string?> ruleBuilder)
        {
            ruleBuilder.Custom((stateAbbreviation, context) =>
            {
                if (!ValidStateRegex.IsMatch(stateAbbreviation))
                {
                    context.AddFailure($"{stateAbbreviation} is not a valid state code");
                }
            })
            .NotEmpty()
            .WithMessage("State code cannot be empty");
        }

        public static void HasValidStreetAddress<T>(this IRuleBuilder<T, string?> ruleBuilder)
        {
            ruleBuilder.Custom((streetAddress, context) =>
            {
                if (string.IsNullOrWhiteSpace(streetAddress))
                {
                    // Add the context failure and break out of the validation
                    context.AddFailure("Must supply a street address");
                    return;
                }

                if (!StreetAddressRegex.IsMatch(context.PropertyValue.ToString()))
                {
                    context.AddFailure($"{streetAddress} is not a valid street address");
                }
            });
        }

        public static void HasValidZipCode<T>(this IRuleBuilder<T, string?> ruleBuilder)
        {
            ruleBuilder.Custom((zipCode, context) =>
            {
                if (string.IsNullOrWhiteSpace(zipCode))
                {
                    // Add the context failure and break out of the validation
                    context.AddFailure("Must supply the zip code");
                    return;
                }

                if (!ZipCodeRegex.IsMatch(context.PropertyValue.ToString()))
                {
                    context.AddFailure($"{zipCode} is not a valid zipcode");
                }
            });
        }
    }
}
```

Nothing too complicated here, we're just building some extension methods off of the FluentValidation `IRuleBuilder<T, TProperty>` interface to combine several validations on the validation context, as well as add some custom validations like the state code regex for convenience. Inside each extension method, we utilize the `Custom` extension method of the `IRuleBuilder` interface and pass an `Action<TProperty, CustomContext>` lambda where we make our custom assertions and failures to the returned validation context that then gets passed down the chain with our query and command validator classes. I highly recommend checking out the [documentation for FluentValidation](https://fluentvalidation.net/) as the maintainers have done a great job utilizing examples and references similar to the above. Next, with our brewery command and request validator in place, let's add the main staple of functionality within our application layer - the MediatR handler.

### CreateBreweryCommandHandler.cs

```csharp
namespace Dappery.Core.Breweries.Commands.CreateBrewery
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using Data;
    using Domain.Entities;
    using Domain.Media;
    using Extensions;
    using MediatR;

    public class CreateBreweryCommandHandler : IRequestHandler<CreateBreweryCommand, BreweryResource>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateBreweryCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BreweryResource> Handle(CreateBreweryCommand request, CancellationToken cancellationToken)
        {
            var breweryToCreate = new Brewery
            {
                Name = request.Dto.Name,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Address = new Address
                {
                    StreetAddress = request.Dto.Address?.StreetAddress,
                    City = request.Dto.Address?.City,
                    State = request.Dto.Address?.State,
                    ZipCode = request.Dto.Address?.ZipCode,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            // Create our brewery, retrieve the brewery so we can map it to the response, and clean up our resources
            var breweryId = await _unitOfWork.BreweryRepository.CreateBrewery(breweryToCreate, cancellationToken);
            var insertedBrewery = await _unitOfWork.BreweryRepository.GetBreweryById(breweryId, cancellationToken);
            _unitOfWork.Commit();

            // Map and return the response
            return new BreweryResource(insertedBrewery.ToBreweryDto());
        }
    }
}
```

As we'll see with each command and query handler, the core business logic of CRUD'ing our way through the application will happen within each of these class types. For our creates (our beer create operations will be eerily similar), we instantiate a new `Brewery` entity that will be added to our database with all the proper fields validated by our `CreateBreweryCommandValidator` so we can rest assured the fields we require to store a brewery are there (avoiding a bunch of `if (field is null) { // Do something, or throw an exception }` checks that will clutter things up), and call our data layer operations to create and retrieve the brewery. Recall that when we create a brewery through our repository method, we get back the last inserted brewery record ID from the `Breweries` table, which we can then turn around and retrieve that newly inserted brewery using the `GetBreweryById` method. Now granted, there's multiple way this could be optimized and refactored, but this was my deliberate decision to keep our CRUD operations simple and adhering to only conform to a [single responsibility](https://en.wikipedia.org/wiki/Single_responsibility_principle). There may times where the command to create the brewery does in fact fail at the database level, however, where the connection to physical server may be bad, or the server might be down, etc., so I figured I would leave the failure cases to the smart guys reading this post as an exercise for the audience.

Once our brewery entity has been retrieved, we then construct an instance of the `BreweryResource` to hand back to the API layer with a brewery DTO injected into the instance. Let's take a look at our mappers while we're here to get a sense of how this mapping is done exactly. Let's create a directory in our `Dappery.Core` project called `Extensions` where we'll create a `BreweryExtensions.cs` class:

### BreweryExtensions.cs

```csharp
namespace Dappery.Core.Extensions
{
    using System.Linq;
    using Domain.Dtos;
    using Domain.Dtos.Beer;
    using Domain.Dtos.Brewery;
    using Domain.Entities;

    public static class BreweryExtensions
    {
        public static BreweryDto ToBreweryDto(this Brewery brewery, bool includeBeerList = true)
        {
            return new BreweryDto
            {
                Id = brewery.Id,
                Name = brewery.Name,
                Beers = includeBeerList ? brewery.Beers.Select(b => new BeerDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    Style = b.BeerStyle.ToString()
                }) : default,
                Address = new AddressDto
                {
                    City = brewery.Address?.City,
                    State = brewery.Address?.State,
                    StreetAddress = brewery.Address?.StreetAddress,
                    ZipCode = brewery.Address?.ZipCode
                },
                BeerCount = includeBeerList ? brewery.BeerCount : (int?) null
            };
        }
    }
}
```

We see that our mapper is nothing but a simple extension method of the `Brewery` entity class that transforms the entity into our friendly DTO, omitting fields that don't necessarily need to be transported between layers (i.e. audit properties, or IDs of related entities, just to name a few). From a relationship perspective, remember that a brewery _has many_ beers, where a beer _has one_ brewery; we control the nested relational mapping with the `includeBeerList` default flag, as to avoid recursively mapped beers and breweries. Nothing too complicated here, just a nice simple mapper, and for those interested, I've written a [few unit tests](https://github.com/JoeyMckenzie/Dappery/blob/master/tests/Dappery.Core.Tests/Extensions/BreweryExtensionsTest.cs) to capture the expected behavior of our custom mapping class. While we're at it, let's go ahead and add a `BeerExtensions.cs` class within our `Extensions` directory:

### BeerExtensions.cs

```csharp
namespace Dappery.Core.Extensions
{
    using Domain.Dtos.Beer;
    using Domain.Entities;

    public static class BeerExtensions
    {
        public static BeerDto ToBeerDto(this Beer beer)
        {
             return new BeerDto
            {
                Id = beer.Id,
                Name = beer.Name,
                Style = beer.BeerStyle.ToString(),
                Brewery = beer.Brewery?.ToBreweryDto(false),
            };
        }
    }
}
```

Even simpler, our custom beer mapper just transforms a `Beer` entity into a slim DTO, while utilizing our `.ToBreweryDto()` brewery extension method to non-recursively map the beer's brewery.

At this point, you're probably wondering "this is great, but how exactly _does_ our validation catch validation errors?" That's a great question, with the answer being the MediatR library's `IPipelineBehavior<TRequest, TResponse>` interface. For the interested, [Jimmy Boggard](https://github.com/jbogard), an absolute rockstar for the .NET community, and the maintainers of MediatR have a great [library doc](https://github.com/jbogard/MediatR/wiki) explaining the exact behavior of pipelines and why they are useful to the library. In essence, a every message we send with MediatR will flow through our registered pipeline (which we'll register as a dependency within our API layer), giving us the power to check requests for certain properties, validate behaviors, log specific messages based on the request - really anything we want. For our use case, we'll implement the `IPipelineBehavior<TRequest, TResponse>` interface to define a `RequestValidationBehavior<TRequest, TResponse>` piece of the request pipeline that will take care of inspecting every request to make sure it's confiding by our FluentValidation validation rules that we define for each command and some queries. When we register our FluentValidation classes at application startup, we'll tell the library that all of our validators will be within the `Dappery.Core` assembly, letting FluentValidator scan the assembly to find and register each of our validation contexts, so that we can generically call each request's validation context to then validate the request with our registered validators. Pretty cool, huh? Side note: I've never used _validate_, or any of its derivatives, that much in a sentence ever in my entire life.

Let's go ahead and create an `Infrastructure` folder within our `Dappery.Core` project, and then create a `RequestValidationBehavior.cs` class that will implement an `IPipelineBehavior`:

### RequestValidationBehavior.cs

```csharp
namespace Dappery.Core.Infrastructure
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using FluentValidation;
    using MediatR;
    using Microsoft.Extensions.Logging;

    public class RequestValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;
        private readonly ILogger<TRequest> _logger;

        public RequestValidationBehavior(IEnumerable<IValidator<TRequest>> validators, ILogger<TRequest> logger)
        {
            _validators = validators;
            _logger = logger;
        }

        public Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
        {
            var context = new ValidationContext(request);

            var failures = _validators
                .Select(v => v.Validate(context))
                .SelectMany(result => result.Errors)
                .Where(f => f != null)
                .ToList();

            if (failures.Any())
            {
                _logger.LogInformation($"Validation failures for request [{request}]");
                throw new ValidationException(failures);
            }

            return next();
        }
    }
}
```

Let's break it down:

- First, we inject from the DI container (which we'll see in the API layer with the help of ASP.NET Core) all of the validations that were found in the assembly that all descended from `AbstractValidator<TCommand>` and retrieves the rules we've defined per instance
- We retrieve the validators from the request, which we'll know at runtime
- Using LINQ, we run through each validator, validate the context (whatever the request type may be), flatten the `ValidationResult` enumerable by mapping just the error property with `.SelectMany()`, and collect any that return errors
- We check to see if there were any violations of our rules, and throw the `ValidationException` that we'll catch within a global exception handler within the API layer so we can return detailed validation messages to the consumers
- Finally, we let the request thread continue on its merry way throughout the layers of our application (unscathed if there were no errors)

Whew, that small bit of code is doing _a lot_ of big things for us. Using MediatR and FluentValidator in tandem is a match made in heaven, letting developers customize their application request flow, providing convention to help reduce the complexity of our software. Now that we've gotten our pipeline behavior piece implemented, let's go ahead and extend the `IServiceCollection` from the `Microsoft.Extensions.DependencyInjection` namespace that will do all the leg work of resolving our dependencies. Within our `Extensions` folder, let's add a `StartupExtensions.cs` class. We use `StartupExtensions` here which is a bit specific for my liking, but our use case is just a simple ASP.NET Core application (you may see this with the name `DependencyInjection.cs` or something similar around various .NET libraries on GitHub).

### StartupExtensions.cs

```csharp
namespace Dappery.Core.Extensions
{
    using System.Reflection;
    using Infrastructure;
    using MediatR;
    using Microsoft.Extensions.DependencyInjection;

    public static class StartupExtensions
    {
        /// <summary>
        /// Extension to contain all of our business layer dependencies for our external server providers (ASP.NET Core in our case).
        /// </summary>
        /// <param name="services">Service collection for dependency injection</param>
        public static void AddDapperyCore(this IServiceCollection services)
        {
            // Add our MediatR and FluentValidation dependencies
            services.AddMediatR(Assembly.GetExecutingAssembly());

            // Add our MediatR validation pipeline
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestValidationBehavior<,>));
        }
    }
}
```

Nothing too complicated just here, just adding MediatR to the service registry, telling it to scan this assembly for implemented types of the library so that it can wire things up correctly for our internal "messaging" system, then finishing up by adding an a reference to the service container for our MediatR pipeline with a [transient](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-3.1#service-lifetimes-and-registration-options) lifetime. If you're unfamiliar with the different ways we can register service dependencies in .NET Core, check out the linked docs for a quite delightful Sunday morning read. I won't go into detail, as the docs do a pretty good job of explaining our use of the transient lifetime here, but in summary, services with this lifetime are dolled out each time the the service is requested when a thread just so happens to hit a piece of code that requires one. From the docs:

> Transient lifetime services (AddTransient) are created each time they're requested from the service container. This lifetime works best for lightweight, stateless services.

Now that we've got most of our core layer plumbing out of the way, we can now just focus on implementing our query and command handlers in a similar fashion to the `CreateBreweryCommandHandler` from above. We've given users the option of creating breweries, so now let's add an update feature to modify a previously created brewery. Let's add an `UpdateBrewery` folder within the `Breweries/Commands` directory. For the curious, my preference for the folder structure is to mimic an application use case, solely for the case of debug-ability and easily being able to identify what areas of the application are in charge of what. This is more often than not referred to as _vertical slice architecture_, and there's a [great article](https://jimmybogard.com/vertical-slice-architecture/), again by Jimmy Boggard, that discusses the power of utilizing this pattern. Notwithstanding, there are a few places where I've been a bit lazy and not so idiomatic in designing with that in mind (particularly in the domain layer), but I'll leave the clean up as an exercise for the reader. Let's add an `UpdateBreweryCommand.cs` underneath the `UpdateBrewery` folder:

### UpdateBreweryCommand.cs

```csharp
namespace Dappery.Core.Beers.Commands.UpdateBeery
{
    using Domain.Dtos.Beer;
    using Domain.Media;
    using MediatR;

    public class UpdateBeerCommand : IRequest<BeerResource>
    {
        public UpdateBeerCommand(UpdateBeerDto beerDto, int requestId) => (Dto, BeerId) = (beerDto, requestId);

        public UpdateBeerDto Dto { get; }

        public int BeerId { get; }
    }
}
```

Easy enough, all our `UpdateBreweryCommand` requires is an ID for the brewery and the properties we've exposed that consumer are allowed to update. Next, let's define our validators in an `UpdateBreweryCommandValidator.cs` class:

### UpdateBreweryCommandValidator.cs

```csharp
namespace Dappery.Core.Breweries.Commands.UpdateBrewery
{
    using FluentValidation;

    public class UpdateBreweryCommandValidator : AbstractValidator<UpdateBreweryCommand>
    {
        public UpdateBreweryCommandValidator()
        {
            RuleFor(request => request.Dto)
                .NotNull()
                .WithMessage("Must supply a request body");

            RuleFor(request => request.BreweryId)
                .NotNull()
                .WithMessage("Must supply a valid brewery ID");
        }
    }
}
```

We want each request that comes in for a brewery update to have a valid DTO in the body, along with a brewery ID that we'll retrieve from the URI. There's an argument to be made for sticking the ID as a requirement within the DTO, but this just my preference since we'll assume our consumers will be following RESTful best practices (and that's a _hefty_ assumption). Next, we'll go ahead and define our command handler within a new `UpdateBreweryCommandHandler.cs` class within our `UpdateBrewery` directory:

### UpdateBreweryCommandHandler.cs

```csharp
namespace Dappery.Core.Breweries.Commands.UpdateBrewery
{
    using System.Net;
    using System.Threading;
    using System.Threading.Tasks;
    using Extensions;
    using Data;
    using Domain.Media;
    using Exceptions;
    using MediatR;

    public class UpdateBreweryCommandHandler : IRequestHandler<UpdateBreweryCommand, BreweryResource>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateBreweryCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BreweryResource> Handle(UpdateBreweryCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the brewery on the request
            var breweryToUpdate = await _unitOfWork.BreweryRepository.GetBreweryById(request.BreweryId, cancellationToken);

            // Invalidate the request if no brewery was found
            if (breweryToUpdate is null)
            {
                throw new DapperyApiException($"No brewery was found with ID {request.BreweryId}", HttpStatusCode.NotFound);
            }

            // Update the properties on the brewery entity
            breweryToUpdate.Name = request.Dto.Name;
            var updateBreweryAddress = false;

            // If the request contains an address, set the flag for the persistence layer to update the address table
            if (request.Dto.Address != null && breweryToUpdate.Address != null)
            {
                updateBreweryAddress = true;
                breweryToUpdate.Address.StreetAddress = request.Dto.Address.StreetAddress;
                breweryToUpdate.Address.City = request.Dto.Address.City;
                breweryToUpdate.Address.State = request.Dto.Address.State;
                breweryToUpdate.Address.ZipCode = request.Dto.Address.ZipCode;
            }

            // Update the brewery in the database, retrieve it, and clean up our resources
            await _unitOfWork.BreweryRepository.UpdateBrewery(breweryToUpdate, cancellationToken, updateBreweryAddress);
            var updatedBrewery = await _unitOfWork.BreweryRepository.GetBreweryById(request.BreweryId, cancellationToken);
            _unitOfWork.Commit();

            // Map and return the brewery
            return new BreweryResource(updatedBrewery.ToBreweryDto());
        }
    }
}
```

First, we see that we're using the `BreweryId` that was passed along in the request to retrieve the brewery we should be updating. If no brewery is found, we'll throw a 404 back to the consumer using a custom exception we'll define in just a minute. Once we know we've got our brewery, we update each of the updatable fields on the entity, and set a flag for the repository implementation to update the address if need be. Due to our schema design, we probably could have opted for the [value object](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/implement-value-objects) pattern here and nested the address within the brewery table, and maybe one of these weekends I'll get around to making that update. Let's create an `Exceptions` folder underneath the `Dappery.Core` project root, and inside that, we'll create a `DapperyApiException.cs` class:

### DapperyApiException.cs

```csharp
namespace Dappery.Core.Exceptions
{
    using System;
    using System.Collections.Generic;
    using System.Net;

    public class DapperyApiException : Exception
    {
        public DapperyApiException(string message, HttpStatusCode statusCode)
            : base(message)
        {
            StatusCode = statusCode;
            ApiErrors = new List<DapperyApiError>();
        }

        public HttpStatusCode StatusCode { get; }

        public ICollection<DapperyApiError> ApiErrors { get; }
    }
}
```

Now, there's an argument to be made about using exceptions [as control flow within an application](https://wiki.c2.com/?DontUseExceptionsForFlowControl) which is essentially what we're doing here, but I'll let that holy war continue on StackOverflow. For our simple use case, we'll use this exception to handle any sort of operation that cannot be performed to protect misinformation from reaching the lower level concerns and handle the situation with a global (at least within the scope of our API) exception handler in that layer that will decipher and determine the proper message to send back to consumers. We've also defined a `DapperyApiError` type that will encapsulate and be used as a translator of sorts to convey to consumers exactly what happened to cause the exception:

### DapperyApiError.cs

```csharp
namespace Dappery.Core.Exceptions
{
    public class DapperyApiError
    {
        public DapperyApiError(string errorMessage, string propertyName)
        {
            ErrorMessage = errorMessage;
            PropertyName = propertyName;
        }

        public string ErrorMessage { get; }

        public string PropertyName { get; }
    }
}
```

Our `DapperyApiException` and `DapperyApiError` will work in tandem to help to give us a predefined convention for handling any sort of error scenario within the core application layer so that we can easily contextualize the content of the error and pass the information back up rather than leaking bad state down to our other layers. We'll see in the API layer how we define a handler within our request pipeline to handle error scenarios in a somewhat graceful manner, though there are quite a few ways to do this. For now, our simple error and exception classes will work just fine, but we might want to rethink the approach at scale when coordinating between multiple API (micro)services, whether prosumer, or consumer. With the last piece of the infrastructure plumping out of the way, let's set our focus back on the commands and queries we're in the midst of writing.

Since we're building a (probably overcomplicated) CRUD solution, let's give users the option to retrieve and search for breweries. Let's create a `Queries` folder underneath our `Breweries` directory, and start off by creating another folder of `RetrieveBrewery`. After that's done, let's create a `RetrieveBreweryQuery.cs` file:

### RetrieveBreweryQuery.cs

```csharp
namespace Dappery.Core.Breweries.Queries.RetrieveBrewery
{
    using Domain.Media;
    using MediatR;

    public class RetrieveBreweryQuery : IRequest<BreweryResource>
    {
        public RetrieveBreweryQuery(int id) => Id = id;

        public int Id { get; }
    }
}
```

Easy enough, just a simple `IRequest` that will return a `BreweryResource` back to the consumer, given an ID to match on. With that out of the way, let's create a `RetrieveBreweryQueryValidator.cs` validator class to catch mischievous consumers that will try and invoke this operation and somehow manage to fool the ASP.NET Core route matching system:

### RetrieveBreweryQueryValidator.cs

```csharp
namespace Dappery.Core.Breweries.Queries.RetrieveBrewery
{
    using FluentValidation;

    public class RetrieveBreweryQueryValidator : AbstractValidator<RetrieveBreweryQuery>
    {
        public RetrieveBreweryQueryValidator()
        {
            RuleFor(b => b.Id)
                .NotNull()
                .NotEmpty()
                .WithMessage("Must supply an ID to retrieve a brewery")
                .GreaterThanOrEqualTo(1)
                .WithMessage("Must be a valid brewery ID");

        }
    }
}
```

Here, we define two validations in not allowing null IDs to propogate to this layer (shouldn't happen in the first place, since we did not declare the ID as nullable), and the ID should be greater than zero, as our table constraint is using the ID as an index and primary key. Next, let's define our query handler with a new `RetrieveBreweryQueryHandler.cs` class:

### RetrieveBreweryQueryHandler.cs

```csharp
namespace Dappery.Core.Breweries.Queries.RetrieveBrewery
{
    using System.Net;
    using System.Threading;
    using System.Threading.Tasks;
    using Data;
    using Domain.Media;
    using Exceptions;
    using Extensions;
    using MediatR;

    public class RetrieveBreweryQueryHandler : IRequestHandler<RetrieveBreweryQuery, BreweryResource>
    {
        private readonly IUnitOfWork _unitOfWork;

        public RetrieveBreweryQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BreweryResource> Handle(RetrieveBreweryQuery request, CancellationToken cancellationToken)
        {
            // Retrieve the brewery and clean up our resources
            var brewery = await _unitOfWork.BreweryRepository.GetBreweryById(request.Id, cancellationToken);
            _unitOfWork.Commit();

            // Invalidate the request if no brewery is found
            if (brewery is null)
            {
                throw new DapperyApiException($"No brewery found with ID {request.Id}", HttpStatusCode.NotFound);
            }

            // Map and return the brewery
            return new BreweryResource(brewery.ToBreweryDto());
        }
    }
}
```

This is about as standard as a retrieve request gets: attempt to grab the brewery from the database using our application repositories, clean up our resources, throw our custom exception for not found if no brewery was returned, and return the resource with a view model friendly representation of our brewery entity. While we're at the 'R' in CRUD, let's add an operation for our consumers to get a list of all breweries. Inside the `Brewery/Queries` folder, go ahead and create a `GetBreweries` folder, followed by a `GetBreweriesQuery.cs` class inside the newly created folder:

### GetBreweryQuery.cs

```csharp
namespace Dappery.Core.Breweries.Queries.GetBreweries
{
    using Domain.Media;
    using MediatR;

    public class GetBreweriesQuery : IRequest<BreweryResourceList>
    {
    }
}
```

Our simplest form of an `IRequest`, we're letting MediatR know that anytime a message is sent with the context of `GetBreweriesQuery`, the library will map that request to a `GetBreweriesQueryHandler` (below) and return a `BreweryResourceList`. Let's implement the handler:

### GetBreweryQuery.cs

```csharp
namespace Dappery.Core.Breweries.Queries.GetBreweries
{
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Data;
    using Domain.Media;
    using Extensions;
    using MediatR;

    public class GetBreweriesQueryHandler : IRequestHandler<GetBreweriesQuery, BreweryResourceList>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetBreweriesQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BreweryResourceList> Handle(GetBreweriesQuery request, CancellationToken cancellationToken)
        {
            // Retrieve the breweries and clean up our resources
            var breweries = await _unitOfWork.BreweryRepository.GetAllBreweries(cancellationToken);
            _unitOfWork.Commit();

            // Map our breweries from the returned query
            var mappedBreweries = breweries.Select(b => b.ToBreweryDto());

            // Map each brewery to its corresponding DTO
            return new BreweryResourceList(mappedBreweries);
        }
    }
}
```

As straightforward as a search request be, we're simply just grabbing all the breweries from the database, projecting each entity into its view model representation, and returning the list to the consumer. No execptions, and we also handle the case if there are no breweries in the database to just return an empty list (which we'll cover with a unit test). Now, since we're building just a small demo application, we _probably_ shouldn't be returning the entirety of records from the breweries table within the database. A more sound and performant implementation of this handler would be to pass query filters and options for pagination on the `GetBreweriesQuery`, so that we could refine our SQL and not have Dapper try to map every record to its corresponding C# POCO. Again, I'll leave this as an exercise for the reader, or maybe comeback on a rainy day to refactor this (most likely not, though). For Completeness, let's finish up our set of brewery operations by adding a delete command to our application by creating a `DeleteBrewery` folder nested within our `Breweries/Commands` directory, then creating a `DeleteBreweryCommand.cs` file:

### DeleteBreweryCommand.cs

```csharp
namespace Dappery.Core.Breweries.Commands.DeleteBrewery
{
    using MediatR;

    public class DeleteBreweryCommand : IRequest<Unit>
    {
        public DeleteBreweryCommand(int id) => BreweryId = id;

        public int BreweryId { get; }
    }
}
```

All we require for a delete command is just the ID, which we'll get from the API layer. Let's create a validator for the hooligans that might try and break the chain of command within the same `DeleteBrewery` directory:

### DeleteBreweryCommandValidator.cs

```csharp
namespace Dappery.Core.Breweries.Commands.DeleteBrewery
{
    using FluentValidation;

    public class DeleteBreweryCommandValidator : AbstractValidator<DeleteBreweryCommand>
    {
        public DeleteBreweryCommandValidator()
        {
            RuleFor(b => b.BreweryId)
                .NotNull()
                .WithMessage("Must supply the brewery ID");
        }
    }
}
```

We don't want to perform any delete request if we haven't an ID to validate the beer exists in the database, first and foremost. Again, since our delete command is correct by construction since we did _not_ tell the command to expect a nullable `int`, we should never<sup>tm</sup> see this behavior, but it doesn't hurt to have an extra layer of validation. Finally, let's finish up by implementing the `DeleteBreweryCommandHandler.cs` class:

### DeleteBreweryCommandHandler.cs

```csharp
namespace Dappery.Core.Breweries.Commands.DeleteBrewery
{
    using System.Net;
    using System.Threading;
    using System.Threading.Tasks;
    using Data;
    using Exceptions;
    using MediatR;

    public class DeleteBreweryCommandHandler : IRequestHandler<DeleteBreweryCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteBreweryCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(DeleteBreweryCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the brewery and invalidate the request if none is found
            var breweryToDelete = await _unitOfWork.BreweryRepository.GetBreweryById(request.BreweryId, cancellationToken);

            // Invalidate the request if no brewery is found
            if (breweryToDelete is null)
            {
                throw new DapperyApiException($"No brewery was found with ID {request.BreweryId}", HttpStatusCode.NotFound);
            }

            // Delete the brewery from the database and clean up our resources once we know we have a valid beer
            await _unitOfWork.BreweryRepository.DeleteBrewery(request.BreweryId, cancellationToken);
            _unitOfWork.Commit();

            return Unit.Value;
        }
    }
}
```

Again, no shenanigans here, as we retrieve the brewery first to validate it exists, handle the case of no brewery found, and remove it from the database and pass nothing but a `Unit.Value` (from the `MediatR` namespace) to signal the work we performed is finished and successful.

Alright, let's take a minute to breathe, as that was a lot of code we just cranked out. To cleanse our minds, I'll take a break from finishing our beer operations by showing some examples of how we might write some unit tests for this layer. [I'll leave this link](https://github.com/JoeyMckenzie/Dappery/tree/dappery-part-3-core-layer/tests/Dappery.Core.Tests) for the interested to scan through how I wrote each handler test (happy paths only). Using the `CreateBreweryCommandHandlerTest.cs` xUnit spec as an example:

### CreateBeerCommandHandlerTest.cs

```csharp
namespace Dappery.Core.Tests.Beers
{
    using System.Net;
    using System.Threading.Tasks;
    using Core.Beers.Commands.CreateBeer;
    using Domain.Dtos.Beer;
    using Domain.Entities;
    using Domain.Media;
    using Exceptions;
    using Shouldly;
    using Xunit;

    public class CreateBeerCommandHandlerTest : TestFixture
    {
        [Fact]
        public async Task GivenValidRequest_WhenBreweryExists_ReturnsMappedAndCreatedBeer()
        {
            // Arrange
            using var unitOfWork = UnitOfWork;
            var beerCommand = new CreateBeerCommand(new CreateBeerDto
            {
                Name = "Test Beer",
                Style = "Lager",
                BreweryId = 1
            });
            var handler = new CreateBeerCommandHandler(unitOfWork);

            // Act
            var result = await handler.Handle(beerCommand, CancellationTestToken);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldBeOfType<BeerResource>();
            result.Self.ShouldNotBeNull();
            result.Self.Brewery.ShouldNotBeNull();
            result.Self.Brewery?.Address.ShouldNotBeNull();
            result.Self.Brewery?.Address?.StreetAddress.ShouldBe("1030 E Cypress Ave Ste D");
            result.Self.Brewery?.Address?.City.ShouldBe("Redding");
            result.Self.Brewery?.Address?.State.ShouldBe("CA");
            result.Self.Brewery?.Address?.ZipCode.ShouldBe("96002");
            result.Self.Brewery?.Beers.ShouldBeNull();
            result.Self.Brewery?.Id.ShouldBe(1);
            result.Self.Brewery?.Name.ShouldBe("Fall River Brewery");
            result.Self.Id.ShouldNotBeNull();
            result.Self.Name.ShouldBe(beerCommand.Dto.Name);
            result.Self.Style.ShouldBe(beerCommand.Dto.Style);
        }

        [Fact]
        public async Task GivenValidRequest_WhenBreweryDoesNotExist_ThrowsApiExceptionForBadRequest()
        {
            // Arrange
            using var unitOfWork = UnitOfWork;
            var beerCommand = new CreateBeerCommand(new CreateBeerDto
            {
                Name = "Test Beer",
                Style = "Lager",
                BreweryId = 11
            });
            var handler = new CreateBeerCommandHandler(unitOfWork);

            // Act
            var result = await Should.ThrowAsync<DapperyApiException>(async () => await handler.Handle(beerCommand, CancellationTestToken));

            // Assert
            result.ShouldNotBeNull();
            result.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task GivenValidRequest_WithInvalidBeerStyle_ReturnsMappedAndCreatedBeerWithOtherAsStyle()
        {
            // Arrange
            using var unitOfWork = UnitOfWork;
            var beerCommand = new CreateBeerCommand(new CreateBeerDto
            {
                Name = "Test Beer",
                Style = "Not defined!",
                BreweryId = 1
            });
            var handler = new CreateBeerCommandHandler(unitOfWork);

            // Act
            var result = await handler.Handle(beerCommand, CancellationTestToken);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldBeOfType<BeerResource>();
            result.Self.ShouldNotBeNull();
            result.Self.Brewery.ShouldNotBeNull();
            result.Self.Brewery?.Address.ShouldNotBeNull();
            result.Self.Brewery?.Address?.StreetAddress.ShouldBe("1030 E Cypress Ave Ste D");
            result.Self.Brewery?.Address?.City.ShouldBe("Redding");
            result.Self.Brewery?.Address?.State.ShouldBe("CA");
            result.Self.Brewery?.Address?.ZipCode.ShouldBe("96002");
            result.Self.Brewery?.Beers.ShouldBeNull();
            result.Self.Brewery?.Id.ShouldBe(1);
            result.Self.Brewery?.Name.ShouldBe("Fall River Brewery");
            result.Self.Id.ShouldNotBeNull();
            result.Self.Name.ShouldBe(beerCommand.Dto.Name);
            result.Self.Style.ShouldBe(BeerStyle.Other.ToString());
        }
    }
}
```

We see that there are quite a few similarities with how we wrote unit tests for the data layer. We define a common `TestFixture` that our test files descend from in order to capture a clean test context between specs where all of our dependencies are wired up for us and guaranteed fresh for each test run. Then, we write just a few simple tests that cover each scenario we could possibly see within the `CreateBreweryCommandHandler` implementation by setting up the command, declaring and assigning a reference to the handler, and capturing the resulting `handler.Handle()` response to validate against. I won't include the other tests here for brevity, but I definitely encourage the curious out there to check out how I've written the other tests, and even more so encourage any method of where we might improve these tests.

In an effort to not bore you guys _too much_, I'll snap the chalk line for this post here, as the beer operations share a lot of the same ideas with how we wrote the brewery operations, and [I'll leave this link here](https://github.com/JoeyMckenzie/Dappery/tree/dappery-part-3-core-layer/src/Dappery.Core/Beers) for you guys to checkout how, exactly, we might write those commands and queries. For the most part, it'll feel eerily similar in setup, with just a few minor tweaks since we're working within the context of the child in the beer-brewery relationship. While this might seem like a lot of redundant, rather boilerplate-y code, I think we should discuss the tradeoffs of using MediatR with the CQRS pattern:

- Since we've separated commands from queries, we've implicitly created clearly defined boundaries within the core application layer
- If we want to add additional features, we can easily do so without fear of modifying existing behavior as we've compartmentalized each request in total isolation from one another
- We've greatly reduced number of states our application could possibly create, with a finite number of logical paths a request thread could take
- Notice we have no classical service-type classes as we we're deliberate about not creating an all encompassing service that would mix our commands and queries together
- While all this sounds great, one could also argue that we've complicated the code by adding such convention all over the place

At the end of the day, no matter how we implement the core application layer, it will still have just one responsibility - encompass all the business logic. We've seen that using MediatR, FluentValidation, and a few simple mappers, we can build a flexible, modular business logic layer that is easy to extend and modify to fit our business needs and requirements. In our next post, we'll _finally_ finish up our application by slapping an API layer on top of all the code we've written thus far and see if this thing actually works.

And with that... I think it's time for a beer. Cheers everyone!

import BlogLayout from '@/layouts/BlogLayout';

export default ({ children }) => <BlogLayout>{children}</BlogLayout>;

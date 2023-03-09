---
title: 'Rethinking exceptions in .NET'
description: 'Exceptions... exceptions everywhere!'
pubDate: 'Sep 21 2022'
heroImage: '/blog/rethinking-dotnet-exceptions/exceptions_meme.jpg'
category: '.NET'
---

I've recently undergone a courtship with Go and Rust, diving into each ecosystem in my spare time and even contributing to a few open source projects here and there in each language.
Being a .NET developer by day, I interact primarily with code and services written by other developers that may include quite a bit of control flow via throwing exceptions when any
erroneous scenario or non-desirable application state arises. While this may be the norm in .NET and quite frankly what .NET/Java developers hardened by the enterprise have been trained for years
to do as a first action during a fallible process, I've been conscientiously forcing myself to properly handle said fallible situations in a manner similar to what both Go and Rust offer
in regards to the error handling developer experience.

For those not familiar with Go or Rust, a fallible method (simply a function that could return an error) might look something like:

```go
func SomeFallibleFunction(name string) (string, error) {
    if name != "Joey" {
        return "", errors.New("That's not the name I was expecting!")
    }

    return "Hello, Joey!", nil
}
```

in Go, or similarly in Rust:

```rust
fn some_fallible_function(name: &str) -> Result<&str, &str> {
    if name != "Joey" {
        return Err("That's a terrible name!");
    }

    Ok("Nice to meet you, Joey!")
}
```

Running each of these examples in an executable context, it may look something like the following:

```go
package main

import (
  "errors"
  "log"
)

func main() {
    if result, err := SomeFallibleFunction("Joey"); err != nil {
        log.Printf("An error occurred: %v", err)
    } else {
        log.Printf(result)
    }
}

func SomeFallibleFunction(name string) (string, error) {
    if name != "Joey" {
        return "", errors.New("That's not the name I was expecting!")
    }

    return "Hello, Joey!", nil
}
```

with output along the lines of:

```bash
Hello, Joey!
```

Now, the Rust equivalent in its full glory:

```rust
fn main() {
    let result = some_fallible_function("Joey");

    if let Ok(response) = result {
        println!("{}", response);
    } else {
        println!("An error occurred: {}", result.unwrap_err());
    }
}

fn some_fallible_function(name: &str) -> Result<&str, &str> {
    if name != "Joey" {
        return Err("That's a terrible name!");
    }

    Ok("Nice to meet you, Joey!")
}
```

and running a simple `cargo run` in the command line of your choice produces the following:

```bash
Nice to meet you, Joey!
```

While each of these examples may seem a bit contrived, each conveys an idea that is core to either language in proper error handling: _explicitly_ signifying to callers that the method is _fallible_! Fallible methods
can be thought of as a contract between caller and callee - the caller understands that the callee may produce an undesirable result or state that _should_ be handled responsibly by the caller. Unfortunately, .NET does
not have a similarly equivalent error handling experience akin to Go or Rust in the base class library, and while not a fault of the language itself, it can be rather annoying to deal with codebases where the default
error handling precedent set by previous developers might be `throw`ing exceptions at every corner and littering said codebase with `try`/`catch` blocks often accompanied by some form of global
exception handler to swallow any unexpected exceptions that arise outside of our error handling blocks.

What this leads to, more often than not, is a breakdown in an application or service's architecture as we're allowing _control flow via exceptions_ (pause for audible gasps). If you've ever been exposed to languages
with GOTO statements (I cut my teeth with Fortran as my first real language during my undergrad), one can make the argument that exceptions as a form of control flow is nothing more than a sophisticated GOTO statement
in an application or service. There's a plethora of reasons you won't see named or GOTO statements in many modern languages, applications, and codebases but I'll primarily make the argument that it makes code difficult
to read, maintain, and extend as sensible control flow is essentially thrown out the window as we're allowing the flow of execution to sporadically jump lines anytime we see fit.

## Rusti-fying our .NET code

I'm not a fan of throwing exceptions, and I've been making the conscious effort to force myself to handle errors in a sane fashion as they arise rather than propagating them up the stack by `throw`ing them anytime an undesirable state in my application code is reached. As an experiment, let's take a look at Rust's [`std::result::Result`](https://doc.rust-lang.org/std/result/) type in an effort to take a monadic approach to wrap a method's outcome with a bit of metadata about the response. In a simple .NET 7 console app, let's define a result type that captures information about the desired resulting data should the method succeed, i.e. no exceptions occur, and also carries a bit of information about what types of errors we should expect in the case our processing fails:

```csharp
namespace ExceptionAlternatives;

internal class Result<TData, TError>
{
    private readonly TData? _data;

    private readonly TError? _error;

    public static Result<TData, TError> Ok(TData data) => new(data);

    public static Result<TData, TError> Err(TError error) => new(error);

    private Result(TData data) => _data = data;

    private Result(TError error) => _error = error;

    public bool IsOk => _data is not null && _error is null;

    public bool IsErr => !IsOk;

    public TData Unwrap()
    {
        if (_data is null)
        {
            throw new InvalidOperationException("Result data is null and cannot be accessed.");
        }

        return _data;
    }

    public TError UnwrapErr()
    {
        if (_error is null)
        {
            throw new InvalidOperationException("Result error is null and cannot be accessed.");
        }

        return _error;
    }
}
```

Let's breakdown what our `Result` type is encapsulating for us:

1. We provide two generic arguments in the form of `TData` and `TError` so that callers are aware of the type context a fallible function may return
2. We _internally_ track the state of the resulting data and any error that may occur as a result (no pun intended) of the processing that goes on in our method
3. We'll provide some simple `Result` type constructing methods to assist our methods in building our `Result` correctly without said methods having to worry about how to instantiate our `Result` type correctly, i.e. _correct-by-construction_
4. We provide some simple utilities to peek at the result data without having to directly deref any of our internally tracked `Result` state with the `IsOk` and `IsErr` auto-props
5. Finally, should our callers do their due diligence and confirm their `Result` either succeeded or failed, we provide a couple of methods to expose the data or error encapsulated by our `Result` object with the `Unwrap()` and `UnwrapErr()` methods

Using our `Result` in a contrived example, it may look something like the following out in the wild:

```csharp
using ExceptionAlternatives;

var successfulProcessing = await DoSomeFallibleProcessingThatSucceeds();
var failedProcessing = await DoSomeFallibleProcessingThatFails();

Console.WriteLine($"Result of {nameof(successfulProcessing)}");
Console.WriteLine($"Successful? - {successfulProcessing.IsOk}");
Console.WriteLine($"Errors? - {successfulProcessing.IsErr}");
Console.WriteLine($"Successful result: {successfulProcessing.Unwrap()}");

Console.WriteLine($"\nResult of {nameof(failedProcessing)}");
Console.WriteLine($"Successful? - {failedProcessing.IsOk}");
Console.WriteLine($"Errors? - {failedProcessing.IsErr}");
Console.WriteLine($"Error result: {failedProcessing.UnwrapErr()}");

async Task<Result<int, string>> DoSomeFallibleProcessingThatSucceeds()
{
    // Act like we're doing something...
    await Task.Delay(TimeSpan.FromMilliseconds(500));

    return Result<int, string>.Ok(42);
}

async Task<Result<int, string>> DoSomeFallibleProcessingThatFails()
{
    // Act like we're doing something again, but takes a bit longer...
    await Task.Delay(TimeSpan.FromMilliseconds(1000));

    return Result<int, string>.Err("Oh no! Processing failed :(");
}
```

Running our code, we see the following printed out in the console:

```bash
Result of successfulProcessing
Successful? - True
Errors? - False
Successful result: 42

Result of failedProcessing
Successful? - False
Errors? - True
Error result: Oh no! Processing failed :(
```

Sweet! While the first set of processing results may not be all that interesting, our second attempt at processing failed and provided our context of the failure _without_ `throw`ing an exception and muddying up our code with unnecessary `try`/`catch` blocks! While this feels a lot better (personally) to code against in a real-world scenario, we still need to address one bit of code in our `Result` type.

We still `throw` an exception when a user attempts to `Unwrap()` the `Result`'s internal data in the case that data does not exist. Similar to Rust's `std::result::Result` type which `panic`'s (Rust's version of crashing an application) in the case a caller attempts to access said data, we `throw` in an attempt to protect the `Result` object from handling up invalid or `null` data. In our case, our `Result` type _expects_ a non-`null` data type to be the underlying data context in our `Result` object. We could extend this to allow for handling `null`able values, but I'll leave that as an exercise for the reader.

Secondly, in our `DoSomeFallibleProcessingThatFails()` method, we're not guaranteed the ongoing processing will not panic inside that method - we expect that all the stuff that goes on in that method is itself infallible which may not be the case. If we we're talking to a database, for example, an exception outside of our code (maybe internal to the BCL) may be thrown in the case the connection string is malformed or our result set can't be mapped. We'd most likely be better off wrapping the execution context of `DoSomeFallibleProcessingThatFails()` in a `try`/`catch` block, returning an `Ok` result if all goes well while passing back an `Err` in the case our `catch` block needs to execute logic.

## Throwing exceptions _when it matters_

While I've been touting that we should refrain from `throw`ing exceptions in our .NET code, that does **not** mean that we should _never_ `throw` exceptions; simply put, **throw exceptions when it matters**.

How should we determine when and where to `throw` exceptions and use `try`/`catch` blocks? For me, the age-old question is accompanied by the age-old answer - _it depends_.

Does our application require loading in some critical configuration to properly run without error? Probably good to `throw` on startup if our configuration can't be found, read properly, or loaded into application memory/cached for whatever reason.

Do we rely on calls to third-party libraries or APIs that don't necessarily share our same radical `Result`-based ideology? That's a great use case for surrounding that bit of connecting code with a `try`/`catch` while internally propagating those outbound results as a `Result` type in our application code.

## Wrapping up

Exceptions have their time and place - as I've grown in my software career, I find that my personal developer growth comes in the form of identifying _when_ and _where_ it may be appropriate to `throw` and surround bits of code in `try`/`catch` blocks rather than relying on them as a crutch for ease of control flow. What this translates to, more or less, is forcing callers and callees to properly handle error cases _as they arise_ rather than making it the next stack frame's problem. Unfortunately, humans are not perfect. Code is written by humans (most of the time), and therefore _can_ be imperfect itself, not accounting for erroneous scenarios that might be outside our peripheral.

Until next time, friends!

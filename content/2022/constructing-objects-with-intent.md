---
title: 'Constructing objects with intent'
description: 'Build better object APIs with named constructors and fluent builders!'
pubDate: 'Nov 03 2022'
heroImage: '/images/objects-with-intent/constructors_meme.jpg'
category: 'design'
keywords:
  - design
  - software patterns
  - .net
  - rust
---

I've been becoming increasingly annoyed, both by legacy code and modern frameworks, with the amount of non-constrained
object construction that occurs within a codebase. That's a bunch of developer jargon, so what does all that mean
exactly? If a developer is working on a feature within a codebase they might be unfamiliar with, it's far too easy to
instantiate objects at will with zero constraints with some process downstream in an area of code tucked away in a dark
corner expecting the developer to have _correctly_ constructed said object. To me, this feels a lot like the "read my
mind" mentality that occurs between employers and disgruntled employees in the workplace: the employer expects something
to happen without communicating to the employee that intent (I think we've all experienced this regardless of industry).
How does this translate to code? Let's take a simple example from C#.

Let's say I'm working in a codebase that validates addresses. The address structure may look something like:

```csharp
public sealed record Address
{
    public string Street { get; init; }

    public string City { get; init; }

    public string State { get; init; }
}
```

If a friendly developer wanted to create a new `Address`, it's up to them to understand how the `Address` record is to
be instantiated _and_ understand any downstream business logic validation, processes, etc. that involve the `Address`
object. As it stands, a developer could _in theory_ instantiate an `Address` while forgetting to set the street, city,
and state. Not very helpful, as we'll have no way of identifying a user's location if no information is provided. To get
around this, we use constructors with the help of C#'s record type:

```csharp
public sealed record Address(string Street, string City, string State);
```

Now, any developer looking to work with an `Address` object should reasonably expect all the fields to be populated.
Inevitably, a requirement comes along from the product team requesting only the address street to be required, not city
and state (don't ask me, I don't make the rules around here). So naturally, we might add another constructor:

```csharp
public sealed record Address
{
    public Address(string street, string city, string state)
    {
        Street = street;
        City = city;
        State = state;
    }

    public Address(string street)
    {
        Street = street;
        City = string.Empty;
        State = string.Empty;
    }

    public string Street { get; }

    public string City { get; init; }

    public string State { get; init; }

    public void PrintAddress()
    {
        var addressParts = new List<string>
        {
            Street
        };

        if (!string.IsNullOrWhiteSpace(City))
        {
            addressParts.Add(City);
        }

        if (!string.IsNullOrWhiteSpace(State))
        {
            addressParts.Add(State);
        }

        Console.WriteLine(string.Join(", ", addressParts));
    }
}
```

We added a constructor that requires the street while defaulting the city and state to empty strings rather than `null`
for sanity. While it's easy enough to use object initializers instead, i.e.

```csharp
var someAddress = new Address
{
    Street = "123 Code Street"
};
```

We add constructors to classes and structures to enforce object creation is _correct-by-construction_: the internals of
constructing an object, especially those more complex, are better off encapsulated from consumers so we don't have to
worry about leaking business logic/rules out from their intended domain. Inevitably, more requirements come along so we
add _more_ constructors

```csharp
public sealed record Address
{
    public Address(string street, string city, string state)
    {
        Street = street;
        City = city;
        State = state;
    }

    public Address(string street, string city)
    {
        Street = street;
        City = city;
        State = string.Empty;
    }

    public Address(string street)
    {
        Street = street;
        City = string.Empty;
        State = string.Empty;
    }

    public string Street { get; }

    public string City { get; init; }

    public string State { get; init; }

    public void PrintAddress()
    {
        var addressParts = new List<string>
        {
            Street
        };

        if (!string.IsNullOrWhiteSpace(City))
        {
            addressParts.Add(City);
        }

        if (!string.IsNullOrWhiteSpace(State))
        {
            addressParts.Add(State);
        }

        Console.WriteLine(string.Join(", ", addressParts));
    }
}
```

So now, our consumers have to choose between three different ways to properly construct the address information. While
this is "fine" for the most part, I find it often more helpful to add contextual object constructors, a.k.a methods to
an object that _clearly conveys_ what context the object is to be constructed with:

```csharp
public sealed record Address
{
    private Address(string street)
    {
        Street = street;
        City = string.Empty;
        State = string.Empty;
    }

    private Address(string street, string city)
    {
        Street = street;
        City = city;
        State = string.Empty;
    }

    private Address(string street, string city, string state)
    {
        Street = street;
        City = city;
        State = state;
    }

    public static Address FromStreet(string street) => new(street);

    public static Address FromStreetAndCity(string street, string city) => new(street, city);

    public static Address FromFullAddress(string street, string city, string state) => new(street, city, state);

    public string Street { get; }

    public string City { get; }

    public string State { get; }

    public void PrintAddress()
    {
        var addressParts = new List<string>
        {
            Street
        };

        if (!string.IsNullOrWhiteSpace(City))
        {
            addressParts.Add(City);
        }

        if (!string.IsNullOrWhiteSpace(State))
        {
            addressParts.Add(State);
        }

        Console.WriteLine(string.Join(", ", addressParts));
    }
}
```

Now, when consumers want to interact with an `Address` object, we provide context as to the address they're
constructing:

```csharp
// We don't allow consumers to construct an address however they'd like, they MUST construct it in ways we offer
var addressWithStreetOnly = Address.FromStreet("123 Code Street");
addressWithStreetOnly.PrintAddress();

var addressWithStreetAndState = Address.FromStreetAndCity("123 Code Street",  ".NETville");
addressWithStreetAndState.PrintAddress();

var fullAddress = Address.FromFullAddress("123 Code Street", ".NETville", "CA");
fullAddress.PrintAddress();
```

Although we still provide constructors, they're now `private` so we can further constrain how consumers instantiate
an `Address` to help avoid pesky "missing data/property" bugs. We can think of these `static` builders on our `Address`
record as _named constructors_, which come in handy when we need multiple variations of object construction.

## Fluent builders for complex objects

Oftentimes, our constructed objects might contain a hodge-podge of properties that may or may not necessarily support
one another. I find implementing fluent builders, in this case, to help allow consumers to instantiate their objects in
a manner they see fit. Using builders, we offer a _fluent_ like API to callers allowing them to customize exactly what
the object they're looking to build should look like. In terms of C#, we're looking for something along the lines of:

```csharp
var someFluentlyBuiltObject = new AwesomeFluentBuilder()
    .WithFoo("Bar")
    .WithAnswerToLife(42)
    .WithOpinion("Lord of the Rings is better than Star Wars")
    .Build();

Debug.Assert(string.Equals(someFluentlyBuiltObject.Foo, "Bar"));
Debug.Assert(someFluentlyBuiltObject.AnswerToLift, 42);
Debug.Assert(string.Equals(someFluentlyBuiltObject.Opinion, "Lord of the Rings is better than Star Wars"));
```

I opt to use the `WithProperty()` convention to make it clear to consumers of my code that the object they're
constructing will contain whatever data they will correspond to that property's value - somewhat subject, but I feel the
intention is clear. Let's take a look at a more fleshed out, yet contrived, example in Rust as I've been having somewhat
of an obsession lately with the language and ecosystem. Seriously, the joy of using cargo alone makes me instantly
annoyed whenever I'm _not_ working in a Rust context. Let's fluently build some pizzas with Rust.

This isn't a post about Rust necessarily, so I'll defer to the rustaceans much smarter and more well-versed in the
language than myself to deep dive into idiomatic Rust. The concept remains, however - our public API should offer a
pizza `struct` that can be consumed by callers. While a caller _could_ in theory, construct they're own pizza, we should
offer them a convenient way to make pizzas without worrying about the internal details of constructing said pizza.

We can think of it as the exchange of transactions that occurs when one walks into their favorite pizza joint:

- We order at the register providing the establishment with a list of requirements we'd like our pizza to meet
- We make an exchange of currency after detailing what our pizza should look/taste like
- After some time, we receive a pizza at our table - hopefully accompanied by a nice cold adult beverage

Let's see if we can model this scenario in code:

```rust
#[derive(Debug, Default)]
pub struct Pizza {
    pub crust: Crust,
    pub toppings: Toppings,
    pub sauce: Sauce,
}

#[derive(Debug)]
pub enum Crust {
    Regular,
    Thin,
    DeepDish,
}

impl Default for Crust {
    fn default() -> Self {
        Crust::Regular
    }
}

type Toppings = Vec<Topping>;

#[derive(Debug)]
pub enum Topping {
    Cheese,
    Pepperoni,
    Onions,
    BellPeppers,
    Mushrooms,
    Sausage,
    Custom(String),
}

#[derive(Debug)]
pub enum Sauce {
    Red,
    White,
}

impl Default for Sauce {
    fn default() -> Self {
        Sauce::Red
    }
}
```

A `Pizza` should contain a `Crust`, `Sauce`, and a plethora of `Topping`s. While callers of our public API could build a
pizza themselves, we want to make it as easy as possible to build such a pizza without worrying about how to ladle the
sauce, toss the dough, shred the mozzarella, etc. Let's add a fluent builder our users can interact to build their
perfect `Pizza`:

```rust
use crate::pizza::Crust;
use crate::pizza::Pizza;
use crate::pizza::Sauce;
use crate::pizza::Topping;

pub struct PizzaBuilder {
    pizza: Pizza,
}

impl PizzaBuilder {
    pub fn new() -> Self {
        Self {
            pizza: Pizza::default(),
        }
    }

    pub fn with_crust(self, crust: Crust) -> Self {
        Self {
            pizza: Pizza {
                crust,
                ..self.pizza
            },
        }
    }

    pub fn with_sauce(self, sauce: Sauce) -> Self {
        Self {
            pizza: Pizza {
                sauce,
                ..self.pizza
            },
        }
    }

    pub fn with_topping(self, topping: Topping) -> Self {
        let mut toppings_mut = self.pizza.toppings;

        toppings_mut.push(topping);

        Self {
            pizza: Pizza {
                toppings: toppings_mut,
                ..self.pizza
            },
        }
    }

    pub fn build(self) -> Pizza {
        self.pizza
    }
}
```

For those unfamiliar with Rust, we won't hang up on the details here. Our builder simply offers methods on
the `PizzaBuilder` struct, consuming whatever the previous version of its internal `Pizza` state through `self`, and
creates a new internal state containing the previous pizza state with slight modifications depending on what property we
might be updating on the `Pizza` we'll hand back to consumers. When we finally `build()` this `Pizza`, we simply hand
back the internally managed pizza state.

Consuming our `PizzaBuilder` might look something like:

```rust
use crate::{
    pizza::{Crust, Sauce, Topping},
    pizza_builder::PizzaBuilder,
};

mod pizza;
mod pizza_builder;

fn main() {
    let double_pepperoni = PizzaBuilder::new()
        .with_crust(Crust::Regular)
        .with_sauce(Sauce::Red)
        .with_topping(Topping::Cheese)
        .with_topping(Topping::Pepperoni)
        .with_topping(Topping::Pepperoni)
        .build();

    println!("{:?}", double_pepperoni);

    let deep_dish = PizzaBuilder::new()
        .with_crust(Crust::DeepDish)
        .with_sauce(Sauce::Red)
        .with_topping(Topping::Cheese)
        .with_topping(Topping::Sausage)
        .with_topping(Topping::Mushrooms)
        .build();

    println!("{:?}", deep_dish);

    let white_pie = PizzaBuilder::new()
        .with_crust(Crust::Thin)
        .with_sauce(Sauce::White)
        .with_topping(Topping::BellPeppers)
        .with_topping(Topping::Onions)
        .with_topping(Topping::Custom("Anchovies".to_owned()))
        .build();

    println!("{:?}... ugh, anchovies...", white_pie);
}
```

Running our code gives us an output along the lines of"

```shell
Pizza { crust: Regular, toppings: [Cheese, Pepperoni, Pepperoni], sauce: Red }
Pizza { crust: DeepDish, toppings: [Cheese, Sausage, Mushrooms], sauce: Red }
Pizza { crust: Thin, toppings: [BellPeppers, Onions, Custom("Anchovies")], sauce: White }... ugh, anchovies...
```

Sweet! We're building fluent pizzas on the fly without having to leak details on pizza internals to consumers.

In short, it's often better to constrain object construction for consumers _if your intent_ as the code owner is to have
such consumers utilize your objects in a predefined manner. In essence, we should aim to help consumers build objects
_with intent_ rather than letting them run wild with unconstrained creation.

Until next time, friends!

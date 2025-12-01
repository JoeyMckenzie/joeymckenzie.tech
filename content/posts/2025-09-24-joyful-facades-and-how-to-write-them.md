---
title: Joyful facades and how to write them
slug: joyful-facades-and-how-to-write-them
description: '[Queue sparking a holy war of facades vs. contacts]'
image: assets/images/454b23e8-5bf9-4c11-b161-5dd86e5bbcde_1_105_c.jpeg
tag_id: 1
storage_key: 2025-09-24-joyful-facades-and-how-to-write-them
---

So lately I've been taking a hike off Mt. Dogma and re-approaching the Laravel projects I work with a fresh mind.
While
my time with Laravel has been relatively brief, finding my way to the framework sometime around 2022, I've been working
in other languages and ecosystems throughout my decade-ish long career as a software developer. My time in Java and .NET
in the mid-to-late aughts indoctrinated the principles of the enterprise that I still hold with me today. Though, This
isn't a blog post about SOLID, CUPID, or whatever the hell acronym we're going by these days.

When I'm really digging something, I like to write about it, and I'm long overdue for one of my internet programming
rambles on here on the homestead. Facades, and how they broke through my thick dependency injection framework-wired
brain, feels like the perfect topic at the move.

TL;DR - I think I've truly found the _joy_ of using facades.

## What's in a facade?

Like all good stories, they start from the beginning. I keep my copy of the
holy [Gang of Four](https://en.wikipedia.org/wiki/Design_Patterns) texts within arm's reach in my office. When I'm
bored, or looking to jog my memory of why I was OOP-pilled in the first place, I crack it open to distract me from
providing shareholder value for 15 minutes or so every once in a while. There's structural pattern the gang writes about
called the [facade pattern](https://en.wikipedia.org/wiki/Facade_pattern) \*_foreshadowing intensifies_\*. If you want
the academic definition of it, it's a fascinating 30 minute read. I'll skip the ceremony of a lengthy explanation here
as there's no shortage of devs much more equipped in the noggin than myself that can explain the technical aspect of the
facade pattern.

For the regular Joe's of us out there, facades enabling working with complex objects easier. In plain english, a facade
is wrapper around a rather involved class, or set of classes, that provides simplified APIs to access the underlying
object(s), often time easing the interaction for the outside world.

Taking a play out of the pretty much any "clean code"-esque style book, imagine we're writing software to help brewers
brew beer. Being a craft snob, I'm overdue for a good beer-based analogy. To brew a batch of the perfect programmer's
IPA, we've got a few moving pieces to handle:

- Heating water to a specific temperature
- Mashing grains and converting starches
- Lautering to separate wort from grain
- Boiling wort with hop additions at precise intervals
- Rapidly chilling the wort to yeast-safe temps
- Transferring to a fermenter
- Pitching yeast and managing fermentation

Modeling this interaction in code might look something like:

```php
$kettle->heatWater(155);
$mashtun->addGrains($recipe->grains);
$mashtun->holdTemp(60);
$lauteringSystem->run();
$kettle->boil(60);
$kettle->addHops($recipe->hops, $timingSchedule);
$chiller->coolTo(68);
$fermenter->transfer($kettle->getWort());
$fermenter->pitchYeast($recipe->yeast);
$fermenter->startFermentation();
```

We've got five actors in `$kettle`, `$mashtun`, `$lauteringSystem`, `$chiller`, `$fermenter` each seemingly with their
own dependencies and semantics. It would be much simpler if we could _just_ do something like:

```php
$brewery->brew($recipe);
```

That, more or less, is the facade pattern in a nutshell. You may often find it dressed up as a `BreweryManager`,
`BreweryService`, `BreweryOrchestrator`, or some other enterprise-y noun. But it all means the same thing: make a
complicated process simple.

## Laravel-izing

If you're using Laravel, chances are you're already familiar with a few of the facade centerpieces the framework offers:

- `Route`
- `Cache`
- `Confing`
- `Validator`
- etc.


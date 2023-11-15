---
title: 'Rustful statement machines and event driven design'
description: "A hobbyist Rustacean's ode to the Gang of Four."
pubDate: 'Oct 23 2023'
heroImage: '/blog/ziggin-around/meme.jpg'
category: 'rust'
keywords:
    - rust
    - state machines
    - design patterns
---

Back in action, and I'm fresh off a hiatus while raising a little one. I can safely say that I _definitely_
underestimated
what being a new parent would entail. Needless to say, as a break from changing diapers, I thought it would be fun to
get some
thoughts out on the blog here.

First, I want to say **thank you** to those that have been reaching out via email with kind words regarding the mostly
craft beer-driven
word adventures I have here on the blog - if you like what's going on here, give me
a [shout](mailto:joey.mckenzie27@gmail.com)!
With the pleasantries out of the way, let's dive back into our regularly schedule program of exploring things a bit
outside our
8 to 5 comfort zone.

I've been writing way too many step functions in AWS lately, and I've grown somewhat of an interest in the topic of
state machines.
Coincidentally, I've also taken quite a liking to PHP (pause for audible gasps) and Laravel. Couple
with [Jake Bennett's talk on
state machines in Laravel](and state machines) at the 2023 Laracon US, I thought it would be a fun thought/finger typing
experiment
to explore what state machines would like in Rust.

I've been skimming a newly bought copy of the [Gang of Four's holy text](https://en.wikipedia.org/wiki/Design_Patterns)
of design patterns,
and had immersed in state machines so much I've applied them to the my six month old's daily routine. I thought it would
be fun to...

(**Warning**: dad joke ahead)

shake the _rust_ off my blogging hiatus by implementing state patterns in Rust.

## State machines and you

State machines are (in my lowly opinion) one of my favorite design patterns. Couple with event driven designs, using
stateful patterns
allows me to think of my application as a time series - as frames advance throughout the request cycle's lifetime, I can
think of
my handlers as first responders to an event my API happens to capture.

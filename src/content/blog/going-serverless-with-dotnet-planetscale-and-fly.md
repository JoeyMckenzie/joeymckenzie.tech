---
title: 'Going serverless with .NET, PlanetScale, and Fly'
description: 'Because who wants to manage their database infrastructure in 2023?'
pubDate: 'May 31 2023'
heroImage: '/blog/serverless-dotnet-planetscale-fly/planetscale_meme.jpg'
category: '.NET'
published: false
---

Another day, another post about something serverless. Keeping true to form over my last few posts, I've been messing around with just about everything serverless everything for personal projects. I recently delved into yet another implementation of GitHub's [RealWorld](https://github.com/gothinkster/realworld) spec, as I tend to do when exploring new languages and ecosystems, and Go was the language of choice this time around.

I've written a few implementations of the spec and I always seem to find my way back to it when experimenting with new things, and I've had the itch to write more Go lately utilizing a few cool tools I've found in the ecosystem. I ended up writing [my RealWorld Go](https://github.com/JoeyMckenzie/realworld-go-kit) implementation with some neat Go libraries, though mainly spearheaded by [Go Kit](https://github.com/go-kit/kit), [chi](https://github.com/go-chi/chi), [slog](https://pkg.go.dev/golang.org/x/exp/slog), and [sqlx](https://github.com/jmoiron/sqlx). To make things more interesting, I threw [PlanetScale](https://planetscale.com/) in the mix to spice things up a bit as I'm getting a bit SQL Server'd out as a full-time .NET developer.

That got me thinking though: what about going off the beaten .NET path and leveraging all the neat edge-based SaaS services available to us in 2023? I've doing .NET now for three-quarters of a decade (shameless resume metric boost) and quite frankly I'm a bit annoyed at the embracing of modern SaaS and dev tooling available in other ecosystems and the stigma .NET gets when it comes to blazing trails. Oftentimes, those not involved in the .NET community equate .NET developers to rather out-of-date and crusty run by corporate managers that look something like:

![corporate bob](/blog/serverless-dotnet-planetscale-fly/old_manager_meme.jpg)

In the modern day, this is simply not true for .NET anymore. Gone are the days of ".NET only works on Windows" and Corporate Code Andy's (CCA for short) wrapping factories with factories so they can manage their factories easier.

Having spent the majority of my career in the corporate enterprise writing Java and .NET, Corporate Code Andy's still exist and are alive and well in many industries, but they seem to be coming around more often to the modern re-branding of .NET with the current SDKs and runtimes.

While this post won't be spent talking about the modern .NET landscape for the readers outside the ecosystem, we'll touch on a few highlights as we explore integrating .NET with new shiny serverless toys in [PlanetScale](https://planetscale.com/) and [Fly](https://fly.io/).

We'll take an [existing schema](https://github.com/JoeyMckenzie/realworld-go-kit/blob/main/schema.sql) I've written for the aforementioned Go project, make some changes and explore what schema management looks like with PlanetScale, then finally deploy a containerized version of the app to Fly. If you're unfamiliar with Fly, I've recently written about deploying [Rust apps to Fly](/blog/learning-to-fly-with-rust-postgres) that should serve as a solid base for hitting the ground running with the platform. We'll skim over the details for now, and get right into the code.

## Getting started

Before we get going, let's game plan what our simple app will do:

- We'll spin up a mighty slim ASP.NET 7 web app that will connect to a PlanetScale database
- We'll make some queries at a couple of endpoints, then insert some rows at others
- We'll write to STDOUT as we're not exactly building a rocket ship that requires ELK-level observability
- We'll deploy to Fly, managing our production environment along the way via Docker
- We'll celebrate with a beer as we embrace the edge .NET!

Let's get up and running by first scaffolding out an ASP.NET project. I'm Ubuntu 22.04 through WSL2, so your mileage will vary if you're running on Windows or macOS:

```bash
dotnet new webapi -n WithPlanetScale
```

And once the scaffold is finished, let's get rid of the `WeatherForecast.cs` files and everything in the `Controllers` folder. In fact, let's just `rm -rf` that folder altogether. ASP.NET controllers are [relics of the stone age](https://ardalis.com/mvc-controllers-are-dinosaurs-embrace-api-endpoints/) and should be laid to rest going forward for all new .NET development in place of ASP.NET's [endpoint routing](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/routing?view=aspnetcore-7.0). I've been using endpoint routing in production at work on the services I maintain with great success leading to a much better DX - being free of the baggage and tribal knowledge encapsulated in controllers is a great feeling.

Next, let's add a few dependencies to help us facilitate talking with our PlanetScale database (we'll get into _what_ exactly PlanetScale offers in a bit).

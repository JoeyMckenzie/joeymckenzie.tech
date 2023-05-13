---
title: 'Migrating to Astro'
description: 'Astro, Svelte, and Rust walk into a bar...'
pubDate: 'Mar 15 2023'
heroImage: '/blog/migrating-to-astro/astro_meme.jpg'
category: 'astro'
---

During a recent quarter (third?) life crisis, I decided to do what every developer does when they need something to work on - I rewrote my blog from the ground up. I consider rebuilding personal blogs/portfolios a right of passage and have so far been able to squeeze a rewrite out about once every two years.

Are the rewrites ever justified? No.

Were the previous iterations functional enough for my needs? Yes.

Am I eventually going to rewrite it again in a few years? Probably.

## Diminishing focus on content

My previous portfolio/blog was written with [next.js](https://nextjs.org) and while it satisfied all my developer needs to produce content, write posts, etc. I wanted to go back to the drawing board as I find I was focusing more on framework detail concerns rather than what my blog was intended to be - a resource for developer content. I was quickly losing sight of writing new content regularly and was seeking a return to basics.

## Astro to the rescue

Enter [astro](https://astro.build/), a web framework focused on content rather than framework internals. With astro, the focus is on shipping the minimal amount of JS to the client for blazingly fast<sup>tm</sup> static websites. My blog is nothing more than static content, and astro seemed like the perfect choice with the icing on the cake being their recently shipped [content collections](https://docs.astro.build/en/guides/content-collections/) allowing developers to write type-safe markdown content.

What's even better about astro are the various [UI integrations](https://docs.astro.build/en/core-concepts/framework-components/) that users can plug and play for when rich interactivity is needed. Better yet, astro allows for full control of _how_ the interactive framework components should be shipped to the client. This leads us to the concept of [component islands](https://jasonformat.com/islands-architecture/), or rich interactive sections of a web page that are individualistic from their static peers. Astro was built on the [concept of islands](https://docs.astro.build/en/concepts/islands/), allowing users to bring in interactive JS _without_ affecting the rest of the page.

What this leads to, in practice, is being able to selectively choose bits of the page to be interactive (i.e. require JS) without holding up the rendering of the rest of the page. Astro components are isolated from one another, in this sense, and default to statically rendered HTML which means _wicked_ fast page loading.

This ultimately allowed me to build a primarily static site with content in markdown (this blog you're reading, for example) while giving me the ability to bring in my JS framework of choice in [Svelte](https://svelte.dev/) for "micro" components. I refer to the integration components as "micro" as they're simply a rendered subset of the entire static site - we're not working within the context of a full-blown Svelte web application.

## Statically dynamic

Inevitably, I hit a point where rich interactivity was needed to interact with the Spotify API, adding a bit of flare to my site in the form of a widget to display whatever song/podcast I might be listening to at the moment (shout out to [Lee Robinson](https://leerob.io/), he had this on a previous version of his site). Since astro is meant for primarily content-driven static websites, the SSG that astro runs pulls in all the necessary data at build time, which meant the calls to the Spotify API were snapshots of whatever I had happened to be listening to at build time rather than in real-time.

While there were multiple ways to attack the problem of providing rich interactivity and real-time Spotify data, I went with Svelte to build out a small widget that simply retrieved data from Spotify on page load. The only issue I had with this approach was exposing my Spotify refresh token for authentication and my hashed client credentials (not a _huge_ issue, but one could use the hash to retrieve access tokens).

## Keeping things secure

_In theory_, anyone could simply open a dev tools window and inspect the outbound requests to Spotify, grab my token, and start making requests to Spotify on my behalf - not great, as I'd eventually hit a quota/threshold in the number of calls in this scenario if this were to happen. While not a _huge deal_ as the song/podcast I'm currently listening to isn't exactly top-secret security clearance level information, I didn't want to have to deal with swapping my client credentials and rotating my refresh token regularly.

The solution?

Move the Spotify API interaction behind a serverless function. This approach allowed me to hide my credentials on the server without risk of exposure and simplifies the data fetching components on the frontend, as they're simply just retrieving the most basic information they need to display the Spotify widget without having to sift through giant JSON responses to pull out the necessary data each time a page is loaded on my site.

## Simply serverless

Since I host using [Vercel](https://vercel.com/), the most obvious solution was to use edge functions... but where's the fun in that? I write JS/TS all the time, and quite frankly, I was ready for a change of pace.

Another option was to [enable SSR](https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project) with astro, but then I lose the benefits of SSG. Astro's SSR also requires an adapter to the hosting platform to be installed and configured, and while not a painful task to do by any means, it would require a bit of lifting and shifting if I woke up tomorrow and decided to deploy to [Cloudflare Pages](https://pages.cloudflare.com/) instead of Vercel.

I've been looking for an excuse to write as much [Rust](https://www.rust-lang.org/) as humanly possible in my day-to-day developer tasks, and this was the perfect opportunity to use it.

So, I had a few options. I could write my own Rust web server and host it on [fly.io](https://fly.io/), [DigitalOcean](https://www.digitalocean.com/), etc. but that would have required me to manage the infrastructure a bit more closely than I would have cared for. There's also a Rust runtime for [AWS lambda functions](https://docs.aws.amazon.com/sdk-for-rust/latest/dg/lambda.html), but again, this would require more AWS infrastructure management from me for such a simple use case.

## If _can_ be written in Rust, it _will_ written Rust

Enter [shuttle](https://shuttle.rs/), a relatively new platform providing users the ability to write serverless Rust functions and simply deploy on their infrastructure - little to no management on my end, fully capable of doing anything you want in Rust. Perfect!

At the end of the day, I'm not exactly writing mission-critical production code - I just need data from Spotify.

But... I don't want to use JS/TS.

And I don't want to want to fall back into SSR as I'll miss out on some nice benefits of SSG.

And I want to write Rust.

So let's do all of that.

## Many hours later

Fast-forward some time, and with the help of shuttle, I was able to spin up a mighty small [axum](https://docs.rs/axum/latest/axum/) server with a single route to call out to Spotify, get some data, and marshal it into a simple response for the frontend end all while securely keeping my credentials and refresh token hidden from the outside world.

When a page on my site loads, astro sends the necessary JS to render the Svelte Spotify widget (as you can see in the footer), and once loaded the component calls out to my serverless Rust function. Neat!

For the curious, all of the serverless Rust code can be found [here](https://github.com/JoeyMckenzie/joey-mckenzie-tech/tree/main/src/serverless) in the same repository that hosts this blog.

## Wrapping up

Project rewrites can be fun, allowing for the exploration of new technologies and language ecosystems as I'm sure we've all seen at one point or another during a company migration of existing services onto the latest shiny thing in the dev world.

You can find all the source code of my most recent portfolio iteration on my [GitHub](https://github.com/JoeyMckenzie/joey-mckenzie-tech) - feel free to fork your version!

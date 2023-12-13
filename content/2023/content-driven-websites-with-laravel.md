---
title: 'Content-driven websites with Laravel'
description: "It's PHPin' time!"
pubDate: 'Dec 13 2023'
heroImage: '/images/migrating-to-laravel/meme.jpg'
category: 'laravel'
keywords:
    - php
    - laravel
---

Alright, I'm making this one short (I _almost_ promise). My pre-New Year's Resolution is to write on my blog here more
than
bi-annually. Since becoming a dad and taking up my jorts-laden mantle becoming alarmingly interested in grass mowing
techniques and
New Balance footwear this past year, finding the time to write has come too far and between (betwixt?).

I was recently on the hunt for something new to learn and after laughing at
memes on
[r/webdev](https://reddit.com/r/webdev/) about PHP for far too long, I figured I had better at least learn a little PHP
to understand the source of the meme'ery in the first place. Learning PHP ultimately brought me
to [Laravel](https://laravel.com/),
and oh... my... god... do I feel betrayed by my fellow developers for dunking on PHP without telling me about the
abundant Lambos running rampant in the Laravel ecosystem. I've been writing a bunch of Rust to keep my brain occupied
outside my normal 8-to-5 and PHP was a breath of fresh air.

If you're a full-time TypeScript/.NET'er with a sprinkle of other languages like Go and Rust here and there like me, PHP
might seem like an afterthought. I can confidently say that after embarking down the Laravel/PHP road, I'm more than
happy I did.

I thought it would be fun to write a bit about the process of learning Laravel through re-writing my website from a few
different iterations of JS frameworks and give some insight from a newcomers perspective about Laravel and PHP.

## Framework exhaustion

I'm a creature of habit, and one thing I've formed somewhat of a ritual around is re-writing my website, the very one
you happen to be reading, at least once a year. I've gone through a few iterations:

- Static site generators with Hugo and Jekyll
- SSR frameworks
  with [Next.js](https://github.com/JoeyMckenzie/joeymckenzie.tech/tree/archive/blog-v1), [Nuxt.js](https://github.com/JoeyMckenzie/joeymckenzie.tech/tree/archive/nuxt-v2),
  and [SvelteKit](https://github.com/JoeyMckenzie/joeymckenzie.tech/tree/archive/svelte)
- At one point, a combo of [Astro and Rust](https://github.com/JoeyMckenzie/joeymckenzie.tech/tree/archive/astro-rust)
  that formed an interesting mix of SSG and [island architectures](https://docs.astro.build/en/concepts/islands/) for
  fetching dynamic data

Quite frankly, I'm burnt out on JS framework madness, though to no fault of their own. There's many that are innovating
and pushing the ecosystem forward with cool new technology that I'll get to use in production five years from now if I'm
lucky. Each iteration I re-wrote wrangled a hodge podge of JS libraries for certain things I wanted to do, including but
not limited
to:

- Parse markdown
  content ([contentlayer](https://contentlayer.dev), [gray-matter](https://www.npmjs.com/package/gray-matter)) and
  highlight code snippets ([highlight.js](https://highlightjs.org/), [shiki](https://shiki.matsu.io/))
- Store things in a database with a bit of magic
  abstraction ([prisma](https://prisma.io), [drizzle](https://orm.drizzle.team/))
- Calling external APIs through framework semantics, which differ from framework to framework

And a plethora of other things. The nice thing about Laravel is that a lot of this is out-of-the-box functionality so
I can indulge in my slice-of-the-internet playground that is my website.

## Making code great again

I found that while re-building my site with Laravel, I was having fun writing code in a new way than working with a JS
flavor of the month framework. My .NET brain felt right at home with Laravel, all the while being able to mix and match
frontends thanks to [Inertia.js](https://inertiajs.com) (I'm not quite ready to
embrace [Livewire](https://livewire.laravel.com/) just yet). Anything I wanted to do, Laravel had an answer:

- Syncing content to the database on
  startup? [Console commands](https://laravel.com/docs/10.x/artisan#generating-commands).
- Querying content? [Eloquent](https://laravel.com/docs/10.x/eloquent).
- Built-in caching, an HTTP client, and just about anything you'll need for the general web

I'm glutton for punishment and Rust-level strict typing, so [phpstan](https://phpstan.org/) with the
help [larastan](https://github.com/larastan/larastan) cranked up to the max scratched that itch. I'm currently
in the process of trimming down the things I don't need with Laravel, which ultimately entails things
like removing auth-based middleware, migrations, and models since I have no intention of managing users.

## Servers

Using [Laravel Forge](https://forge.laravel.com/) and a DigitalOcean droplet, I'm able to turn the server provisioning
part of my brain completely off and simply write code, commit, and push. Forge does just about everything for you when
deploying application servers, including setting up MySQL, PHP versions, server tooling, SSL, etc. I was even able to
tweak the deployment script so I could refresh/sync my markdown content with the database. You're probably thinking "
wait... why do you have a database in the first place?" There's a few reasons for that.

I use [torchlight](https://torchlight.dev/) for syntax highlighting in content, and storing the parsed content in the
database means I only need to pay the price of content highlighting once at deployment time. I also like to keep track
of views on each blog, so I need some form of persistent storage. I also like to keep my notes in there (one of my few
pieces of website flair) where I can simply SSH to my droplet and _drop_ into (no pun intended)
a [tinker](https://laravel.com/docs/10.x/artisan#tinker) sesion to create more notes, so something like this just works
when I
want to add a new note without a GUI component:

```shell
# On the droplet...

root@website /home/forge/joeymckenzie.tech $ php artisan tinker
Psy Shell v0.11.22 (PHP 8.3.0 — cli) by Justin Hileman

> \App\Models\Note::create(['title' => 'Networking', 'description' => 'I have no clue how SSL truly works.']);
= App\Models\Note {#7285
    title: "Networking",
    description: "I have no clue how SSL truly works.",
    +updated_at: "2023-12-11 23:04:02",
    +created_at: "2023-12-11 23:04:02",
    +id: 5,
  }
```

I can also generate sitemaps on startup too which is "stupid easy" (as the kids say) with the help of
Spatie's [Laravel sitemap library](https://github.com/spatie/laravel-sitemap) paired with a console command:

```php
<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\BlogPost;
use Illuminate\Console\Command;
use Spatie\Sitemap\SitemapGenerator;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-sitemap';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generates the sitemap.';

    /**
     * Generates a sitemap for all the SEO goodness
     */
    public function handle(): void
    {
        /** @var string $url */
        $url = config('app.url');
        
        // Build the sitemap key that will ultimately live in the public directory
        $publicPath = public_path();
        $outputFile = "$publicPath/sitemap-index.xml";
        
        // Grab a list of the slugs from the database so we can
        // dynamically generate the different entries of the map
        $slugs = BlogPost::select(['slug', 'updated_at'])->get();
        $siteMap = SitemapGenerator::create($url)->getSitemap();

        // Roll through each entry, mapping each to a sitemap entry with a low priority change value
        collect($slugs)
            ->each(function (BlogPost $blogPost) use ($siteMap) {
                $slug = $blogPost->slug;
                $siteMap
                    ->add(Url::create("/blog/$slug")
                        ->setPriority(0.5)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setLastModificationDate($blogPost->updated_at?->toDate() ?? now()));
            });

        // Finally, add the static pages as well
        $siteMap
            ->add(Url::create('/about')
                ->setPriority(0.5)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY))
            ->add(Url::create('/now')
                ->setPriority(0.5)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY))
            ->writeToFile($outputFile);
    }
}
```

And in my Forge deployment script, I can simply:

```shell
# Other stuff...

if [ -f artisan ]; then
    $FORGE_PHP artisan migrate --force
    $FORGE_PHP artisan app:sync-content
    $FORGE_PHP artisan app:generate-sitemap
fi
```

Easy... almost _too_ easy.

# Inertia

Okay, so I know I'm somewhat dunking on JavaScript in this post, but truth be told... I still love JS. I've had jobs
working with each of the Big Three<sup>tm</sup> frameworks in Angular, Vue, and React. I've begrudgingly been using
React because I'm lazy and (what seems like) one of the few that enjoy JSX. With Inertia and React, that means I can use
things like [shad](https://ui.shadcn.com/) for getting that clean Tailwind look (there's also
a [Vue](https://www.shadcn-vue.com/) and [Svelte](https://www.shadcn-svelte.com/) I used in the previous versions), and
all the neat React things that are out in the wild. If it's on the web, there's probably a React library for it.

I'm a fan of [pnpm](https://pnpm.io/) as a drop in replacement for npm, and I've also decided to
ditch [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for [biome](https://biomejs.dev/), another drop
in
replacement for both, written in Rust (like all good tooling nowadays). I've had my fair share of battles over the years
with both eslint and prettier, and also getting them to play nice together (shout out
to [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)). While they're fundamentally different
things, i.e. formatting vs. linting, I think the argument could be made they're in the same family of code quality
tools. Biome neatly wraps them up into a single tool and _just works_. Inertia has SSR too, which boils down to simply
having to run an `artisan` command on deployment to spin up your Node.js server where ever it may be and point Laravel
to it. With Forge, it's _literally_ the flip of a switch.

# Deployment

I'm a big fan of GitHub Actions, and while I _could_ just trigger Forge deploys based on the latest push, it's easy
enough to setup a simple action to ping the deployment URL to tell Forge to pull in my code and deploy the latest
version of it to the droplet. I like to display the latest commit in the footer, so I also needed a way to propagate the
git commit SHA as an environment variable. Unfortunately, Forge only has the SHA available at deployment time.
_Fortunately_, it's easy enough to work around by pulling in the latest configuration for production via the Forge CLI,
appending the SHA as an environment variable, and simply pushing it back up to Forge before the deployment script runs.

All-in-all, this is what my deploy action looks like:

```yml
name: Deploy to Forge

on:
    workflow_run:
        workflows: [ 'Inertia CI' ]
        types:
            - completed

jobs:
    build:
        runs-on: ubuntu-latest
        timeout-minutes: 10

        name: Deploy application
        steps:
            -   uses: actions/checkout@v3

            -   name: Setup PHP
                id: setup-php
                uses: shivammathur/setup-php@v2
                with:
                    php-version: '8.3'

            -   name: Install Forge CLI
                run: composer global require laravel/forge-cli

            -   name: Authenticate with Forge
                run: forge login --token=${{ secrets.FORGE_API_TOKEN }}

            # Forge environment variables, including the current git commit hash,
            # aren't included as runtime environment variables and only in the build script.
            # To get the current commit propagated, pull the current production configuration,
            # and append the current commit to the file and push it back up to Forge.
            -   name: Download current configuration
                run: forge env:pull joeymckenzie.tech ${{ github.workspace }}/.env

            -   name: Add current commit
                run: |
                    echo FORGE_DEPLOY_COMMIT=${{ github.sha }} >> ${{ github.workspace }}/.env
                    forge env:push joeymckenzie.tech ${{ github.workspace }}/.env

            -   name: Ping deploy URL
                run: curl -l ${{ secrets.FORGE_DEPLOY_URL }}
```

Setting a few environment variables, badda bing, badda boom, and everything works.

## Wrapping up

Alright, I promised to keep it short.

In the end, is Laravel probably overkill for my simple little website? Absolutely.

Is it fun to over-engineer such things, though? Ab-so-lutely.

I'm looking forward to seeing what else I can conjure up with Laravel to give myself a reason to explore all the various
nooks and crannies of the framework as I'm not a full-time Laravel developer (yet...). All the code that powers my blog
is available on GitHub [here](https://github.com/JoeyMckenzie/joeymckenzie.tech).

TL;DR - Laravel is friggin' sweet.

Until next time, friends! 

---
title: 'Content-driven websites with PHP and Laravel'
description: "It's PHPin' time!"
pubDate: 'Dec 13 2023'
heroImage: '/images/migrating-to-laravel/meme.jpg'
category: 'laravel'
keywords:
    - php
    - laravel
---

Alright, I'm making this one short (sort of). My pre-New Year's Resolution is to write on my blog here more
than bi-annually. Since becoming a dad and taking up my jorts-laden mantle and becoming alarmingly interested in grass
mowing techniques and New Balance footwear this past year, finding the time to write has come too far and between
(betwixt?).

I was recently on the hunt for something new to learn and after laughing at memes
on [r/webdev](https://reddit.com/r/webdev/) about PHP for far too long, I figured I had better at least learn a little
PHP
to understand the source of the meme'ery in the first place. Learning PHP ultimately brought me
to [Laravel](https://laravel.com/),
and oh... my... god... do I feel betrayed by my fellow developers for dunking on PHP without telling me about the
abundant Lambos running rampant in the Laravel ecosystem. I've been writing a bunch of Rust to keep my brain occupied
outside my normal 8-to-5 and PHP was a breath of fresh air.

If you're a full-time TypeScript/.NET'er working with a sprinkle of other languages like Go and Rust here and there like
me, PHP might seem like an afterthought. I can confidently say that after embarking down the Laravel/PHP road, I'm more
than happy I did.

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
not limited to:

- Parsing markdown
  content ([contentlayer](https://contentlayer.dev), [gray-matter](https://www.npmjs.com/package/gray-matter)) and
  highlighting code snippets ([highlight.js](https://highlightjs.org/), [shiki](https://shiki.matsu.io/))
- Storing things in a database with a bit of magic
  abstraction ([prisma](https://prisma.io), [drizzle](https://orm.drizzle.team/))
- Calling external APIs through framework semantics, which differ from framework to framework
- Caching content pages as I don't update them often

And a plethora of other things. The nice thing about Laravel is that a lot of this is out-of-the-box functionality so
I can indulge in my slice-of-the-internet playground that is my website.

## Making code great again

I found that while re-building my site with Laravel, I was having fun writing code in a new way that I was missing when
using the JS flavor of the month framework. My .NET brain felt right at home with Laravel, all the while being able to
mix and match frontends thanks to [Inertia.js](https://inertiajs.com) (I'm not quite ready to
embrace [Livewire](https://livewire.laravel.com/) just yet). Anything I wanted to do, Laravel had an answer:

- Syncing content to the database on
  deployment? [Console commands](https://laravel.com/docs/10.x/artisan#generating-commands).
- Querying content? [Eloquent](https://laravel.com/docs/10.x/eloquent).
- Built-in caching, an HTTP client, and just about anything you'll need for the general web

The goal of this post will be to outline what I think makes Laravel great from the context of a PHP/Laravel outsider
even for a small, mostly static website like mine.

## DI from the start

Coming from .NET, I clutch onto my DI framework pearls tightly, rarely loosening my grip. I'll even die on the hill that
.NET's first-party dependency injection framework (when used within it's expected confines) is one of the better DI
frameworks out there (I've enjoyed it _much_ more than Spring's DI with magical `@autowire`s on every bean).

I like to _think_ I'm not that much of a DI container shill after writing a few things in Rust and Go, and while they
have there place and time when serving a viable purpose, are nice to work with _when used correctly_. I see a lot of
.NET in the wild attempting to bend `ServiceProvider`s to their application's will, creating a poor man's service
locator within a service locator (I'm guilty as charged).

With Laravel, binding contracts to concretes is simple and straight forward. Coupled with route-provider binding
built-in DI, it quite literally felt like I was back at home writing a modern .NET application.

## Strict linting opt-in

I'm glutton for punishment and Rust-level strict typing, so [phpstan](https://phpstan.org/) with the
help [larastan](https://github.com/larastan/larastan) cranked up to the max scratched that itch. I'm currently
in the process of trimming down the things I don't need with Laravel, which ultimately entails things
like removing auth-based middleware, migrations, and models since I have no intention of managing users. While max level
phpstan requires a few tweaks to a freshly scaffolded [Laravel Breeze](https://github.com/laravel/breeze) app, once
those tweaks were made that mainly consisted of a few typing hints here and there, everything worked as expected.
Coupled with [fswatch](https://github.com/emcrisostomo/fswatch), I got the same DX as I'm used to with Rust akin to
running something like `cargo watch -x clippy` with the help of [cargo-watch](https://crates.io/crates/cargo-watch).
Better yet, hiding said `fswatch` command behind a [justfile](https://github.com/casey/just) made it seamless to
integrate phpstan continuously while I was writing code:

```shell
default: pail

# runs tail logging
pail:
    php artisan pail

# syncs content to the database
sync:
    php artisan app:sync-content

# continuously runs lint on file change
lint:
    fswatch -o app/ | xargs -n1 -I{} sh -c "composer run lint"
```

and in my terminal:

```shell
$ just lint # which runs `fswatch -o app/ | xargs -n1 -I{} sh -c "composer run lint"` by proxy

> vendor/bin/phpstan analyse app


Note: Using configuration file /Users/jmckenzie/projects/php/joeymckenzie.tech/phpstan.neon.
 40/40 [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%


 [OK] No errors
```

Beautiful! Any source code change within my `app/` directory triggered a full linting run to make sure I was holding
myself accountable for not letting my code go to shit (pardon my French).

Side note, composer is easily up there with cargo competing for best language toolchain on the market. I mean come on
JavaScript... why do we need four different package managers?

## Content syncing

One of the things I need is the ability to continuously sync markdown content with the database I store it in, which in
my case is just a MySQL instance running on my droplet provisioned with the help of Laravel Forge (more on that later).
Rather than writing some one off shell script to do that, I found Laravel commands mighty useful to simply just define a
custom artisan command that would:

- Read my content files
- Parse the frontmatter on each markdown file
- Parse the markdown and convert it to HTML
- Save everything to the data to the database

That ended up looking something like:

```php
<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Contracts\ContentUtilityContract;
use App\Models\ContentMeta;
use Illuminate\Console\Command;
use Throwable;

final class SyncContent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-content';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs content from markdown files into the database.';

    /**
     * Execute the console command.
     *
     * @throws Throwable
     */
    public function handle(ContentUtilityContract $contentUtility): void
    {
        $files = $contentUtility->getMarkdownFilePaths();
        collect($files)
            ->map(fn (string $filePath) => $contentUtility->getParsedContent($filePath))
            ->each(fn (ContentMeta $contentMeta) => $contentUtility->upsertBlogPost($contentMeta));
    }
}
```

Coming from .NET, I'm a self diagnosed [LINQ](https://learn.microsoft.com/en-us/dotnet/csharp/linq/) addict. Collections
made me feel right at home. From the above, I'm configuring a short pipeline of sorts that will do all the things I
outlined with a little help from the DI container and the `ContentUtilityContract`:

```php
<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\BlogPost;
use App\Models\ContentMeta;
use League\CommonMark\Exception\CommonMarkException;
use League\Config\Exception\ConfigurationExceptionInterface;

interface ContentUtilityContract
{
    /**
     * @return string[]
     */
    public function getMarkdownFilePaths(): array;

    /**
     * @throws ConfigurationExceptionInterface
     * @throws CommonMarkException
     */
    public function getParsedContent(string $filePath): ContentMeta;

    public function upsertBlogPost(ContentMeta $contentMeta): BlogPost;
}
```

and whose implementation looks something like:

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ContentUtilityContract;
use App\Models\BlogPost;
use App\Models\ContentMeta;
use Illuminate\Support\Facades\Log;
use League\CommonMark\ConverterInterface;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterParser;
use Override;

final readonly class MarkdownUtility implements ContentUtilityContract
{
    private ConverterInterface $converter;

    public function __construct(ConverterInterface $converter)
    {
        $this->converter = $converter;
    }

    #[Override]
    public function getMarkdownFilePaths(): array
    {
        $basePath = base_path();
        $contentPath = "$basePath".'/content';

        Log::info("identified content path as $contentPath, globbing content files");

        /** @var string[] $files */
        $files = app()->environment() === 'local'
            ? glob("$contentPath/**/*.md", GLOB_BRACE)
            : glob("$contentPath/*[!draft]/*.md", GLOB_BRACE);

        $fileCount = count($files);

        Log::info("$fileCount globbed files found");

        return $files;
    }

    #[Override]
    public function getParsedContent(string $filePath): ContentMeta
    {
        Log::info("parsing content for file $filePath");

        /** @var string $contents */
        $contents = file_get_contents($filePath);
        $fileInfo = pathinfo($filePath);
        $extension = empty($fileInfo['extension'])
            ? ''
            : '.'.$fileInfo['extension'];
        $fileSlug = basename($filePath, $extension);

        Log::info("file parsed, determined slug as $fileSlug");

        $frontMatterParser = new FrontMatterParser(new SymfonyYamlFrontMatterParser());
        $parsedContent = $frontMatterParser->parse($contents);
        $frontMatter = $parsedContent->getFrontMatter();
        $markdown = $parsedContent->getContent();
        $html = $this->converter->convert($markdown)->getContent();

        Log::info('frontmatter and content parsed');

        return new ContentMeta($fileSlug, $markdown, $html, $frontMatter);
    }

    #[Override]
    public function upsertBlogPost(ContentMeta $contentMeta): BlogPost
    {
        $contentSlug = $contentMeta->slug;

        Log::info("upserting blog post $contentSlug");

        $upsertedBlog = BlogPost::updateOrCreate([
            'slug' => $contentSlug,
        ], [
            'slug' => $contentSlug,
            'title' => $contentMeta->frontMatter->title,
            'description' => $contentMeta->frontMatter->description,
            'category' => $contentMeta->frontMatter->category,
            'published_date' => $contentMeta->frontMatter->pubDate,
            'hero_image' => $contentMeta->frontMatter->heroImage,
            'keywords' => implode(',', $contentMeta->frontMatter->keywords),
            'raw_content' => $contentMeta->markdown,
            'parsed_content' => $contentMeta->html,
        ]);

        Log::info('blog content updated!');

        return $upsertedBlog;
    }
}
```

Now from what I've gathered... folks in the PHP community don't exactly _love_ `final` classes - I have no intention on
inheriting from these classes and like to follow a composition approach as often as possible (though not always).

Now anytime I want to sync my content, a simple

```shell
$ artisan app:sync-content
```

does the trick! Note: I'm a lazy developer, so my `~/.zshrc` configuration has an alias:

```shell
alias artisan="php artisan"
```

I could probably be even lazier and shorten it, but that'll do for now.

## Servers

Using [Laravel Forge](https://forge.laravel.com/) and a DigitalOcean droplet, I'm able to turn the server provisioning
part of my brain completely off and simply write code, commit, and push. Forge does just about everything for you when
deploying application servers, including setting up MySQL, PHP versions, server tooling, SSL, etc. I was even able to
tweak the deployment script, so I could refresh/sync my markdown content with the database anytime a new deployment was
triggered. You're probably thinking "wait... why do you have a database in the first place?" There's a few reasons for
that.

I use [torchlight](https://torchlight.dev/) for syntax highlighting in content, and storing the parsed content in the
database means I only need to pay the price of content highlighting once at deployment time. I also like to keep track
of views on each blog, so I need some form of persistent storage. I _also_ like to keep my notes in there (one of my few
pieces of website flair) where I can simply SSH to my droplet and _drop_ (no pun intended) into
a [tinker](https://laravel.com/docs/10.x/artisan#tinker) session to create more notes, so something like this just works
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

I can also generate sitemaps on startup too which is "dumb easy" (as the kids say) with the help of
Spatie's [Laravel sitemap library](https://github.com/spatie/laravel-sitemap) paired with another console command:

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

And in my Forge deployment script, I can simply add the custom artisan command to generate a new sitemap everytime I
deploy:

```shell
# Other stuff...

if [ -f artisan ]; then
    $FORGE_PHP artisan migrate --force
    $FORGE_PHP artisan app:sync-content
    $FORGE_PHP artisan app:generate-sitemap
fi
```

Simple!

# Inertia

Okay, so I know I'm somewhat dunking on JavaScript in this post, but truth be told... I still love JS. I've had jobs
working with each of the Big Three<sup>tm</sup> frameworks in Angular, Vue, and React. I've begrudgingly been using
React because I'm lazy and (what seems like) one of the few that enjoy JSX. With Inertia and React, that means I can use
things like [shad](https://ui.shadcn.com/) for getting that clean Tailwind look (there's also
a [Vue](https://www.shadcn-vue.com/) and [Svelte](https://www.shadcn-svelte.com/) versions I used in the previous
iterations), and
all the neat React things that are out in the wild. If it's on the web, there's probably a React library for it.

I'm a fan of [pnpm](https://pnpm.io/) as a drop in replacement for npm, and I've also decided to
ditch [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for [biome](https://biomejs.dev/), another drop
in replacement for both tools, written in Rust (like all good tooling nowadays). I've had my fair share of battles over
the years with both eslint and prettier, and also getting them to play nice together (shout out
to [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)). While they're fundamentally different
things, i.e. formatting vs. linting, I think the argument could be made they're in the same family of code quality
tools. Biome neatly wraps them up into a single tool that _just works_. So now when I want to lint or format my React
components, no more `.eslintrc.*` and `.prettierrc.*` files to deal with, just a single `biome.json` file:

```json
{
    "$schema": "https://biomejs.dev/schemas/1.4.1/schema.json",
    "organizeImports": {
        "enabled": true
    },
    "formatter": {
        "indentStyle": "space",
        "indentWidth": 4
    },
    "linter": {
        "enabled": true,
        "rules": {
            "recommended": true
        }
    }
}
```

Coupled with a neat biome command:

```shell
# When I want to format things
$ pnpm dlx @biomejs/biome format --write ./resources/js

# or, if I want to lint
$ pnpm dlx @biomejs/biome lint ./resources/js
```

Wrapping those up in my `package.json` `scripts` looks something like:

```json
{
    // Other stuff...
    "scripts": {
        "dev": "vite",
        "build": "tsc && vite build && vite build --ssr",
        "tailwind": "prettier --plugin prettier-plugin-tailwindcss --write ./resources/js",
        "check": "pnpm dlx @biomejs/biome check --apply ./resources/js",
        "fmt": "pnpm dlx @biomejs/biome format --write ./resources/js",
        "fix": "pnpm dlx @biomejs/biome lint --apply ./resources/js",
        "lint": "pnpm dlx @biomejs/biome lint ./resources/js",
        "ci": "pnpm dlx @biomejs/biome ci ./resources/js",
        "prepare": "git config core.hookspath .githooks",
        "pre-commit": "pnpm run tailwind && pnpm run check && pnpm run fmt"
    }
}
```

Now unfortunately, I'm not _entirely_ free of prettier just yet, as there's still no support for [Tailwind class sorting
in biome](https://github.com/biomejs/biome/discussions/164). I only use prettier to simply wrangle Tailwind classes,
then let biome do the rest.

Inertia has SSR too, which boils down to simply having to run an `artisan` command on deployment to spin up your Node.js
server where ever it may be and point Laravel to it. With Forge, it's _literally_ the flip of a switch.

One of the things I also needed was to display some common data on each page of my website, including on all the posts
themselves. In the footer, you'll see a Spotify widget that displays what I'm currently listening to and the current
build commit SHA the site was deployed with. With Inertia middleware, this was a simple addon to the existing configured
middleware:

#### app/Http/Middleware/HandleInertiaRequests.php

```php
<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Contracts\MusicTrackerContract;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

final class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    public function __construct(private readonly MusicTrackerContract $spotifyTracker)
    {
    }

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            // Propagate the commit information on every request
            'commit' => config('app.commit'),
            // Also propagate the current listening data from Spotify
            'spotify' => $this->spotifyTracker->getNowPlaying(),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ];
    }
}
```

and in my component footer:

#### resources/js/Components/SpotifyTracker.tsx

```tsx
export default function SpotifyTracker({
                                           children,
                                       }: {
    children: React.JSX.Element;
}): React.JSX.Element {
    // Inertia has a pretty sweet hook allowing us to tap into common page properties
    const page = usePage();

    const nowPlaying = page.props.spotify as NowPlaying | undefined;
    const currentlyPlaying = nowPlaying?.nowPlaying ?? false;

    return (
        <>
            {currentlyPlaying && nowPlaying !== undefined && (
                <CurrentlyPlaying nowPlaying={nowPlaying}>
                    {children}
                </CurrentlyPlaying>
            )}
            {!currentlyPlaying && (
                <NotCurrentlyPlaying>{children}</NotCurrentlyPlaying>
            )}
        </>
    );
}
```

with the corresponding `PageProps` in `index.d.ts` changes:

```typescript
export type NowPlaying = {
    nowPlaying: boolean;
    albumImageSrc?: string;
    artist?: string;
    href?: string;
    trackTitle?: string;
};

export type Note = {
    title: string;
    description: string;
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    commit: string;
    laravelVersion: string;
    phpVersion: string;
    spotify?: NowPlaying;
    notes: Note[];
};
```

Now any page returned from an Inertia rendered route has all the common data available as React props. Pretty sweet,
huh?

## Rendering content

For displaying the content of a blog post route, Laravel's route-model binding offered everything I needed to get up and
running. Simply defining a route in my `web.php` like so:

```php
Route::get('blog/{slug}', fn (string $slug, ContentRepositoryContract $contentRepository) => Inertia::render('Blog/Post/Index', [
    'post' => $contentRepository->getBlogPostBySlug($slug),
]))
    ->name('post');
```

passes everything the page needs to render to the component responsible for rending content:

```typescript jsx
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import MainLayout from "@/Layouts/MainLayout";
import { type Post } from "@/models";
import { Head, Link } from "@inertiajs/react";
import * as React from "react";

export default function BlogPost({post}: { post: Post }): React.JSX.Element {
    const formattedDate = new Date(
        post.published_date ?? "",
    ).toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <>
            <Head title={`${post.title} | joeymckenzie.tech`}>
                <meta name="keywords" content={post.keywords}/>
            </Head>

            <MainLayout>
                <div className="flex flex-col justify-center">
                    <article
                        className="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-pre:text-sm prose-img:mx-auto prose-img:rounded-md">
                        <h1 className="text-center text-2xl">{post.title}</h1>
                        <div className="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight">
                            <time dateTime={post.published_date}>
                                {formattedDate}
                            </time>
                            <Badge>{post.category}</Badge>
                            <p>{post.views} views</p>
                        </div>
                        <img
                            alt={`${post.title} blog meme`}
                            src={post.hero_image}
                            height="400"
                            width="500"
                        />
                        <div
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled input
                            dangerouslySetInnerHTML={{
                                __html: post.parsed_content,
                            }}
                        />
                    </article>
                    <Link href={route("blogs")} className="mx-auto max-w-md">
                        <Button variant="secondary"> Back to blogs</Button>
                    </Link>
                </div>
            </MainLayout>
        </>
    );
}
```

A fairly simple component that ultimately takes the converted HTML content I've run through the nifty PHP League's
[CommonMark](https://commonmark.thephpleague.com/) library and spit out on the other side to `dangerouslySetInnerHTML`
within my React code.

Gathering the content is simple enough with the help of Eloquent too:

#### app/Services/BlogPostRepository.php

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ContentRepositoryContract;
use App\Models\BlogPost;
use DateInterval;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Override;

final readonly class BlogPostRepository implements ContentRepositoryContract
{
    #[Override]
    public function getBlogPostBySlug(string $slug): BlogPost
    {
        // We won't cache the blogs, easier to let the view counts ride
        $post = BlogPost::select([
            'id',
            'slug',
            'keywords',
            'hero_image',
            'published_date',
            'category',
            'title',
            'views',
            'parsed_content',
        ])->firstWhere('slug', $slug);

        if (is_null($post)) {
            abort(404);
        }

        // While we're at it, add a view count
        // AddView::dispatch($post);

        $post->views += 1;
        $post->save();

        return $post;
    }

    #[Override]
    public function getLatestBlogPostMetadata(): Collection
    {
        /** @var Collection<int, BlogPost> $posts */
        $posts = self::getBlogPostMetadata()
            ->sortByDesc('published_date')
            ->take(3);

        return $posts;
    }

    #[Override]
    public function getBlogPostMetadata(): Collection
    {
        if (Cache::has('allPosts')) {
            /** @var Collection<int, BlogPost> $allPosts */
            $allPosts = Cache::get('allPosts');

            return $allPosts;
        }

        /** @var Collection<int, BlogPost> $posts */
        $posts = BlogPost::select([
            'slug',
            'published_date',
            'category',
            'description',
            'title',
            'views',
        ])
            ->orderByDesc('published_date')
            ->get();

        Cache::set('allPosts', $posts, new DateInterval('PT5M'));

        return $posts;
    }
}
```

I'm not exactly a fan of the repository pattern on top of existing repository implementations - Eloquent is _already_ a
great implementation of the repository pattern. But... I like to keep my controllers/routes thin and also wanted to add
a bit a caching here and there as the content itself won't change much from deployment to deployment.

Which brings me to my next talking point...

# Deployments

I'm a big fan of GitHub Actions, and while I _could_ just trigger Forge deploys based on the latest push, it's easy
enough to set up a simple action to ping the deployment URL to tell Forge to pull in my code and deploy the latest
version of it to the droplet. I like to display the latest commit in the footer, so I also needed a way to propagate the
git commit SHA as an environment variable. Unfortunately, Forge only has the SHA available at deployment time.
_Fortunately_, it's easy enough to work around by pulling in the latest configuration for production via the Forge CLI,
appending the SHA as an environment variable, and simply pushing it back up to Forge before the deployment script runs.

One caveat to this process is that we want the append process to only append _if_ there's currently not a commit in
the `.env` file, while replacing the existing commit key-value pair if it already exists. A quick script like the follow
should get the job done:

```shell
#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <arg1> <arg2>"
  exit 1
fi

# Assign arguments to variables
key="$1"
value="$2"

# Check if the key already exists in the file
if grep -q "^$key=" .env; then
  # Replace the existing key-value pair
  sed -i "s/^$key=.*/$key=$value/" .env
else
  # Append the new key-value pair to the end of the file
  echo "$key=$value" >> .env
fi
```

We can then update our deploy workflow action to call this script, pass the key and SHA to it, and execute directly
before updating the production configuration. All-in-all, this is what my deploy action looks like:

```yaml
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

            -   name: Add current commit and push back to forge
                run: |
                    ./scripts/update-commit.sh FORGE_DEPLOY_COMMIT ${{ github.sha }}
                working-directory: ${{ github.workspace }}

            -   name: Push environment to Forge
                run: forge env:push joeymckenzie.tech ${{ github.workspace }}/.env

            -   name: Ping deploy.sh URL
                run: curl -l ${{ secrets.FORGE_DEPLOY_URL }}
```

Setting a few environment variables, badda bing, badda boom, and everything works.

## Wrapping up

Alright, I promised to keep it short.

In the end, is Laravel probably overkill for my simple little website? Absolutely.

Is it fun to over-engineer such things, though? Ab-so-lutely.

I'm looking forward to seeing what else I can conjure up with Laravel to give myself a reason to explore all the various
nooks and crannies of the framework as I'm not a full-time Laravel developer (yet...). All the code that powers my blog
is available on GitHub [here](https://github.com/JoeyMckenzie/joeymckenzie.tech). I'm just beginning my Laravel journey
and I'm well aware there's a _ton_ more to learn, but nonetheless, I'm quite excited to keep at it.

TL;DR - Laravel is friggin' sweet.

Until next time, friends!

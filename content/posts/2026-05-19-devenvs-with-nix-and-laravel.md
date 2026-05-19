---
title: Local Laravel with nix and devenv
slug: local-laravel-with-nix
description: "We have Herd at home."
image: assets/images/nix-meme.jpg
tag_id: 1
published_at: "2026-05-19"
storage_key: 2026-05-19-local-laravel-with-nix-and-devenv
---

I've been on a spiritual journey this past year or so really tinkering with my dev workflow and spending
an alarming amount of time in dotfiles tweaking this or that. It started off with tmux a couple years
ago and multiple failures to launch trying to get myself using neovim. Once I got to the point where
I physically couldn't leave my terminal (cue the "stuck in vim" memes), I moved onto finding
terminal replacements for tools I use and pay for (most of the time, happily). A few notable ones:

- [Postman](https://www.postman.com/) => [hurl](https://hurl.dev/)
- [JetBrains](https://www.jetbrains.com/) => [neovim (btw)](https://neovim.io/)
- [TablePlus](https://tableplus.com/) => [lazysql](https://github.com/jorgerojas26/lazysql)/[harlequin](https://github.com/tconbeer/harlequin)

I'm happy with my setup that I've fine tuned for Laravel and PHP, but I wanted to take it one step
farther and see if I could home grow a Herd replacement to save yet another subscription. I should
preface that **you should use, and happily pay for, Herd**. It's hands down the best Laravel/PHP
get-your-project-off-the-ground tool out there right now (imo). You can fiddle with Docker containers,
tweak volume paths, rage at how much storage Docker is filling up on your machine, etc. though Herd
is a one-time install that removes all the noise so you can focus on building stuff.

With that said, Herd can have some rough edges.

One of the things I've really embraced since letting Claude ~~run my life~~ help manage my workflow
is a worktree-first mindset allowing multiple agents to work on multiple things at once without
stepping on each other's robot toes. I even [wrote](/blog/wonderful-world-of-worktrees-and-laravel) about getting Herd setup for worktrees with the help of [worktrunk](https://worktrunk.dev/), another tool I've been
evangelizing to whoever will listen to me yap about it. While it's a fine solution (I think, at least),
it can always be made better. For example, your worktree setup has to know about Herd linking, which
configures nginx sites for you under the hood. That's global state as Herd has to run dnsmasq as root
to allow the use of portless `.test` domains. That's all fine, but a bit against the ethos of isolated
environments that worktrees aim to provide.

Another thing is global state, particularly with PHP and the associated services. In my experience,
Herd can often step on its own toes when spinning up services like FPM for specific versions of PHP.
If you're working on multiple projects across multiple PHP versions, or maybe the same project, but in a
branch/worktree that's upgrading a PHP version, you might run into port contention at some point and have
to do a round of process massacre to get back to a stable state. This compounds when running multiple versions
of PHP FPM as well, where the port contention can become painful sometimes with a handful of worktrees running
concurrently.

These are **not Herd's fault** at all. This is a result of trying to wrangle processes all in coordination
on a machine, which has been a thorn in the side of developers for as long as professional programming has
been a thing.

There's alternatives, though. And one alternative I've been particularly keen on is [nix](https://nixos.org/) with [devenv](https://devenv.sh/).

## Going Herd-less

One of the great things Herd does is manage services like Redis, your databases (MySQL, Postgres, etc.),
Typesense, mail, and a whole litany of stuff. Pretty much anything you need to run an app, Herd has a
managed process for it. One thing that I don't particularly _love_ about Herd, though, is how these services
are somewhat obfuscated from you and abstracted away. And rightfully so. I mean, we're building apps
and writing code (lmao, no we're not). I don't always want to deal with setting up databases and making sure
Redis is running. That's where Herd is _excellent_ for the DX, managing the stuff I don't really care about.

But sometimes, I do care about it. And the older I get, the more "control freak" I become where I want to
know exactly what's running in my dev environment at all times and how I can manage it.

That's where nix comes in. I won't go into much detail as I'm still a nix noob myself, but for what I'm using it
for, I can't see a world where I go back.

Nix provides a framework for declarative system builds for whatever you need. It's like a `composer.json` or
`package.json` file but for your machine environment. You tell nix via devenv that for a particular project you need PHP,
a specific version of it, what extensions you need, what database you need running, what version of Redis, etc.
You probably get the picture, but the biggest win is that these are defined in a file that you can version control,
tweak, manage, remove things, add services and tools, and anything else your project needs in its
environment to run. This alone is the perfect marriage for worktrees, where a worktree exists in _complete_
isolation from other worktrees where I'm free to tinker with its environment if I need to _without_ affecting
any other worktree. For example, if I'm doing a PHP 8.3 to PHP 8.4 upgrade, I keep `main` declaratively
pinned to 8.3, while my `feature/update-php-to-8.4` worktree branch pins itself to 8.4 with maybe a few
extra extensions and some `php.ini` tweaks and I can run both simultaneously in parallel without any headache.

> You can absolutely still do this in Herd. There's a few gotchas, though it's still doable (read the other blog post!)

[Devenv](https://devenv.sh/) is a layer that sits atop nix that makes it ridiculously simple to declare
what your project and environment needs to hit the ground running. All managed in a single `devenv.nix` file.
The real power here with devenv comes to light when taking a [bare repository layout](https://worktrunk.dev/tips-patterns/#bare-repository-layout) to your repository. What this means is instead of version controlled
project existing in a single folder where its `.git/` directory lives _within_ the repository folder itself,
you move `.git/` up a level as a sibling folder. This is perfect for worktree-driven development, as `.git/`
is global repository state, and all linked worktrees are just folders within a parent project folder. In practice,
this looks like:

```bash
my-awesome-project/
  .git/
  main/
  feature-foo-bar/
  fix-foo-baz/
```

Where `git switch` now becomes `cd` into whatever branch/worktree I need to be on. The git state is managed
globally among the worktrees, and there's no need for a dedicated worktrees folder where you might store
your worktrees.

Rewiring the ole noggin a bit, this approach to a project's version control goes hand-in-hand with
devenv, where each folder now gets its own runtime environment, from services, tools, secrets, etc.

But we're not exactly Herd-less yet. While devenv manages the things we need to run our apps, we still
need to see the dang thing run in a browser. That's where [Caddy](https://caddyserver.com/) comes in.

## Not your dad's web server

Caddy is the spiritual successor to nginx. It's fast, has a bunch of modern features, an nginx-like DSL,
written in Go, etc. I'm not a caddy expert, I just need local reverse proxying. That's what caddy helps
accomplish akin to how Herd uses nginx to forward those `my-awesome-project.test` requests to the correct
running instance of the app locally. For example, the caddy file for my website here looks like this:

#### joeymckenzie.tech.test.caddy

```caddy
joeymckenzie.tech.test {
  reverse_proxy 127.0.0.1:8100
}

assets.joeymckenzie.tech.test {
  reverse_proxy 127.0.0.1:5273
}
```

I keep all my caddy sites in my `~/.config/caddy/sites` folder and wire them up in a `Caddyfile` that nix
declaratively manages for me, like so:

#### `~/.config/nix-darwin/darwin/services.nix`

```nix
environment.etc."caddy/Caddyfile".text = ''
  {
    local_certs
  }

  import /Users/${username}/.config/caddy/sites/*.caddy
'';
```

I'm telling nix here that my system, when I build it, needs a `Caddyfile` running within `/etc` that
nix generates when I build my system. I'm glossing over a ton of details here, namely [nix-darwin](https://github.com/nix-darwin/nix-darwin)
and [home-manager](https://github.com/nix-community/home-manager) for declaratively managing my MacBook Pro,
but I promise I'll write about those soon. In the meantime, you can poke around my [nixfiles](https://github.com/JoeyMckenzie/nixfiles) if
you want to see the full setup. Skimming over the finer details, what this looks like in my
system declaration where I tell nix what services I want launched as background processes when I build is:

```nix
launchd.daemons.caddy = {
  serviceConfig = {
    ProgramArguments = [
      "${pkgs.caddy}/bin/caddy"
      "run"
      "--config"
      "/etc/caddy/Caddyfile"
      "--adapter"
      "caddyfile"
    ];
    RunAtLoad = true;
    KeepAlive = true;
    EnvironmentVariables = {
      HOME = "/var/root";
      XDG_CONFIG_HOME = "/var/root/.config";
      XDG_DATA_HOME = "/var/root/.local/share";
    };
    StandardOutPath = "/var/log/caddy.out.log";
    StandardErrorPath = "/var/log/caddy.err.log";
  };
};
```

Now when I rebuild my system via `nix-darwin`, caddy launches in the background and I have full access
to the `caddy` CLI to do whatever I need. More importantly, because I'm launching caddy as a background
process from the root, I get access to ports :80 and :443, so I can run my Laravel apps from a TLD without
specifying a port that it needs to run on. This is essentially what Herd does, but with nginx instead.

![Drew Carey meme](/assets/images/drew-carey-meme.png)

Now the other side of the coin: [dnsmasq](https://thekelleys.org.uk/dnsmasq/doc.html).

I wire caddy up so that it knows that any caddy file setup in `~/.config/caddy/sites` needs reverse proxying.
I'll get into _how_ exactly I do that in a bit, but the important information is that caddy knows that there's
sites it needs forward requests to that run on my local machine. _Something_ has to tell the browser though
that those requests actually need to go to `127.0.0.1`, the artist also known as `localhost`.

With dnsmasq, requests from the browser to a TLD like `.test` will ask `/etc/resolver/test` _where_ those
requests need to go. Dnsmasq answers that question with "to `127.0.0.1`, my guy," and all is good in the world.
With dnsmasq directing browser requests and caddy acting as a reverse proxy, `.test` domains work exactly as
they do with Herd. I setup dnsmasq as another launch service so that when I (re)build my system with nix,
it starts up alongside caddy and I'm off to the races:

```nix
services.dnsmasq = {
  enable = true;
  addresses = {
    test = "127.0.0.1";
  };
};

environment.etc."resolver/test".text = ''
  nameserver 127.0.0.1
'';
```

## Declarative nix files

Okay, that's enough networking for the week. Now to the fun stuff, actually running a dev environment for Laravel. For a full-fledged
Laravel app, we need a few things going for us:

- We need PHP and JavaScript (obviously)
- We need environment variables
- We need queues, so Redis and maybe Horizon
- We need a database: MySQL, Postgres, SQLite, etc.
- We might want full-text search with meilisearch or typesense
- We might need feature flags with LaunchDarkly
- ...and any other service that our app needs to run

And that's where nix joins us once again, to set those things up for us in an isolated development shell, hidden from
the outside world. The devenv [docs](https://devenv.sh/getting-started/) will do a better job of getting
you setup with nix and devenv than I ever will, so I highly encourage you to give them a quick once over.

Within a project, you can run `devenv init` to get a pretty bare bones setup for a `devenv.nix` file:

```nix
{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/packages/
  packages = [ pkgs.git ];

  # https://devenv.sh/languages/
  # languages.rust.enable = true;

  # https://devenv.sh/processes/
  # processes.dev.exec = "${lib.getExe pkgs.watchexec} -n -- ls -la";

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  scripts.hello.exec = ''
    echo hello from $GREET
  '';

  # https://devenv.sh/basics/
  enterShell = ''
    hello         # Run scripts directly
    git --version # Use packages
  '';

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    git --version | grep --color=auto "${pkgs.git.version}"
  '';

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
```

This is a basic devenv nix file. The nix DSL is pretty human friendly, but there's a whole language
manual worth a lazy Sunday afternoon read. A nix file is basically a recipe to tell nix how to construct
the development shell you'll be working in, declaring what languages, tools, and services you might need
to get the project running.

That `{ pkgs, lib, config, inputs, ... }:` block at the top of the file is an entry point for nix, of sorts,
that kind of acts like a function signature. This is saying "I need the nix built-in modules for `pkgs`, `lib`, `config`, and `inputs`",
where our recipe uses these to hook in the things we need.

The rest of the scope block, or the stuff in between the brackets, is just a recipe for how to build
this dev shell. We assign an env var for the environment, wire up git as a tool for us to be able to use,
build out some arbitrary scripts to execute, and some hooks for when we enter the dev shell that'll
run some arbitrary commands as well as a hook for when we want to specifically run tests on this shell

## Laravel-ization

Now we need to Laravel-ize it. I'm going to be using [my fork](https://github.com/JoeyMckenzie/laravel-official-react-starter-kit/tree/feature/add-nix-support)
of the official Laravel/React starter kit to build up a `devenv.nix` file that allows us to run a Laravel app, so feel free to reference that file
anytime. I have a separate branch in `feature/add-nix-support` that I usually clone anytime I start a new project that inevitably doesn't go anywhere.

First, we get rid of everything so we can work from a clean slate.
For my setup, I only use `pkgs` and `lib` as the named arguments as I don't need `config` or `inputs`:

```nix
{ pkgs, lib, ... }:
```

Next, we need some variables to pass around for the app setup for the common things we'll be reusing:

```nix
{ pkgs, lib, ... }:

let
  # ─── Project identity ─────────────────────────────────────────────────
  # Kebab for hosts/Caddy site files, snake for Postgres identifiers
  # (which can't contain dashes without double-quoting at every callsite).
  appName = "laravel-official-react-starter-kit";
  appSlug = lib.replaceStrings [ "-" ] [ "_" ] appName;

  # ─── Worktree identity ────────────────────────────────────────────────
  worktreeName =
    let
      base = builtins.baseNameOf (toString ./.);
    in
    if base == appName then "main" else lib.toLower base;

  isPrimary = worktreeName == "main";

  # ─── Per-worktree slot allocation ─────────────────────────────────────
  #
  # Problem: running multiple git worktrees of this project at the same
  # time (e.g. `main` plus a feature branch) would have them fight over
  # the same TCP ports (php-fpm, vite), the same Postgres database name,
  # the same Redis DB number, and the same `.test` hostname. The second
  # `devenv up` either crashes on port-bind or silently corrupts the
  # first worktree's state.
  #
  # Solution: each worktree gets a stable integer slot (0-499) derived
  # from a hash of its directory name. That slot becomes a port offset
  # (phpPort = 8000 + slot, vitePort = 5173 + slot), a Redis DB index,
  # a database-name suffix, and a hostname prefix. The primary checkout
  # is always slot 0 / standard ports / unsuffixed names so it gets the
  # most ergonomic URLs.
  #
  # The slot is derived from a hash of the directory name (rather than
  # from a shared registry or by enumerating worktrees at eval time) so
  # it's stable across re-clones and needs no coordination between
  # worktrees. mod 500 keeps the birthday-collision probability under
  # ~9% across 10 active worktrees; if you draw the short straw, drop
  # any unused integer 1-499 into `.devenv-index` to pin the slot by
  # hand.
  #
  # Redis is the one special case: the daemon only ships with 64 DBs,
  # so the Redis slot mods by 63 instead. A collision there is harmless
  # because HORIZON_PREFIX further scopes the keyspace per worktree, so
  # two worktrees sharing a Redis DB index can coexist without keys
  # bleeding across.
  hexDigit =
    c:
    {
      "0" = 0;
      "1" = 1;
      "2" = 2;
      "3" = 3;
      "4" = 4;
      "5" = 5;
      "6" = 6;
      "7" = 7;
      "8" = 8;
      "9" = 9;
      "a" = 10;
      "b" = 11;
      "c" = 12;
      "d" = 13;
      "e" = 14;
      "f" = 15;
    }
    .${c};

  hashValue =
    let
      hex = builtins.substring 0 4 (builtins.hashString "sha256" worktreeName);
      chars = lib.stringToCharacters hex;
    in
    lib.foldl' (acc: c: acc * 16 + (hexDigit c)) 0 chars;

  hashIndex = (lib.mod hashValue 500) + 1;

  indexFile = ./.devenv-index;
  index =
    if isPrimary then
      0
    else if builtins.pathExists indexFile then
      lib.toInt (lib.removeSuffix "\n" (builtins.readFile indexFile))
    else
      hashIndex;

  redisDbIndex = if isPrimary then 0 else (lib.mod hashValue 63) + 1;

  # Per-worktree ports. Postgres/Redis/Caddy/Mailpit are nix-darwin daemons
  # on their standard ports, see ~/.config/nix-darwin/darwin/services.nix.
  phpPort = 8000 + index;
  vitePort = 5173 + index;

  # ─── Names + hosts ────────────────────────────────────────────────────
  dbName =
    if isPrimary then
      appSlug
    else
      "${appSlug}_" + lib.replaceStrings [ "-" "." "/" ] [ "_" "_" "_" ] worktreeName;

  appHost =
    if isPrimary then
      "${appName}.test"
    else
      "${worktreeName}.${appName}.test";

  # vite.config.ts should set `server.origin` to this and `server.hmr.host`
  # to this with `protocol = 'wss'` + `clientPort = 443` so HMR works over
  # HTTPS without mixed-content blocks.
  viteHost = "vite.${appHost}";

  home = builtins.getEnv "HOME";
  caddySite = "${home}/.config/caddy/sites/${appName}-${worktreeName}.caddy";
  caddySitesDir = "${home}/.config/caddy/sites";

  worktreesRoot = builtins.dirOf (toString ./.);
in
{
  # TODO
}
```

Okay, that's a lot of shit going on in the setup. The `let` binding functions pretty much like any other programming language that supports block-level
assignments, just declaring a bunch of variables in a block to reuse. I use a few things here:

- We start off with project identities so we can reuse the project name for hosts, DBs, worktrees, etc.
- Slugifying the project name allows for a lot of reuse in our services, as we'll see in just a bit
- Next, we have to do a bit of port olympics to keep ports from colliding as spin up worktrees
    - If you don't use worktrees, you can remove that whole section
    - If you _do_ use worktrees (which I'd highly recommend), the hashing function there allows for ~500 free ports
    - I have a poor man's port allocator workaround where I use a `.devenv-index` file with a static number in to override the port index if I need to (rarely)
    - This is totally optional, but allows for a truly per-worktree isolated environment
- We do a bit of determination to figure out the appropriate host name based on the worktree
- Same thing for our vite server, since we have configured with caddy to service at a `vite.` apex domain
- I make a few references to the caddy site and the worktrees root that'll be used here in just a bit

## Declaring the important stuff

Okay, with that out of the way, let's get into the meat and potatoes of my `devenv.nix` recipe. First thing's first,
We need some AI integration because I have no idea how to write code by hand anymore:

```nix
{ pkgs, lib, ... }:

let
  # ...other stuff
in
{
  dotenv.disableHint = true;

  claude = {
    code.enable = true;
    code.mcpServers = {
      devenv = {
        type = "stdio";
        command = "devenv";
        args = [ "mcp" ];
      };
      shadcn = {
        type = "stdio";
        command = "npx";
        args = [
          "shadcn@latest"
          "mcp"
        ];
      };
      boost = {
        type = "stdio";
        command = "php";
        args = [
          "artisan"
          "boost:mcp"
        ];
      };
    };
  };
}
```

The `in` block captures over variables in the `let` block where I'm now telling nix that I need a few things
in my dev environment. We'll flesh this out bit-by-bit, but to start, I like to wire up Claude Code integration
as it's my agentic development daily driver and through nix, I can consolidate all of my Claude Code config into
a nix file alongside all the other stuff I need to run my code. Nix becomes the source of truth for _everything_
taking this approach. Whether that's good or bad, I'll let you decide. I've spent enough time working at places
where dev environment setup took two weeks, a lot of patience, and even more cursing waiting on ServiceNow tickets
to be resolved to get access to things that I'd never touch again. I want to clone a project and hit the ground
running within minutes, and that's what I tailor my approach here for.

Okay, rant aside, next we need to tell nix what languages and language tooling we're going to need to get us off the ground:

```nix
let
  # ...other stuff
in
{
  # ...claude stuff

  # ─── Languages ─────────────────────────────────────────────────────────
  languages = {
    php = {
      enable = true;
      version = "8.4";
      extensions = [
        "bcmath"
        "gd"
        "zip"
        "pdo_pgsql"
        "redis"
        "opcache"
        "intl"
        "xdebug"
      ];
      ini = ''
        ${builtins.readFile ./php.ini.base}
        ${lib.optionalString (builtins.pathExists ./php.local.ini) (builtins.readFile ./php.local.ini)}
      '';
      fpm.pools.web = {
        settings = {
          "listen" = "127.0.0.1:${toString phpPort}";
          "pm" = "dynamic";
          "pm.max_children" = 10;
          "pm.start_servers" = 2;
          "pm.min_spare_servers" = 1;
          "pm.max_spare_servers" = 3;
          # Inherit the devenv shell env so DB_DATABASE / REDIS_DB /
          # SESSION_DOMAIN / HORIZON_PREFIX reach the FPM workers. Without
          # this, php-fpm scrubs the env and only the .env file is visible.
          "clear_env" = "no";
          # macOS fork-safety workaround for pdo_pgsql. libpq tries GSSAPI
          # encryption negotiation by default, which pulls Kerberos →
          # CoreFoundation prefs → mach IPC. The IPC state can't be reused
          # after fork(), so php-fpm workers SIGSEGV inside PQconnectdb.
          # Setting PGGSSENCMODE=disable tells libpq to skip the GSSAPI
          # codepath entirely, so no kerberos init, no CFPrefs, no crash.
          "env[PGGSSENCMODE]" = "disable";
        };
      };
    };

    javascript = {
      enable = true;
      package = pkgs.nodejs_22;
      npm.enable = true;
    };
  };
}
```

Alright, now we're getting somewhere. We know we're going to need PHP and JS, along with a few PHP extensions to
get going and some FPM configuration. The JS block is pretty simple, just telling nix I need node on v22. Notice
there's no mention of nvm, asdf, mise, etc. The beauty of per-project devenv nix environments is that we
don't _need_ version managers, because our environment is pinned to the exact version we need. Working on multiple
projects at a time? Update your `devenv.nix` accordingly and you're off to the races.

For our PHP setup, we include the usual suspects we need for a solid PHP extension setup with xdebug, zip, opcache, etc.
I'm opting to use Postgres like the rest of the modern world, and things get a bit interesting here. I'm gonna pause here,
as I think it'd be valuable for anyone to read two posts that are pretty important for our setup here:

- [Fixing Postgres Connection Issues in Laravel Valet on macOS](https://janostlund.com/2024-08-16/502-error-laravel-valet-pgsql)
- [Laravel valet 502 error when using postgres pgsql driver](https://www.sabatino.dev/laravel-valet-502-error-when-using-postgres-pgsql-driver/)

Yeah, we're not using Valet, but this bad boy bit me while working on a recent project and had me scratching my head
for longer than I'd care to admit. If you didn't read those, here's the TL;DR:

- When you use `php artisan serve`, your Laravel app talks directly to Postgres with no frills or fuss
- When you reverse proxy to your Laravel app through something like caddy, you usually have PHP FPM handling those requests
- PHP FPM manages a pool of PHP workers ready to handle requests, but lives outside of Laravel's PHP view of the world
- _Those_ PHP request workers use separate configuration when connecting to Postgres
- Postgres relies on something called Generic Security Services API, or GSSAPI
- When a worker attempts to talk to Postgres, Postgres uses GSSAPI to authenticate the worker
- When you're on a local dev machine, odds are you don't need this level of authentication (unless you're working in an enterprise environment with Kerberos/AD everywhere)
- To get around this authentication blocking Postgres will do to a PHP FPM worker, you set `env[PGGSSENCMODE]` to `disable`
- Congrats, your PHP FPM workers no longer 502 when handling requests sent from caddy

The TL;DR of the TL;DR above - when using a reverse proxy on a Laravel app with Postgres, you set `env[PGGSSENCMODE] = disable` in your FPM config.
Without it, you'll get some mysterious 502 errors back from FPM attempting to handle the request. I'm glad I know this now, but boy... that sure
was annoying trying to figure out in the first place.

With that out of the way, let's move onto to what we _actually_ need to run when we're spin up our app. In this contrived example,
I have a few things setup:

- We have our Laravel app that needs to handle requests
- We have an asset server for vite
- We need a queue worker via Horizon (because I couldn't imagine a real Laravel app without it)
- We need a scheduler running to test those pesky scheduled commands

We can define _all_ of that in our devenv nix setup. All of these processes and services, though, need environment variables at some point
to know _how_ they should run. So, we wire it all up with an `env` and `processes` block in our nix setup:

```nix
let
  # ...other stuff
in
{
  # ─── Per-worktree env ─────────────────────────────────────────────────
  # Only worktree-dependent values live here. Static project config (DB
  # driver/host/creds, Redis host, mail host, etc.) lives in .env so that
  # artisan commands work the same whether or not the devenv shell is
  # active. Anything in this block overrides .env at runtime via
  # phpdotenv's immutable mode.
  env = {
    APP_URL = "https://${appHost}";
    APP_DOMAIN = appHost;
    ASSET_URL = "https://${appHost}";

    # Vite served behind caddy. VITE_DEV_SERVER_URL is what laravel-vite-
    # plugin emits in <script> tags; without it, asset URLs default to
    # http://localhost:VITE_PORT and the HTTPS app page blocks them as
    # mixed content.
    VITE_PORT = toString vitePort;
    VITE_DEV_SERVER_URL = "https://${viteHost}";

    HORIZON_DOMAIN = "horizon.${appHost}";
    HORIZON_PATH = "/";

    # Scope sessions to this worktree's subtree so two open worktrees
    # don't collide. dashboard.${worktreeName}.${appName}.test is under
    # .${worktreeName}.${appName}.test, so any subdomain sharing still works.
    SESSION_DOMAIN = if isPrimary then ".${appName}.test" else ".${worktreeName}.${appName}.test";

    # Per-worktree database name (cluster-shared role lives in .env).
    DB_DATABASE = dbName;

    # Redis DB number, mod 63 since Redis only has 64 DBs. Collisions are
    # harmless thanks to HORIZON_PREFIX scoping below.
    REDIS_DB = toString redisDbIndex;

    # Queue key prefix, keeps each worktree's queue keys isolated even
    # when redisDbIndex collides between worktrees.
    HORIZON_PREFIX = "horizon-${worktreeName}:";
  };

  processes = {
    # PHP-FPM is managed by languages.php.fpm above. If `devenv up` was
    # killed ungracefully and a php-fpm master is leaked on port phpPort,
    # the new master fails silently to bind and the OLD one serves requests
    # with stale env. Recovery: `pkill -f 'php-fpm: master'` then re-up.
    #
    # When `devenv up` is killed ungracefully, vite doesn't always propagate
    # SIGTERM either, leaving an orphan bound to the port. The pre-bind lsof
    # reclaims it; `exec` replaces the shell so SIGTERMs reach vite directly.
    vite.exec = ''
      pids=$(lsof -ti:${toString vitePort} 2>/dev/null || true)
      [ -n "$pids" ] && { echo "→ killing orphan on :${toString vitePort} ($pids)"; kill -9 $pids; }
      exec npm run dev -- --host 127.0.0.1 --port ${toString vitePort} --strictPort
    '';

    # Horizon + scheduler run in every worktree (against the shared redis;
    # HORIZON_PREFIX + REDIS_DB isolate keys per worktree).
    horizon.exec = "php artisan config:clear && php artisan horizon:listen";
    scheduler.exec = "php artisan config:clear && php artisan schedule:work";

    logs.exec = "php artisan pail --timeout=0";
  };
}
```

Let's go section-by-section:

- `env`
    - Because I use worktrees by default these days, all of our URLs need to be unique when the Laravel/vite servers spin up
    - Horizon gets its own apex URL
    - Each worktree gets it's own database copy so it can work in isolation from `main`
    - Each worktree _also_ gets it's own Redis DB so I don't have clashing cache values or queue workers consuming jobs from other worktrees
- `processes`
    - `vite.exec` - Runs our actual vite server via `npm run dev` and kills any orphaned instances anytime I spin up the dev environment
    - `horizon.exec` - Runs the queues workers via Horizon (you'll need `chokidar` if you're using the `listen` option so jobs get HMR when you update PHP code)
    - `scheduler.exec` - Runs the scheduler for any schedule command code I might have
    - `logs.exec` - Runs `pail` so I can see what the heck is going on when I'm running my app

I'm waving over the fact that through my `nix-darwin` setup, I have Postgres and Redis as a launch service (very much like Herd does) and keeping
my `devenv.nix` definition here to just project-specific processes that run.

Similarly in my `env` block, I use that for any dynamic environment variables, like hosts and port numbers, and keep all the static stuff in `.env`.
I get to derive all these values based on worktree indexes, which in turn allows me to create individual hosts, database names, and anything else
that's environment specific.

Next, one of my favorite parts of using nix and devenv: tasks. Just like how we have scripts in `package.json` and `composer.json`, devenv allows us to run
tasks in a very similar fashion. Same concept: define something that needs to run and tell devenv to run it. My typical task block is the largest
piece of nix DSL, so we'll incrementally build it up. To start, I define a few caddy tasks that help me register, reload, and clean reverse proxied URLs:

```nix
let
  # ...other stuff
in
{
  # ...other stuff

  tasks = {
    # Caddy, runs every entry (no status) to handle config drift.
    "caddy:write-site" = {
      description = "Write per-worktree Caddyfile";
      exec = ''
        set -euo pipefail
        mkdir -p "${caddySitesDir}"
        cat > "${caddySite}" <<EOF
        ${appHost}, horizon.${appHost} {
          root * ${config.devenv.root}/public
          php_fastcgi 127.0.0.1:${toString phpPort}
          encode zstd gzip
          file_server
        }

        ${viteHost} {
          reverse_proxy 127.0.0.1:${toString vitePort}
        }
        EOF
      '';
      before = [ "devenv:enterShell" ];
    };

    "caddy:reload" = {
      description = "Reload Caddy via admin API";
      exec = ''
        set -euo pipefail
        if curl -fsS --max-time 2 http://localhost:2019/config/ >/dev/null 2>&1; then
          if curl -fsS -X POST -H "Content-Type: text/caddyfile" \
               --data-binary @/etc/caddy/Caddyfile \
               "http://localhost:2019/load?adapter=caddyfile" >/dev/null; then
            echo "✓ caddy reloaded (${appHost})"
          else
            echo "⚠ caddy admin API rejected reload, check /etc/caddy/Caddyfile syntax"
          fi
        else
          echo "⚠ caddy admin API not reachable. Try: sudo launchctl kickstart -k system/org.nixos.caddy"
        fi
      '';
      after = [ "caddy:write-site" ];
      before = [ "devenv:enterShell" ];
    };

    "caddy:self-clean" = {
      description = "Remove caddy site files for deleted worktrees";
      exec = ''
        set -euo pipefail
        shopt -s nullglob 2>/dev/null || true
        for f in "${caddySitesDir}/"${appName}-*.caddy; do
          base=$(basename "$f" .caddy)
          name=''${base#${appName}-}
          [ "$name" = "main" ] && continue
          [ "$name" = "${worktreeName}" ] && continue
          if [ ! -d "${worktreesRoot}/$name" ]; then
            echo "→ removing stale caddy site: $name"
            rm -f "$f"
          fi
        done
      '';
      before = [ "devenv:enterShell" ];
    };
  };
}
```

I have three tasks that run anytime I spin up my dev environment:

- `caddy:write-site`: Writes a literal `<branch-name>.<app-name>.test` file to my `~/.config/caddy/sites` folder that caddy can pick up and begin reverse proxying.
- `caddy:reload`: When a new caddy site is added, we have to tell caddy to start listening for those requests and reverse proxying as needed, so we ping the caddy admin API that runs locally to pick it up
- `caddy:self-clean`: When I nuke a worktree, I like to clean up after myself to avoid a bunch of orphaned site URLs that no longer exist

One thing that's really cool about devenv task blocks is the `before` and `after` markers that tell that specific task _when_ to run: either before a task or set of tasks, and similarly for after.

With the caddy management out of the way, we can move onto to application initialization stuff:

```nix
let
  # ...other stuff
in
{
  # ...other stuff

  tasks = {
    # ...other task stuff

    # Fresh worktrees inherit primary's .env (which carries any real keys/
    # secrets your .env.example lacks). Falls back to .env.example if primary
    # has none. Devenv's `env = { ... }` block overrides URL/DB/Redis at the
    # shell-env layer via phpdotenv's immutable mode, so worktree-specific
    # values don't bleed in.
    "app:env-init" = {
      description = "Copy .env from primary worktree (or .env.example) into place";
      exec = ''
        set -euo pipefail
        primary_root="${worktreesRoot}/main"
        dst="${config.devenv.root}/.env"
        [ -f "$dst" ] && exit 0
        if [ -f "$primary_root/.env" ] && [ "$primary_root/.env" != "$dst" ]; then
          echo "→ Copying .env from primary worktree"
          cp "$primary_root/.env" "$dst"
        else
          echo "→ Copying .env from .env.example (primary has none)"
          cp "${config.devenv.root}/.env.example" "$dst"
        fi
      '';
      status = ''test -f "${config.devenv.root}/.env"'';
      before = [ "devenv:enterShell" ];
    };

    "app:key-generate" = {
      description = "Generate Laravel APP_KEY";
      cwd = config.devenv.root;
      exec = "php artisan key:generate --force --no-interaction";
      status = ''grep -qE '^APP_KEY=base64:' "${config.devenv.root}/.env"'';
      after = [
        "deps:composer"
        "app:env-init"
      ];
      before = [ "devenv:enterShell" ];
    };

    # For dependencies, we use execIfModified to track lockfile content hashes in
    # so something like a `git pull` that changes the lockfile and triggers
    # a re-install on next shell entry.
    "deps:composer" = {
      description = "Install composer dependencies";
      cwd = config.devenv.root;
      exec = "composer install --no-interaction --prefer-dist";
      execIfModified = [
        "${config.devenv.root}/composer.lock"
        "${config.devenv.root}/composer.json"
      ];
      before = [ "devenv:enterShell" ];
      showOutput = true;
    };

    "deps:npm" = {
      description = "Install npm dependencies";
      cwd = config.devenv.root;
      exec = "npm ci";
      execIfModified = [
        "${config.devenv.root}/package-lock.json"
        "${config.devenv.root}/package.json"
      ];
      before = [ "devenv:enterShell" ];
      showOutput = true;
    };
  };
}
```

These tasks setup our application dependencies and environment variables as Laravel/vite expects them:

- `app:env-init`: Creates a copy of `.env` in the target worktree folder and falls back to using `.env.example` in case the primary worktree has none (has no effect if not using worktrees)
- `app:key-generate`: Generates a new `APP_KEY` for our Laravel app to use
- `deps:composer`: Installs composer dependencies, and also re-installs them if the contents of those files have changed when `git pull`ing in case another dev added some new packages
- `deps:npm`: Same as above, but just for our npm dependencies

I'm also relying on the `status` for the task here as well to test if the task itself ran successfully. This can be anything that returns a typical shell status code of 0/1 and really
helpful for simply verifying a file, or value within a file, was correctly put in place by the task itself. Failures will block other tasks loudly from running so you'll know right away
if something broke.

Lastly, I like to run all my database initialization as well so when I drop into my worktree, I'm ready to go:

```nix
let
  # ...other stuff
in
{
  # ...other stuff

  tasks = {
    # ...other task stuff

    # Databases are per-worktree. We connect as $USER, as my nix-darwin
    # postgres setup runs `initdb` without --username, so the cluster's
    # only superuser is the OS user a.k.a me (no `postgres` role exists). The app
    # itself connects as `${appSlug}` over TCP using the env credentials.
    "db:ensure" = {
      description = "Create the worktree's Postgres role + database";
      exec = ''
        set -euo pipefail
        if ! psql -h 127.0.0.1 -U "$USER" -d postgres -tAc 'SELECT 1' >/dev/null 2>&1; then
          echo "⚠ Postgres not reachable on 127.0.0.1:5432 as $USER, is the nix-darwin daemon running?"
          exit 1
        fi

        # Shared role used by every worktree's app, created idempotently.
        # CREATEDB lets the role own per-worktree databases.
        if ! psql -h 127.0.0.1 -U "$USER" -d postgres -tAc \
             "SELECT 1 FROM pg_roles WHERE rolname='${appSlug}'" | grep -q 1; then
          echo "→ Creating role ${appSlug}"
          psql -h 127.0.0.1 -U "$USER" -d postgres -c \
            "CREATE ROLE ${appSlug} WITH LOGIN PASSWORD 'laravel' CREATEDB"
        fi

        if ! psql -h 127.0.0.1 -U "$USER" -d postgres -tAc \
             "SELECT 1 FROM pg_database WHERE datname='${dbName}'" | grep -q 1; then
          echo "→ Creating database ${dbName}"
          createdb -h 127.0.0.1 -U "$USER" -O ${appSlug} ${dbName}
          mkdir -p "${config.devenv.root}/.devenv-state"
          touch "${config.devenv.root}/.devenv-state/needs-seed"
        fi
      '';
      status = ''psql -h 127.0.0.1 -U "$USER" -d ${dbName} -tAc 'SELECT 1' >/dev/null 2>&1'';
      before = [ "devenv:enterShell" ];
      showOutput = true;
    };

    # Idempotent (artisan checks the migrations table), so it runs every
    # entry but no-ops when nothing's pending.
    "db:migrate" = {
      description = "Run pending Laravel migrations";
      cwd = config.devenv.root;
      exec = "php artisan migrate --force";
      after = [
        "deps:composer"
        "app:key-generate"
        "db:ensure"
      ];
      before = [ "devenv:enterShell" ];
      showOutput = true;
    };

    "db:seed" = {
      description = "Seed the DB if it was just created";
      cwd = config.devenv.root;
      exec = ''
        set -euo pipefail
        php artisan db:seed --force
        rm -f "${config.devenv.root}/.devenv-state/needs-seed"
      '';
      # Skip (status=0) when marker is absent; run when marker exists.
      status = ''! test -f "${config.devenv.root}/.devenv-state/needs-seed"'';
      after = [ "db:migrate" ];
      before = [ "devenv:enterShell" ];
      showOutput = true;
    };

    "db:storage-link" = {
      description = "Create public/storage symlink";
      cwd = config.devenv.root;
      exec = "php artisan storage:link";
      status = ''test -L "${config.devenv.root}/public/storage"'';
      after = [
        "deps:composer"
        "app:env-init"
      ];
      before = [ "devenv:enterShell" ];
    };
  };
}
```

Again, we've got a few things going on here:

- `db:ensure`: The most complicated-ish bit, though simply just creates a role and database for my Postgres user. I'm the only one on working in my dev environment, so I keep this simple by just creating the database and adding some flags to help me seed the database if I need to
- `db:migrate`: Runs any pending migrations everytime I enter the shell so my schema is always up-to-date
- `db:seed`: Checks if the database needs seeding, and runs the seeders if it does (shell re-entry doesn't need seeding, so we can skip it)
- `db:storage-link`: Runs the storage links to public storage because I forget to do this literally every time

With our database stuff out of the way, we wire up one last bit of nix-y stuff so I can tell devenv _what_ exactly it needs to do when I enter my dev environment. For these,
I use the `enterShell` and `enterTest` hooks:

```nix
let
  # ...other stuff
in
{
  # ...other stuff

  # devenv:enterTest runs `after = [ "devenv:enterShell" ]` by default, so
  # every bootstrap task above has already completed (vendor/, .env, key,
  # DB, migrations) by the time we get here. Pass-through args:
  # `devenv test --filter=SomeTest`.
  enterTest = ''
    set -euo pipefail
    echo "→ Running test suite"
    php artisan test --parallel --recreate-databases "$@"
  '';

  enterShell = ''
    figlet "Laravel"
    echo "── ${worktreeName} (index=${toString index}) ──"
    echo "  app             https://${appHost}"
    echo "  vite assets     https://${viteHost}"
    echo "  horizon ui      https://horizon.${appHost}"
    echo "  php-fpm         127.0.0.1:${toString phpPort}"
    echo "  vite            127.0.0.1:${toString vitePort}"
    echo "  db              ${dbName}"
    echo "  redis db        ${toString redisDbIndex}  (horizon prefix: horizon-${worktreeName}:)"
  '';
}
```

These are pretty small, with `enterTest` just running my tests with `devenv test` and going through all of my environment setup,
and `enterShell` just displaying some information about the runtime environment like the hosts, connection strings, etc.

## Seeing it all come together

Now... the grand finale. When I run a `devenv up`, I see everything I need my app to run come together:

```bash
✓ Validating lock                                                                                                                                                               0ms
✓ Configuring shell                                                                                                                                                            2.6s
  └ ✓ Configuring cachix                                                                                                                                                        2ms
  └ ✓ Evaluating shell 2390 files                                                                                                                                              2.4s
✓ Loading tasks                                                                                                                                                                 3ms
  └ ✓ Evaluating devenv.config.task.config                                                                                                                                      2ms
✓ Running tasks                                                                                                                                                               755ms
  └ ✓ devenv:enterShell                                                                                                                                                        22ms
    └ ✓ caddy:self-clean                                                                                                                                                      159ms
    └ ✓ db:storage-link skipped                                                                                                                                                99ms
      └ ✓ app:env-init skipped                                                                                                                                                149ms
      └ ✓ deps:composer skipped                                                                                                                                                 3ms
    └ ✓ caddy:reload 1 lines → ✓ caddy reloaded (feature-add-nix-support.laravel-official-react-starter-kit.test)                                                            150ms
      └ ✓ caddy:write-site                                                                                                                                                    157ms
    └ ✓ devenv:files                                                                                                                                                          119ms
      └ ✓ devenv:files:cleanup                                                                                                                                                173ms
    └ ✓ db:seed skipped                                                                                                                                                        83ms
      └ ✓ db:migrate 3 lines                                                                                                                                                  372ms
  │
  │    INFO  Nothing to migrate.
  │
        └ ✓ app:key-generate skipped                                                                                                                                          106ms
          └ ✓ app:env-init skipped                                                                                                                                            149ms
          └ ✓ deps:composer skipped                                                                                                                                             3ms
        └ ✓ db:ensure skipped                                                                                                                                                 274ms
    └ ✓ deps:npm skipped                                                                                                                                                        2ms
  └ ✓ devenv:enterTest skipped                                                                                                                                                  0ms
 _                              _
| |    __ _ _ __ __ ___   _____| |
| |   / _` | '__/ _` \ \ / / _ \ |
| |__| (_| | | | (_| |\ V /  __/ |
|_____\__,_|_|  \__,_| \_/ \___|_|

── feature-add-nix-support (index=311) ──
  app             https://feature-add-nix-support.laravel-official-react-starter-kit.test
  vite assets     https://vite.feature-add-nix-support.laravel-official-react-starter-kit.test
  horizon ui      https://horizon.feature-add-nix-support.laravel-official-react-starter-kit.test
  php-fpm         127.0.0.1:8311
  vite            127.0.0.1:5484
  db              laravel_official_react_starter_kit_feature_add_nix_support
  redis db        49  (horizon prefix: horizon-feature-add-nix-support:)
```

And if we visit `https://feature-add-nix-support.laravel-official-react-starter-kit.test`, we have a fully functional, environment-isolated Laravel app.
And since I'm a worktree enjoyer, I keep a copy of my `main` worktree in a sibling folder, so `https://laravel-official-react-starter-kit.test` resolves
to my running instance of `main`, where the port defaults kick in as we'd expect (FPM running on 8000, vite running on 5173). I find it immensely helpful
to keep my `main` worktree pinned on main so I can always cross reference UI/UX changes in the browser quickly, since I'm usually running multiple
instances of my application that all run in isolation from one another. Have a breaking change in a feature branch/worktree? `main` won't care,
it's using its own databases, cache, PHP version, etc.

If you're interested in seeing the full setup, I keep a [fork](https://github.com/JoeyMckenzie/laravel-official-react-starter-kit/tree/feature/add-nix-support)
of the React starter kit with nix and devenv setup so anytime I'm spinning up a new project, I'm ready to go.

## Wrapping up

Okay, so this was a long one. I promise to eventually write about my nix-darwin setup so anyone who's interested in jumping into a purpose built Laravel/nix
setup can do so with minimal friction. In the meantime, you can browse my [nixfiles](https://github.com/JoeyMckenzie/nixfiles) for the full picture of how
caddy, dnsmasq, Postgres, Redis, and the rest are wired up as nix-darwin launch services. The beauty of nix is truly in the ethos of "clone and go" where pulling
in a nix-darwin + home-manager setup and building on the target machine can hit the ground running with everything anyone would ever need to run a typical Laravel app.

I'm still learning new nix things every day and constantly tweaking things in my setup (who knew I could waste more time in config files NOT related to neovim).
It's been a great experience so far and I'm excited to share what I've learned.

If you take anything from this giant wall of text, I would hope it would be the following:

- Herd is great, though it can have some rough edges
- Nix is a great alternative, though with more upfront cost
- The beauty of nix is custom tailoring a setup that works for your application
- Nix + worktrees = match made in heaven
- Yes, Claude has helped me immensely flesh this setup out and tailor it for what I need

Until next time friends!

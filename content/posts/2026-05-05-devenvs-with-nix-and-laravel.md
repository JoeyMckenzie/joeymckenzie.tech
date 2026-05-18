---
title: Local Laravel with nix and devenv
slug: local-laravel-with-nix
description: 'We have Herd at home.'
image: assets/images/nix-meme.jpg
tag_id: 1
storage_key: 2026-05-05-local-laravel-with-nix-and-devenv
---

I've been on a spiritual journey this past year or so really tinkering with my dev workflow and spending
an alarming amount of time in dotfiles tweaking this or that. It started off with tmux a couple years
ago and multiple failures to launch trying to get myself using neovim. Once I got to the point where
I physically couldn't leave my terminal (cue the "stuck in vim" memes), I moved onto finding
terminal replacements for tools I use and pay for (most of the time, happily). A few notable ones:

- Postman => hurl
- JetBrains => neovim (btw)
- TablePlus => lazysql/harlequin

I'm happy with my setup that I've fine tuned for Laravel and PHP, but I wanted to take it one step
farther and see if I could home grow a Herd replacement to save yet another subscription. I should
preface that **you should use, and happily pay for, Herd**. It's hands down the best Laravel/PHP
get-your-project-off-the-ground tool out there right now (imo). You can fiddle with Docker containers,
tweak volumes paths, rage at how much storage Docker is filling up on your machine, etc. though Herd
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
to do a round of process massacre to get back to a stable state.

These are **not Herd's fault** at all. This is a result of trying to wrangle processes all in coordination
on a machine, which has been a thorn in the side of developers for as long as we've been programming professionally.

There's alternatives, though. And one alternative I've been particularly keen on is [nix](https://nixos.org/) with [devenv](https://devenv.sh/).

## Going Herd-less

One of the great things Herd does is manage services like Redis, your databases (MySQL, Postgres, etc.),
Typesense, mail, and whole litany of stuff. Pretty much anything you need to run an app, Herd has a
managed process for it. One thing that I don't particularly _love_ about Herd, though, is how these services
are somewhat obfuscated from you and abstracted away. And rightfully so. I mean, we're building apps
and writing code (lmao, no we're not). I don't always want to deal with setting up databases and making sure
Redis is running. That's where Herd is _excellent_ for the DX, managing the stuff I don't really care about.

But sometimes, I do care about it. And the older I get, the more "control freak" I become where I want to
know exactly what's running in my dev environment at all times and how I can manage it.

That's where nix comes in. I won't go into much detail as I'm still a nix noob myself, but for what I'm using it
for, I can't see a world where I go back.

Nix provides a system for declarative system builds for whatever you need. It's like a `composer.json` or
`package.json` file but for your runtime environment. You tell nix that for a particular project you need PHP,
a specific version of it, what extensions you need, what database you need running, what version of Redis, etc.
You probably get the picture, but the biggest win is that these are defined in a file, that you can version control, tweak, manage, remove things, add services and tools, and anything else your project needs in its
environment to run. This alone is the perfect marriage for worktrees, where a worktree exists in _complete_
isolation from other worktrees where I'm free to tinker with its environment if I need to _without_ affecting
any other worktree. For example, if I'm doing a PHP 8.3 to PHP 8.4 upgrade, I keep `main` declaratively
pinned to 8.3, while my `feature/update-php-to-8.4` worktree branch pins itself to 8.4 with maybe a few
extra extensions and some `php.ini` tweaks and I can run both simultaneously in parallel without any headache.

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
written in go, etc. I'm not a caddy expert, I just need local reverse proxying. That's what caddy helps
accomplish akin to how Herd uses nginx to forward those `my-awesome-project.test` requests to the correct
running instance of the app locally. For example, the caddy file for my website here looks like this:

#### joeymckenzie.tech.test.caddy

```caddy
joeymckenzie.tech.test:8443 {
    tls internal

    @websocket {
        header Connection *Upgrade*
        header Upgrade websocket
    }
    handle @websocket {
        reverse_proxy 127.0.0.1:5273
    }

    @vite path /@vite/* /@id/* /@fs/* /@react-refresh /resources/* /node_modules/* /__laravel_vite_plugin__/*
    handle @vite {
        reverse_proxy 127.0.0.1:5273
    }

    handle {
        reverse_proxy 127.0.0.1:8100
    }
}
```

I keep all my caddy sites in my `~/.config/devenv/sites` folder and wire them up in a `~/.config/devenv/Caddyfile` like so:

#### `~/.config/devenv/Caddyfile`

```caddyfile
{
 auto_https disable_redirects
}

import sites/*.caddy
```

So when I drop into my devenv shell with caddy running, it knows to import all the websites I have wired
up in that `sites/` folder and routes each one accordingly. The flip side to that coin is [dnsmasq](https://thekelleys.org.uk/dnsmasq/doc.html) which Herd also uses under the hood. I declare dnsmasq in my `devenv.nix` file (we'll get to that in a minute), and wire up an `/etc/resolver/test` file that points DNS lookups
for `.test` domains to `127.0.0.1`, also lovingly known as localhost:

#### `/etc/resolver/test`

```bash
nameserver 127.0.0.1
port 8053
```

The port 8053 here is where dnsmasq runs. The browser essentially asks "hey, what's the IP for this `.test` domain?" Dnsmasq answers that question with "go to `127.0.0.1`, buddy." The browser then opens a TCP connection to `127.0.0.1:8443` (the port came from the URL, not DNS), where caddy is camped out waiting. Caddy picks the request up, terminates TLS, and forwards it to whichever upstream the matching site block points to (e.g. the caddy file wired up to the domain). Herd/Valet, yet again, does this for you so you don't have to worry
about DNS. Because when something breaks... it's somehow _always_ DNS.

Visually, the request flow looks like this:

```mermaid
graph LR
    B["Browser<br/>my-awesome-project.test:8443"]
    R["/etc/resolver/test"]
    D["dnsmasq<br/>127.0.0.1:8053"]
    C["Caddy<br/>127.0.0.1:8443"]
    U["Upstream<br/>php-fpm / vite"]

    B -- "DNS lookup for .test" --> R
    R -- "ask 127.0.0.1:8053" --> D
    D -- "answer: 127.0.0.1" --> B
    B -- "TCP + TLS to :8443" --> C
    C -- "reverse_proxy" --> U

    style B fill:#bbf,stroke:#333
    style D fill:#fbf,stroke:#333
    style C fill:#bfb,stroke:#333
    style U fill:#fdb,stroke:#333
```

The primary difference between running your
own setup with devenv, caddy, and dnsmasq and Herd is that Herd runs those processes as root, where devenv does not. Port 443 is a restricted port, so if you're not root, the system more than likely won't let you scoop it (unless you port forward, but I don't care enough to do that). The tradeoff here is that we have to hit `my-awesome-project.test:8443` instead of just `my-awesome-project.test`. That's something I'm willing to live with,
but you should take that into account should you decide to venture into the deep waters of Herd-less Laravel local dev.

## Declarative nix files

Okay, that's enough networking for the week. Now to the fun stuff, actually running devenv. For a full-fledged
Laravel app, we need a few things going for us:

- We need PHP and JavaScript (obviously)
- We need environment variables
- We need queues, so Redis
- We need a database: MySQL, Postgres, SQLite, etc.
- We might want full-text search with meilisearch or typesense
- Feature flags with LaunchDarkly
- Any other service that our app needs to run

And that's where nix joins us, to set those things up for us in an isolated development shell, hidden from
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
run some arbitrary commands as well as a hook for when we want to specifically run tests on this shell.

## Laravel-ization

Now we need to Laravel-ize it. First, we get rid of everything so we can work from a clean slate.
For my setup, I only use `pkgs` and `libs` as the named arguments as I don't need `config` or `inputs`:

```nix
{ pkgs, lib, ... }:
```

Next, we need some variables to pass around for the app setup for the common things we'll be reusing:

```nix {}{3-25}
{ pkgs, lib, ... }:

let
  worktreeName = builtins.baseNameOf (toString ./.);

  indexFile = ./.devenv-index;
  index =
    if builtins.pathExists indexFile then
      lib.toInt (lib.removeSuffix "\n" (builtins.readFile indexFile))
    else
      0;

  appPort = 8000 + index;
  vitePort = 5173 + index;
  xdebugPort = 9003 + index;
  dbName = "my_awesome_project_" + lib.replaceStrings [ "-" "." ] [ "_" "_" ] worktreeName;
  hostname = if worktreeName == "main" then "my-awesome-project.test" else "${worktreeName}.my-awesome-project.test";

  toolsPath = /. + "${builtins.getEnv "HOME"}/.config/devenv/tools.nix";
in
{
  # TODO
}
```

The `let` binding functions pretty much like any other programming language that supports block-level
assignments, just declaring a bunch of variables in a block to reuse. I use a few things here:

- Because I use worktrees primarily, the `worktreeName` is just a reference to the current folder I'm in
- I use index files that simply just hold a single number that gets parsed into a value that gets used to deterministically bump ports so worktrees don't collide with one another (poor man's implementation of port hashing)
- I assign port values based on the port index (`main` has a port index of 0, as it's the trunk branch)
- Subsequent worktrees get values of 1, 2, 3, and so on (again, there's probably a better way to do this)
- I hold a reference to the database name this worktree will use
- I grab the hostname this worktree will run under as well
- I reference a path to the common tools I use for all my nix files that I version control in my dotfiles

## Sharing tools

For that last reference there, I keep a `tools.nix` file that acts as a common set of shared tools that,
more often than not, any dev shell I'm working will need:

#### ~/.config/devenv/tools.nix

```nix
{ pkgs, ... }:
{
  packages = with pkgs; [
    git
    curl
    gh
    jq
    ripgrep
    fd
    fzf

    nil
    statix
    deadnix
    nixfmt-rfc-style

    sqlite
    pgcli
    mycli
    litecli
  ];
}
```

I use a few terminal tools, CLIs, and some nix stuff. I tend to keep language stuff out since this is meant
to be used by any project that I use nix/devenv with.

## Declaring the important stuff

Okay, with that out of the way, let's get into the meat and potatoes of my `devenv.nix` recipe:

```nix {}{20-55}
{ pkgs, lib, ... }:

let
  worktreeName = builtins.baseNameOf (toString ./.);

  indexFile = ./.devenv-index;
  index =
    if builtins.pathExists indexFile then
      lib.toInt (lib.removeSuffix "\n" (builtins.readFile indexFile))
    else
      0;

  appPort = 8000 + index;
  vitePort = 5173 + index;
  xdebugPort = 9003 + index;
  dbName = "my_awesome_project_" + lib.replaceStrings [ "-" "." ] [ "_" "_" ] worktreeName;
  hostname = if worktreeName == "main" then "my-awesome-project.test" else "${worktreeName}.my-awesome-project.test";

  toolsPath = /. + "${builtins.getEnv "HOME"}/.config/devenv/tools.nix";
in
{
  imports = [ toolsPath ];

  dotenv.disableHint = true;

  languages.php = {
    enable = true;
    version = "8.4";
    extensions = [
      "redis"
      "pdo_pgsql"
      "pgsql"
      "intl"
      "bcmath"
      "gd"
      "zip"
      "xdebug"
    ];
    ini = ''
      ${builtins.readFile ./php.ini.base}
      xdebug.client_port = ${toString xdebugPort}
      ${lib.optionalString (builtins.pathExists ./php.local.ini) (builtins.readFile ./php.local.ini)}
    '';
  };

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    npm.enable = true;
  };

  packages = with pkgs; [
    postgresql_16
    redis
  ];
}
```

The `in` block captures over variables in the `let` block where I'm now telling nix that I need a few things
in my dev environment:

- Import the common tools for terminal stuff I'll be doing
- Disable `.env` warnings (more on this later)
- Wire up PHP for me, complete with companion `php.ini.base` file that can optionally resolve values from a `php.local.ini` file, if needed
- Wire up node for me (so long, 10 different ways to manage node versions)
- Include Postgres and Redis since Laravel needs the drivers available

## Spinning up dev servers

These represent core tools I need to actually do stuff with Laravel. This is great, but we actually have to
_run_ the app at some point. So, let's define what processes devenv can spin up when I boot up the environment:

```nix {}{56-67}
{ pkgs, lib, ... }:

let
  worktreeName = builtins.baseNameOf (toString ./.);

  indexFile = ./.devenv-index;
  index =
    if builtins.pathExists indexFile then
      lib.toInt (lib.removeSuffix "\n" (builtins.readFile indexFile))
    else
      0;

  appPort = 8000 + index;
  vitePort = 5173 + index;
  xdebugPort = 9003 + index;
  dbName = "my_awesome_project_" + lib.replaceStrings [ "-" "." ] [ "_" "_" ] worktreeName;
  hostname = if worktreeName == "main" then "my-awesome-project.test" else "${worktreeName}.my-awesome-project.test";

  toolsPath = /. + "${builtins.getEnv "HOME"}/.config/devenv/tools.nix";
in
{
  imports = [ toolsPath ];

  dotenv.disableHint = true;

  languages.php = {
    enable = true;
    version = "8.4";
    extensions = [
      "redis"
      "pdo_pgsql"
      "pgsql"
      "intl"
      "bcmath"
      "gd"
      "zip"
      "xdebug"
    ];
    ini = ''
      ${builtins.readFile ./php.ini.base}
      xdebug.client_port = ${toString xdebugPort}
      ${lib.optionalString (builtins.pathExists ./php.local.ini) (builtins.readFile ./php.local.ini)}
    '';
  };

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    npm.enable = true;
  };

  packages = with pkgs; [
    postgresql_16
    redis
  ];

  processes.app.exec = "php artisan serve --host=127.0.0.1 --port=${toString appPort}";
  processes.queue.exec = "php artisan queue:listen --tries=1";
  processes.logs.exec = "php artisan pail --timeout=0";
  processes.horizon.exec = "php artisan horizon";
  processes.vite.exec = "npm run dev -- --port ${toString vitePort} --strictPort";

  processes.migrate = {
    exec = "php artisan migrate --force";
    process-compose.availability.restart = "no";
  };
  processes.app.process-compose.depends_on.migrate.condition = "process_completed_successfully";
  processes.horizon.process-compose.depends_on.migrate.condition = "process_completed_successfully";
  processes.queue.process-compose.depends_on.migrate.condition = "process_completed_successfully";
}
```

I tell devenv that when I boot up the environment with `devenv up` (akin to a good ole fashioned `docker compose up`), I need to run a few processes:

- Laravel's built-in dev server on the port we computed for the worktree
- The queue workers
- Tail logs with `pail`
- Horizon, because you should be running Horizon
- Boot up the vite dev server
- Run any pending migrations
- And lastly through [process-compose](https://f1bonacc1.github.io/process-compose/), I gate the app, queue, and Horizon processes from running until migrations have successfully applied

One little block does everything I need all at once. All in a day's work 😅.
One thing to note is that devenv uses [process-compose](https://f1bonacc1.github.io/process-compose/) as a
supervisor of sorts to manage the fleet of related processes. Getting familiar with it is well worth while
and a welcome alternative to those that want a Docker-like experience with bare metal processes. As of devenv 2.0, though, they've replaced process-compose with a native version, but with a compat layer so old stuff doesn't break.

## Setting the environment

At some point, we're gonna need environment variables. Luckily, devenv can handle that for us.

Because I take a worktree first approach, I need to change a few things so the environment is properly
set for Laravel. There's a bit of contention here, as Laravel wants to manage its own environment through
a `.env` file. Devenv can inject environment variables into the dev shell too, and ultimately only one variable
can win the race (condition). For worktrees, I think of it like this:

- If the environment variable is dynamic, put it in `devenv.nix`
- If the environment variable is static, keep it in `.env`

For a basic Laravel app, this means we need to keep a few variables managed by `devenv.nix`, namely:

- APP_URL: The URL we use here will be specific to the domain the worktree is using
- APP_PORT: Each worktree gets it's own server port
- DB_DATABASE: We don't want worktrees muddying up data between themselves
- REDIS_DB: Same idea as above, we don't want stale caches between trees OR jobs pulling off the wrong queue (if using Redis as the queue driver)
- XDEBUG_PORT: Nice to have to run xdebug among multiple trees if needed

Simply enough, we can set these directly in our `devenv.nix`:

```nix {}{71-77}
{ pkgs, lib, ... }:

let
  worktreeName = builtins.baseNameOf (toString ./.);

  indexFile = ./.devenv-index;
  index =
    if builtins.pathExists indexFile then
      lib.toInt (lib.removeSuffix "\n" (builtins.readFile indexFile))
    else
      0;

  appPort = 8000 + index;
  vitePort = 5173 + index;
  xdebugPort = 9003 + index;
  dbName = "my_awesome_project_" + lib.replaceStrings [ "-" "." ] [ "_" "_" ] worktreeName;
  hostname = if worktreeName == "main" then "my-awesome-project.test" else "${worktreeName}.my-awesome-project.test";

  toolsPath = /. + "${builtins.getEnv "HOME"}/.config/devenv/tools.nix";
in
{
  imports = [ toolsPath ];

  dotenv.disableHint = true;

  languages.php = {
    enable = true;
    version = "8.4";
    extensions = [
      "redis"
      "pdo_pgsql"
      "pgsql"
      "intl"
      "bcmath"
      "gd"
      "zip"
      "xdebug"
    ];
    ini = ''
      ${builtins.readFile ./php.ini.base}
      xdebug.client_port = ${toString xdebugPort}
      ${lib.optionalString (builtins.pathExists ./php.local.ini) (builtins.readFile ./php.local.ini)}
    '';
  };

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    npm.enable = true;
  };

  packages = with pkgs; [
    postgresql_16
    redis
  ];

  processes.app.exec = "php artisan serve --host=127.0.0.1 --port=${toString appPort}";
  processes.queue.exec = "php artisan queue:listen --tries=1";
  processes.logs.exec = "php artisan pail --timeout=0";
  processes.horizon.exec = "php artisan horizon";
  processes.vite.exec = "npm run dev -- --port ${toString vitePort} --strictPort";

  processes.migrate = {
    exec = "php artisan migrate --force";
    process-compose.availability.restart = "no";
  };
  processes.app.process-compose.depends_on.migrate.condition = "process_completed_successfully";
  processes.horizon.process-compose.depends_on.migrate.condition = "process_completed_successfully";
  processes.queue.process-compose.depends_on.migrate.condition = "process_completed_successfully";

  env = {
    APP_URL = "https://${hostname}:8443";
    APP_PORT = toString appPort;
    DB_DATABASE = dbName;
    REDIS_DB = toString index;
    XDEBUG_PORT = toString xdebugPort;
  };
}
```

The `env` block uses the `let` bindings to create those variables Laravel expects to be in place when
caching its config on first boot. This means **you should remove these from `.env`** so they don't collide
with the value managed by devenv for the worktree.

## A poor man's port allocator

You might have noticed a magic incantation back in the `let` block:

```nix
indexFile = ./.devenv-index;
index =
  if builtins.pathExists indexFile then
    lib.toInt (lib.removeSuffix "\n" (builtins.readFile indexFile))
  else
    0;

appPort = 8000 + index;
vitePort = 5173 + index;
xdebugPort = 9003 + index;
```

This deserves an explainer. Worktrees are gloriously isolated, except for one small detail: ports are
global. The OS only has one `:8000` to give out, and if I'm running `php artisan serve` in `main` and try
to spin up the same in `feature-foo`, one of them is going to lose. And it's usually whichever one I care
more about at the time.

So we need each worktree to know "I'm worktree #3, you go grab port 8003." We also want it to be
deterministic, so that `APP_URL` doesn't change every time the dev shell boots, otherwise our caddy
config goes stale and we're back to manually editing things like cavemen.

I tried a few clever solutions first (hashing the worktree name to a port, picking a random free port at
boot, etc.) and they all had the same problem: either they collided in some clever way, or they made the
URL non-stable, or they required a service registry which is comically over-engineered for one developer
on one laptop.

The dumb solution wins: a single integer in a file called `.devenv-index`. `main` is index `0` and gets
the base ports (8000 for the app, 5173 for vite, 9003 for xdebug). Every other worktree gets the next
free integer, and ports are computed by adding the index. Index 1 gets `:8001`, index 2 gets `:8002`, and
so on, ad nauseam.

Stable, collision-free, requires zero infrastructure. This is what every distributed systems class warns
you about (no central authority, no lease, no consensus), but it's fine because the "cluster" is my
laptop and the "consensus protocol" is `fd` plus `sort -u`.

So how does the integer get into the file? Worktrunk hooks. When I create a new worktree, worktrunk runs
whatever I've configured in `.config/wt.toml`, including a `[post-create]` hook that scans sibling
worktrees, picks the lowest free index, and writes it to `.devenv-index` before the nix shell ever sees
the directory.

#### `.config/wt.toml`

```toml
[post-create]
devenv-onboard = """
set -euo pipefail

# 0 is reserved for main. Scan sibling worktrees for indices already in use.
parent="$(cd .. && pwd)"
used="$( {
  echo 0
  fd --hidden --glob '.devenv-index' "$parent" --min-depth 2 --max-depth 2 --exec-batch cat
} 2>/dev/null | sort -un )"

# Pick the lowest free integer.
idx=0
while echo "$used" | grep -qFx "$idx"; do idx=$((idx+1)); done
echo "$idx" > .devenv-index
"""
```

A few things to call out:

- The hook runs `fd` in the parent directory because of the bare-repository layout we set up earlier. All worktrees are siblings, so a 2-deep scan picks them all up.
- `0` is hardcoded as taken even though `main` doesn't actually have a `.devenv-index` file. Saves a special case.
- Gaps are intentional. If I delete worktree #2 and then create a new one, it'll grab `2` again. Renumbering live worktrees would be its own special kind of hell.

That's it. Hook runs once per worktree creation, writes a single number, and the nix file does the rest.

## Caddy, but for worktrees

Remember that single caddy site file we wrote way back in "Not your dad's web server"? That was the toy
version. With worktrees, each one needs its own hostname pointing at its own port (since each worktree
got its own app and vite ports via the `.devenv-index` trick), which means each worktree needs its own
caddy fragment.

The good news: we already have everything we need. `/etc/resolver/test` wildcards every `.test`
subdomain to `127.0.0.1`, so `feature-foo.my-awesome-project.test` resolves correctly without any
per-worktree DNS work. Caddy is doing all the actual routing by Host header.

The remaining job is generating one caddy fragment per worktree and gently nudging caddy to pick it up.
I keep a small helper script for the templating:

#### `~/.config/devenv/bin/write-site`

```bash
#!/usr/bin/env bash
# usage: write-site <hostname> <app_port> <vite_port>
set -euo pipefail

hostname="${1:?usage: write-site <hostname> <app_port> <vite_port>}"
app_port="${2:?missing app_port}"
vite_port="${3:?missing vite_port}"

out="$HOME/.config/devenv/sites/${hostname}.caddy"
cat > "$out" <<CADDY
${hostname}:8443 {
    tls internal

    @websocket {
        header Connection *Upgrade*
        header Upgrade websocket
    }
    handle @websocket {
        reverse_proxy 127.0.0.1:${vite_port}
    }

    @vite path /@vite/* /@id/* /@fs/* /@react-refresh /resources/* /node_modules/* /__laravel_vite_plugin__/*
    handle @vite {
        reverse_proxy 127.0.0.1:${vite_port}
    }

    handle {
        reverse_proxy 127.0.0.1:${app_port}
    }
}
CADDY
```

This is the same caddy fragment from before, just with the hostname and ports as variables. Drop it into
`~/.config/devenv/sites/` next to its siblings, and the `import sites/*.caddy` line in our root
`Caddyfile` picks it up on the next reload.

For the reload, I have another helper that POSTs the rendered config to caddy's admin API:

#### `~/.config/devenv/bin/reload-caddy`

```bash
#!/usr/bin/env bash
set -euo pipefail

if curl -sf http://127.0.0.1:2019/config/ >/dev/null 2>&1; then
    curl -fsS -X POST 'http://127.0.0.1:2019/load' \
        -H 'Content-Type: text/caddyfile' \
        --data-binary @"$HOME/.config/devenv/Caddyfile"
fi
```

Why hit the admin API instead of just running `caddy reload`? Because this script gets called from
worktrunk hooks that run outside the devenv shell, and the `caddy` binary isn't always on PATH. The admin
API is on `127.0.0.1:2019` whether or not your shell is set up. The leading `if curl -sf ...` is a no-op
guard for when caddy isn't actually running (no point yelling about it, the next `devenv up` will start
things).

Now we wire it all up by extending the `devenv-onboard` hook from the previous section:

#### `.config/wt.toml`

```toml {}{15-19}
[post-create]
devenv-onboard = """
set -euo pipefail
slug=my-awesome-project

parent="$(cd .. && pwd)"
used="$( {
  echo 0
  fd --hidden --glob '.devenv-index' "$parent" --min-depth 2 --max-depth 2 --exec-batch cat
} 2>/dev/null | sort -un )"
idx=0
while echo "$used" | grep -qFx "$idx"; do idx=$((idx+1)); done
echo "$idx" > .devenv-index

# Register this worktree's hostname with caddy.
hostname="{{ worktree_name }}.${slug}.test"
~/.config/devenv/bin/write-site "$hostname" $((8000 + idx)) $((5173 + idx))
~/.config/devenv/bin/reload-caddy
"""
```

And the inverse on `[post-remove]` so dead worktrees don't leave stale caddy fragments hanging around:

```toml
[post-remove]
devenv-cleanup = """
set -euo pipefail
slug=my-awesome-project
hostname="{{ worktree_name }}.${slug}.test"
rm -f ~/.config/devenv/sites/"${hostname}.caddy"
~/.config/devenv/bin/reload-caddy
"""
```

Self-cleaning, self-allocating, self-routing. The only manual step left is `wt new feature-something`,
and the rest happens before I've finished typing `cd`.

## Vite, meet caddy

Here's a fun gotcha that bit me only after wiring all of the above up. I loaded
`https://my-awesome-project.test:8443` in a fresh browser, popped open devtools, and got a wall of red
in the network panel. Every asset request was going to `http://127.0.0.1:5173` and getting nuked by
mixed-content blocking.

The page is HTTPS. The asset URLs are HTTP. Modern browser sees that and noped out.

The cause is obvious in hindsight. `laravel-vite-plugin` writes the dev server's URL into `public/hot`
so Laravel knows where to load assets from during dev. By default that URL is wherever vite is bound
internally — `http://127.0.0.1:5173` in our case. Caddy is happily proxying `/resources/*` to vite,
but the browser never goes through caddy because vite told Laravel "ignore that, hit me directly."

The fix is to tell vite that its _public_ origin is the caddy URL, not its internal listen address.
We can derive everything we need from `APP_URL` and the same `.devenv-index` trick we used for ports:

#### `vite.config.ts`

```ts
import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { readFileSync } from 'node:fs';
import { defineConfig, loadEnv } from 'vite';

const VITE_PORT_BASE = 5173;

function readWorktreeIndex(): number {
    try {
        return (
            Number.parseInt(readFileSync('.devenv-index', 'utf8').trim(), 10) ||
            0
        );
    } catch {
        return 0;
    }
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const appUrl = new URL(
        env.APP_URL ?? 'https://my-awesome-project.test:8443',
    );
    const vitePort = VITE_PORT_BASE + readWorktreeIndex();

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                refresh: true,
            }),
            inertia(),
            react({
                babel: {
                    plugins: ['babel-plugin-react-compiler'],
                },
            }),
            tailwindcss(),
            wayfinder({
                formVariants: true,
            }),
        ],
        server: {
            host: '127.0.0.1',
            port: vitePort,
            strictPort: true,
            cors: true,
            origin: appUrl.origin,
            hmr: {
                host: appUrl.hostname,
                protocol: 'wss',
                clientPort: Number.parseInt(appUrl.port, 10) || 443,
            },
        },
    };
});
```

A few things worth calling out:

- `server.origin` is the line doing the heavy lifting. It tells `laravel-vite-plugin` to write the caddy URL into `public/hot` instead of the internal `127.0.0.1:5173`. Asset requests now route through caddy like everything else.
- `hmr.protocol: 'wss'` + `hmr.clientPort: 8443` sends the HMR websocket through caddy too. The `@websocket` matcher in the caddy fragment from earlier already handles the upgrade, no extra wiring needed.
- `APP_URL` and the worktree index come from the same sources we already use everywhere else, so this works zero-config across all worktrees. Same recipe, every tree.

The `server` block is only consulted by `vite dev`. `vite build` ignores it entirely, so prod builds
are completely unaffected. Herd handles this for you under the hood via `detectTls`, since it knows
about its own TLS certs and can wire vite up accordingly. With our setup, we get to handle it ourselves.
Small price to pay for owning the stack.

## Shell hooks

# TODO

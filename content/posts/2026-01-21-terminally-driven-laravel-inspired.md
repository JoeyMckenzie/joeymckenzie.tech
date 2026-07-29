---
title: Terminally driven, Laravel inspired
slug: terminally-driven-laravel-inspired
description: 'Neovim (btw)'
image: assets/images/tmux_neovim_meme.jpeg
tag_id: 1
published_at: '2026-01-22'
storage_key: 2026-01-22-terminal-driven-laravel-workflows
---

So I've taken the last month or so to completely rethink my workflow for Laravel
development. I've been a loyal JetBrains subscriber since 2016, working professionally
with IntelliJ (haven't we all at some point?), WebStorm, Rider, and PhpStorm. My daily
PHP work over the last few years with Laravel has been _mainly_ driven with PhpStorm.
After all, it's basically a one stop shop:

- Unmatched PHP intellisense
- Great PHPStan integration and support for custom `@phpstan-type`s and type imports
- DataGrid built-in
- Integrated terminal, plugins for just about anything, etc.

The list goes on. It feels like flying a spaceship with every bell and whistle you
could ever imagine at your fingertips. I love PhpStorm, and will continue to love
JetBrains products until I take my last dying breath. I mean, heck... in a way,
they've helped me pay the mortgage on my house for years at this point by giving
me the tools to effectively do my job well.

Lately, though, I couldn't help but feel the call to throw it all away and get
back to a primordial state where all computer nerds are born... the terminal.
I use the terminal for basically everything anyway, so why not just edit my
code there? I'm already there.

## "I'm not f#@king leaving!"

Over the past few month, I've taken a journey to really embrace the terminal-driven
workflow tailored to PHP, TypeScript, Laravel, and React. After tinkering with tools,
configurations, and everything in between, I've landed somewhere that I'm _really_
starting to enjoy. I can't believe I'm saying this, but... I don't think I'm leaving
my terminal anytime soon.

![meme](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjd1NGZwdXNwOHU3YjhuMW15ODRuYmRpZzVwOXZmZXhicHYzbjN0cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Vi4MRwWi9sYpi/giphy.gif)

I'll go through my setup and what works for me in the hope that it helps someone looking
for a change of pace like myself. A few tools I'm using:

- Neovim (btw)
- LazyVim
- Ghostty
- tmux (and more recently, [zellij](https://zellij.dev/))
- A bunch of plugins to trick myself into thinking I'm using an IDE

I've had an on again/off again relationship with neovim for the last several years.
I would usually try to force myself to use it for at least a week or two out of the year,
even going so far as to delete my daily driver IDE (usually PhpStorm, WebStore, or Rider). It
never stuck, and I usually ended up throwing my hands in the air a few days in, and
would run back to the sweet embrace of my spaceship editor.

I'm not really sure why I would give up so easily, though my theory is that I just
didn't care for configuration at the time as I was also using things like the integrated
terminal and built-in DataGrid to get most of my daily work done.

Over the past few months, though, [tmux](https://github.com/tmux/tmux/wiki) snuck
its way into my daily workflow and has since become a staple in it. I've used tmux in
the past, but it never really stuck. Nowadays, I literally could not imagine my life
without it, _nor_ would I wish a tmux-less world upon my worst enemy. If you're
curious about what tmux is, or how it could help you, [Alex Six](https://www.youtube.com/watch?v=cbn3y_f8eDM)
gave an excellent talk at Laracon US this year about some of the whimsy tmux
brings into the life of a developer. Definitely worth the watch.

I've been forcing myself to use zellij more recently, and once I kicked the tmux
muscle memory and tweaked a few things to my liking to avoid common keybind
conflicts with neovim, it actually became a joy to use. While I still fallback
to tmux when I'm being lazy, zellij is a breath of fresh air and a great modern
take on tmux. And of course... it's written in Rust, so it's got the [RIIR](https://transitiontech.ca/random/RIIR)
thing going for it.

Back to tmux, I was already spending a good chunk of time in my tmux sessions doing
all the normal things we developers do to make it look like we're actually working,
like running dev servers and asset watchers, running queues, running random CLIs,
chatting with Claude/Codex on features, etc. It was more annoying to go back and
forth between my Millenium Falcon-based IDE and my Warp terminal and my patience
was running thin.

So, I went back to the drawing board, cancelled my JetBrains license, and rebuilt my
workflow from the ground up driven entirely through the terminal.

## Embracing the tools

The first order of business was to swap [Warp](https://www.warp.dev/) for [Ghostty](https://ghostty.org/). Warp is great, it's fine.
Truly. I just don't need 95% of the features it gives me. I understand why AI in
your terminal would be a natural extension of capability for it, but I'm not
convinced (read: smart enough) to understand why I'd need it. If I want AI in
my terminal, I run Claude/Codex/Opencode from a tmux pane.

[Alacritty](https://alacritty.org/) used to be my daily driver before swapping to
warp and it was great too. Honestly, you can't really go wrong between iTerm2, Alacritty,
kitty, etc. They're all fantastic terminal emulators. I love ghostty because it's dead
simple to configure (tbh, most terminals are) and it's got great support. It's a [Mitchell Hashimoto](https://mitchellh.com/)
creation, so it's got the backing and I'm bullish on it as a long term product. We'll see
if that changes in the near future.

[Kitty] is great, too, simply because of built-in sessions, which is most of the reason
I use tmux anyway. If you're not ready to embrace tmux/zellij, it's definitely worth
taking it for a spin. Like most things in life, terminal emulators are a matter of
taste, so find one that suites you and your needs.

Neovim was a no-brainer, since if I was to go all in on a terminal-driven workflow,
it's the obvious choice for editing code. Paired with tmux, it feels like a literal
super power to quickly swap between panes and windows for different projects all
with the swift typing of a couple keystrokes. When I hit the ephemeral flow state
while deep in some work, nothing feels better than swapping between files, projects,
workspaces, etc. lightning fast and just getting shit done. Paired with [LazyVim](https://www.lazyvim.org/),
configuration is easy and all of the headache of configuring neovim from scratch is
removed.

Yes, I know... I'm not a vim/neovim purist, but it removes the barrier to
entry (imo) and makes it easy to jump into neovim. Now that I'm bought in, I'm tinkering
with my [config](https://github.com/JoeyMckenzie/nvim.bak) more and more and keep it updated so I can keep my setup the same not matter
what machine I'm working on.

Last, but not least, tmux/zellij are the glue that pull it all altogether, allowing me to
keep a workflow clean and devoid of distraction. I'll get into this in just a bit,
but in short, I run a tmux/zellij session per project each equipped with it's own terminal
workspace and neovim session up running. Makes it easy to encapsulate projects
and keep them as long running processes that even works over ssh so I can jump
right back in to whatever I was working where ever I left off.

I don't deviate from the defaults of ghostty and tmux/zellij _too_ much, but I've landed
on a setup with neovim that I'm really starting to enjoy and wanted to share with
the world. Okay, that's enough talk. Let's get into it!

## Neovim for PHP and Laravel

The first order of business is to get yourself a fresh LazyVim install. They have
some fairly comprehensive documentation and it's a great starting point for getting
up and running with neovim. Neovim also has some great documentation on installing
and setting it up, which is obviously required to get up and running with LazyVim.

Once you've installed neovim, LazyVim is just a starter setup/configuration that
will live under your `$HOME/.config/nvim` directory. You can override your nvim
directory if you're starting fresh, though you can also backup your current config
with a quick `mv ~/.config/nvim ~/.config/nvim.bak`. Once that's done, clone the
LazyVim config with:

```bash
git clone https://github.com/LazyVim/starter ~/.config/nvim
```

LazyVim requires a few tools for the full experience, but nothing too complicated
to install. To make life easier, it helps to have rust and cargo setup, which is
a breeze to manage with [rustup](https://rustup.rs/). You'll also need:

- A [Nerd Font](https://www.nerdfonts.com/) (I use JetBrains Mono)
- [lazygit](https://github.com/jesseduffield/lazygit), an excellent TUI for git
- [tree-sitter-cli](https://github.com/tree-sitter/tree-sitter/blob/master/crates/cli/README.md), installable via `cargo`
- [curl](https://curl.se/), which you probably already have installed
- [fzf](https://github.com/junegunn/fzf?tab=readme-ov-file#using-homebrew) for fuzzy finding
- [ripgrep](https://github.com/BurntSushi/ripgrep) for directory searching, installable via `cargo`
- [fd](https://github.com/sharkdp/fd), a `find` alternative for files, installable via `cargo`

It _seems_ like a lot, but it's really just a handful of tools that are all helpful
outside of a neovim setup. I'm a ghostty, but any true color terminal works.

Once you got that up and running, we're just some configuration tinkering away
from getting up and running with a solid (imo) setup for PHP and Laravel.

[Sean Kegel](https://seankegel.com/neovim-for-php-and-laravel) has an excellent
blog post on setting up Laravel and PHP that is well worth the read, especially
for supplementing treesitter with knowledge about Blade files. I won't regurgitate
the content here, thought you should definitely give that article a read yourself.

One caveat, `nvim-treesitter` supports Blade these days via [tree-sitter-blade](https://github.com/EmranMR/tree-sitter-blade),
so you don't need the custom syntax configuration these days. All that's needed
is a simple `:TSInstall blade` and you're off to the races.

To make this stupid easy, [here](https://github.com/JoeyMckenzie/nvim.bak/blob/main/lua/plugins/php.lua) is my current
PHP setup for neovim. A few of the primary few plugins to supplement neovim for PHP:

- [intelephense](https://intelephense.com/) as my LSP of choice for PHP, though there's also [phpactor](https://github.com/phpactor/phpactor)
- [neotest](https://github.com/nvim-neotest/neotest?tab=readme-ov-file#installation) for running PHPUnit tests
- [laravel.nvim](https://github.com/adalessa/laravel.nvim) for Laravel actions in neovim
- [confirm.nvim](https://github.com/stevearc/conform.nvim) for code linting and formatting via PHPStan pint/php-cs-fixer
- [dap](https://github.com/mfussenegger/nvim-dap) and [dap-ui](https://github.com/rcarriga/nvim-dap-ui)

I have some other stuff, like an entirely vibe coded [Linear](https://github.com/JoeyMckenzie/linear.nvim)
plugin I co-wrote (with Claude, ofc) to give myself an excuse to learn Lua.
There's some other things in there, like [dadbod](https://github.com/tpope/vim-dadbod) for
database integration (more on that later) and [dotenv](https://github.com/ellisonleao/dotenv.nvim)
to allow neovim to parse `.env` files (good for integrations that require API keys 'n such).

`laravel.nvim` is a must, giving you some nice introspection on models through
[virtual information](https://github.com/adalessa/laravel.nvim?tab=readme-ov-file#virtual-information),
especially useful when you're bouncing around models and controllers and can see the
database schema and route information co-located right in the file view. Absolute must have,
include it in your `php.lua` (or wherever you store your PHP/Laravel config) and don't look back.

## Extras

One of my favorite diagnostics in PhpStorm is being able to jump into a PHP and see a yellow
squiggle if the file is missing `declare(strict_types=1)`. It's 2026, there's really no reason
we should be avoiding types in PHP. Your PHP should be typed as maximally as possible, and
that's a hill I'm willing to die. There's obviously caveats here and it can actually be
pretty dangerous to blindly throw a strict type declaration on a file without physically tracing
the callstack to the file in question. Strict types declarations will introduce runtime errors
where their previously may not have been any in the call context, so it should be done cautiously
in older code, but absolutely enforced in new code.

Alas, I digress. All this is to say to get the thing in neovim, I throw this in my config to
get the yellow squiggles on the `<?php` tag for the instant visual feedback when I jump into
a file to know right away what I'm dealing with:

```lua
return {
  cmd = "cat",
  stdin = true,
  args = {},
  stream = "stdout",
  ignore_exitcode = true,
  parser = function(_, bufnr)
    local diagnostics = {}
    local lines = vim.api.nvim_buf_get_lines(bufnr, 0, 10, false)
    local has_php_tag = false
    local has_strict_types = false

    for _, line in ipairs(lines) do
      if line:match("<%?php") or line:match("<\\?") then
        has_php_tag = true
      end
      if line:match("declare%s*%(%s*strict_types%s*=%s*1") then
        has_strict_types = true
      end
    end

    if has_php_tag and not has_strict_types then
      table.insert(diagnostics, {
        lnum = 0,
        col = 0,
        end_lnum = 0,
        end_col = 5,
        severity = vim.diagnostic.severity.WARN,
        message = "Missing declare(strict_types=1);",
        source = "strict_types",
      })
    end

    return diagnostics
  end,
}
```

I throw this in separate `lua/linters/strict_types.lua` file and then include it
when neovim boots up by including it in a `lua/linters/init.lua` file:

```lua
local lint = require("lint")

local ok, strict_types = pcall(require, "linters.strict_types")

if ok then
  lint.linters.strict_types = strict_types
else
  vim.notify("Failed to load strict_types linter: " .. tostring(strict_types), vim.log.levels.WARN)
end
```

To make sure it's included when `nvim-lint` runs, I then add it as an additional linter:

```lua
return {
  -- Other config stuff
  {
    "mfussenegger/nvim-lint",
    opts = function(_, opts)
      require("linters")
      opts.linters_by_ft = opts.linters_by_ft or {}
      opts.linters_by_ft.php = { "phpstan", "strict_types", "mago_lint" }
    end,
  }
}
```

For work and most things, I'm always PHPStan as the default linter, though for personal
projects, I've been test driving [mago](https://mago.carthage.software/) a lot more recently
now that it's hit v1. If I'm feeling masochistic, I'll throw in `mago_analyze` on my
linters, though on large Laravel projects, it can quickly become overwhelming with
the sheer amount of shit it catches. Luckily, mago has PHPStan-like baseline files though,
so it's always an option to run your baseline and lint accordingly.

I have a handy snippet, `strict`, that also punches out a quick `declare(strict_types=1);`
on a PHP file to keep my sanity and save a few keystrokes as well:

```lua
{
  "strict types": {
    "prefix": "strict",
    "body": ["declare(strict_types=1);"],
    "description": "Add strict types declaration"
  }
}
```

I throw that in my `snippets/php.lua` and it's a handy way to drop in anywhere
in the code, see the warning of missing strict types, and throw that bad boy
on the file. There's rector, php-cs-fixer, pint, and mago rules that will handle
it for you, but you should do so cautiously in a large codebase that lacks them.

## The never ending configuration

There's definitely more I want to write in the future in regards to PHP, Laravel,
and neovim, though I assume if you've made it this far, you're fighting an urge to
fall asleep at your keyboard. The beauty (and curse) of things like neovim, tmux,
zellij, ghostty, zsh, and the vast sea of terminal tools out there is the endless
configurability they offer. I'm embarrassed at this point to admit how much time
I've wasted tinkering with, though I'd argue it's time well spent. Configure once,
use anywhere is the motto I've chosen to adopt, and now I can confidently say I
wouldn't have it any other way.

Stay tuned for another one of these ramblings. Until next time, friends!

---
title: My terminal driven Laravel workflow
slug: joyful-facades-and-how-to-write-them
description: 'I use neovim (btw)'
image: assets/images/454b23e8-5bf9-4c11-b161-5dd86e5bbcde_1_105_c.jpeg
tag_id: 1
storage_key: 2025-09-24-joyful-facades-and-how-to-write-them
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
back to the primordial state where all computer nerds are born with the terminal.
I use the terminal for basically everything anyway, so why not just edit my edit
my code there anyway? I'm already there.

So over the past month, I've taken a journey to really embrace the terminal-driven
workflow tailored to PHP, TypeScript, Laravel, and React. After tinkering with tools,
configurations, and everything in between, I've landed somewhere that I'm _really_
starting to enjoy. I can't believe I'm saying this, but... I don't think I'm leaving
my terminal anytime soon.

I'll go through my setup and what works for in the hope that it helps someone looking
for a change of pace like myself. A few tools I'm using:

- Neovim (btw)
- LazyVim
- Ghostty
- tmux

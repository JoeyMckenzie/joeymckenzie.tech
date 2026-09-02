---
title: "Artisanally Laravibing"
description: "Singularity or not, I'm just along for the ride."
pubDate: 2026-08-05
heroImage: "/images/blog/who-is-json.webp"
tags: [laravel]
---

So I've been working on a lot of weird, fun, and random side projects lately to really ~~make my self somewhat employable~~ see how far I could push vibin' with Laravel (obviously). It's been great fun so far, and I'm really enjoying working with the `laravel/ai` package. I've been using it to build an army of application agents, each tailored to accomplish small tasks within its respective application domain.

It's been a lot of fun, and I feel like I've found a system that works for me to responsibly Laravibe with some level of confidence that the side project code that I'm not writing myself (and in some cases, not even reading because f#@k it, it's a side project) is not _total_ garbage. With the onset of accepting our agentic overlords, we've shifted mindsets: code is cheap to write, and anyone can build almost anything now. 

What I've experienced, though, is that code is still expensive to _get_ right. The wrong decision when building a product is costly when made up front with nothing in the way to stop it. Through my escapades, I've landed somewhere I'm really enjoying in keeping the guardrails in place to let the agents run wild, knowing the checks and balances in place in the code will always, more or less, guide them to do the right thing.

## The tools

Getting right to it, I'll outline what I feel has been the most successful for me in my Laravibing journey:

- [PHPStan](https://phpstan.org) turned up to the max with a few extras thrown on top
- [Deptrac](https://github.com/deptrac/deptrac) to keep agents from putting shit wherever they want
- [Infection](https://infection.github.io/guide/) with a reasonable MSI (you'll never hit 100%, so no point in trying)
- [Rector](https://getrector.com/documentation) tuned up to maximum strictness
- [Backlog](https://github.com/MrLesk/Backlog.md) so I'm not constantly asking myself "wait... why did I build it this way"
- [Tuicr](https://tuicr.dev/) for the rare moments I want to actually review some agent code
- A few good skills, like Matt Pocock's [grilling skills](https://www.skills.sh/mattpocock/skills/grill-with-docs)

I'm overdue for some writing, so let's get into how I use each of these tuned for Laravel vibing.

## Banning lazy code with PHPStan

I'm sure the majority of us, having a pulse and writing PHP of any consequence, are aware of what PHPStan is and the problem it solves. This isn't a PHPStan-centric blog post, even though I've written about my love for the tool in the past.

I've been most successful in Laravibing when I tune PHPStan to the max, with minimal exceptions. A typical configuration for my mostly side project driven development has looked something like:

```neon
includes:
	- phar://phpstan.phar/conf/bleedingEdge.neon

parameters:
    level: max
    paths:
        - app
        - config
        - database
        - routes
        - tests
        - public/index.php
        - bootstrap/app.php
        - bootstrap/providers.php
    tmpDir: .phpstan
    type_coverage:
        return: 100
        param: 100
        property: 100
        constant: 100
        declare: 100
    ignoreErrors:
        - identifier: staticMethod.dynamicCall
```

The most important pieces here are the max reinforcement, using [bleeding edge](https://phpstan.org/blog/what-is-bleeding-edge), and making 100% type coverage via Tomas Votruba's [type-coverage](https://github.com/TomasVotruba/type-coverage) plugin nonegotiable. As a matter of fact, if you're a Pest enjoyer (I do love Pest, but agents know and love PHPUnit and I ain't readin' allat LLM-generated test code), then you've been silently [using the type coverage plugin](https://github.com/pestphp/pest-plugin-type-coverage/blob/d4b50bf0a813a60e2d24671afe17ec046bb290cd/composer.json#L21) without knowing it. Pest puts a nice interaction layer on top of it, but it's easy enough to configure yourself if you're inclined to do so.

I also bring a few extras along for the ride in the form of plugins:

#### [phpstan-strict-rules](https://github.com/phpstan/phpstan-strict-rules) 

For basically banning PHP code that made WordPress popular (no use of `empty`, no loose comparisons, etc.). This works really well with agents and forces them to write PHP like it's 2026 and not 2009. I particularly love the `disallowedShortTernary` as I'll catch Claude every now again using the `?:` operator instead of a `??` null coalescer expanded a bit to get the same effect, but safer for those truthy/falsy evaluations. It's a great addition if you're into maximum strictness when writing PHP and it keeps your agents on their toes when guessing that next token.

#### [extension-installer](https://github.com/phpstan/extension-installer)

Pretty self explanatory, but the unsung hero of PHPStan extensions. It does as advertised, automatically registering plugins so I don't have to remember to continually add to my `include` block. Automatic extension registration can be a fickle beast, however, especially when attempting major/minor upgrades of libraries that register their own plugins themselves (looking at you, Carbon...). Use with caution.

#### [larastan/larastan](https://github.com/larastan/larastan)

Another "well obviously!" plugin, mandatory for using PHPStan in any form on a Laravel project.

#### [tomasvotruba/type-coverage](https://github.com/TomasVotruba/type-coverage)

I just mentioned this, but refinforcing it here. This is the foundation of not allowing agents to be lazy while slinging tokens all over my code. Enforcing type constraints everywhere with no exception is like bowling with the bumpers up. Even if a `mixed` slides in somewhere in the callstack, strict rules will more than likely enforce checking it before doing anything of consequence, keeping agents from getting lazy about type safety.

There's a lot of other great PHPStan plugins that are worth playing around with and building out your own personal arsenal of plugins you enjoy. Onto the next!

## Keeping architecture sane with Deptrac

Deptrac is the epitome of if "wElL AcKsHuAlLy" were a PHP package. It's pedantic and probably the most of the required tastes in my arsenal. You either hate architecture testing and see no point in it, or you can't live without it. I'm on the "can't live without" side of the fence, and I find it immensely helpful when working on features within a monorepo. Laravel codebases tend to be massive given enough time, and with agents ~~slopping~~ slinging code all over them now, I'd argue a tool like deptrac proves itself invaluable over time.

Deptrac doesn't test your _code_, it tests your _architecture_ by primarily looking at namespace imports. It's effectively a test library enforcing your decisions about where your code lives. A domain-driven contrived example might look like:

```bash
app/
  Modules/
    Billing/
    Payments/
    Shared/
    # etc.
```

You could imagine a scenario where `Billing/` has a set of actions/services scoped to the billing domain that, over time, start to look pretty tasty to the `Payments/` domain. Maybe some shared Stripe utilities, etc. So you begin importing `App\Modules\Billing\...` althroughout your payments code. Then more time passes, and billing starts adding some stuff to its domain that looks pretty juicy from the payments domain. A few `App\Modules\Payments\...` import references later within the billing domain, and now we've created a runaway circular dependency chain between two formerly isolated modules.

If I want to refactor how a service works in the billing domain, I can no longer do so in isolation as now the blast radius hits another domain module. So on and so forth, a tale as old as time.

This is why deptrac exists, to force you to think about your dependency graph _before_ you make a giant ball of code spaghetti. A simple `deptrac.php` configuration for the above might look like:

```php
<?php

use Deptrac\Deptrac\Contract\Config\Collector\ClassLikeConfig;
use Deptrac\Deptrac\Contract\Config\DeptracConfig;
use Deptrac\Deptrac\Contract\Config\Layer;
use Deptrac\Deptrac\Contract\Config\Ruleset;

return static function (DeptracConfig $config): void {
    $config
        ->layers(
            $billing = Layer::withName('Billing')->collectors(
                DirectoryConfig::create('app/Modules/Billing/.*'),
            ),
            $payments = Layer::withName('Payments')->collectors(
                DirectoryConfig::create('app/Modules/Payments/.*'),
            ),
            $shared = Layer::withName('Shared')->collectors(
                DirectoryConfig::create('app/Modules/Shared/.*'),
            ),
        )
        ->rulesets(
            Ruleset::forLayer($billing)->accesses($shared),
            Ruleset::forLayer($payments)->accesses($shared),
            Ruleset::forLayer($shared),
        );
};
```

I'm codifing the rules that `Billing/` and `Payments/` can _only_ depend on anything in shared. If an agent were to start importing `Billing/` domain code into `Payments/` domain code, that would violate my rules and a quick `vendor/bin/deptrac` would alert the agent to it. It's a signal that now my domain code _probably_ needs to be put somewhere else in the `Shared/` layer, as deptrac works on a whitelisting approach. Layers need to explicitly define what they're allowed to access via class maps, namespaces, directories, etc. and because a deptrac config file can be written with good ol' PHP, the sky is the limit for how dynamic and fancy I want to make that definition.

## Testing tests

It goes without saying that agents are good at writing tests. I need to shamefully admit that I _rarely_ fine-tooth comb review PHPUnit tests from Claude. If it passes the eye glance test, it's _probably_ good enough for the code's sake. But tests are artifacts of requirements at the time, and when they break (not if), we have to rewrite them. 

The flip side of that coin is having confidence that a test is actually good enough to be trusted, and that's where [infection](https://infection.github.io/guide/) comes in. Pest has a mutation plugin as well, and it works similarly to infection. I've been using infection to change the mindset of my agent's output from writing tests just because I mentioned TDD in my `CLAUDE.md` to writing tests that are defensible over time. Infection has a great example of this on their home page that I'll reiterate here. Take for example a simple function that does something like:

```php
final class BillingCalcutor
{
    /** @var string[] */
    private array $errors;

    public bool $containsErrors {
        get => $this->errors !== [];
    }

    public function __construct()
    {
        $this->errors = [];
    }
}
```

We can imagine an associated test that might look like:

```php
#[CoversClass(BillingCalculator::class)]
final class BillingCalculatorTest extends TestCase
{
    #[Test]
    public function veries_no_errors_exist(): void
    {
        $calculator = new BillingCalculator;

        self::assertFalse($calculator->containsErrors);
    }
}
```

To the wandering eye, this makes total sense. A fresh `BillingCalculator` instance has no errors, so this passes as we'd expect. A mutation test will _change_ the source code to check whether the test still passes. Infection runs will _mutate_ (hence the name) our code, and our `BillingCalculator` might be changed to something like:

```php
final class BillingCalcutor
{
    // Other stuff...

    public bool $containsErrors {
        get => $this->errors === [];
    }
}
```

Changing `!==` to `===`, and rerun our tests. It passes in this case, though a very contrived example. Our codebases are litered with magic numbers, `>`/`<` comparisons, `=== 0` and `=== 1`, and any number conditionals all over the place. Infection measures when a mutation _escapes_, or when a small change to the code being tested still passes after that change. Infection counts the number of those escaped mutations compared to the number of total mutants it threw at the code, giving us a score on the other side as a percentage. Just like code coverage metrics, however, it should always be taken with a grain of salt. If you chase the mythical 100% mutation coverage, you'd be wasting your time as it will naturally lower as time goes on and more code is generated. When a mutant escapes, it usually means we need additional tests for scenarios we might not have tested before.

It's a tough threshold to hit, though when proactively maintained, I find it to be immensely helpful when I yeet code to `main` without even looking at it. My mindset as of late has gone from "did the tests pass?" to "what's the minimum amount of flaky tests I'll tolerate?" when I'm running on pure vibes.

## Refactoring on easy mode

Now to (arguably) everyone's favorite automated code janitor, Rector. I'm sure we're all aware of rector and how awesome it is, and I usually keep my rector setup fairly minimal. I throw in [driftingly-rector](https://github.com/driftingly/rector-laravel), and call it a day. My configuration usually ends up looking something like:

```php
<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use Rector\Php83\Rector\ClassMethod\AddOverrideAttributeToOverriddenMethodsRector;
use Rector\TypeDeclaration\Rector\StmtsAwareInterface\DeclareStrictTypesRector;
use RectorLaravel\Set\LaravelSetProvider;

return RectorConfig::configure()
    ->withPaths([
        __DIR__.'/app',
        __DIR__.'/bootstrap/app.php',
        __DIR__.'/bootstrap/providers.php',
        __DIR__.'/database/factories',
        __DIR__.'/database/seeders',
        __DIR__.'/config',
        __DIR__.'/public',
        __DIR__.'/resources',
        __DIR__.'/routes',
        __DIR__.'/tests',
    ])
    ->withRules([
        AddOverrideAttributeToOverriddenMethodsRector::class,
        DeclareStrictTypesRector::class,
    ])
    ->withSetProviders(LaravelSetProvider::class)
    ->withComposerBased(laravel: true)
    ->withPreparedSets(
        deadCode: true,
        codeQuality: true,
        codingStyle: true,
        typeDeclarations: true,
        privatization: true,
        earlyReturn: true,
    )
    ->withPhpSets(php85: true);
```

Notably, I'll make sure all of the source code relevant to Laravel that actually does something is covered for automatic refactoring. I add a few of my favorite rules for sprinkling in some `#[Override]`s and `declare(strict_types=1)`s to keep things strict by default. There's not much more to say about rector, it's just a great tool that every PHP codebase needs and should have installed and running in CI without even giving it a second thought.

## Backlogging the backlog

If Jira was a person:

![manager meme](/images/blog/artisanally-laravibing/manager-meme.webp)

I'm a Linear man myself (as the good lord intented), so you can miss me with those Atlassian products. It goes without saying a lot of our time is more than likely spent looking at backlog/sprint dashboards. When I'm vibing away on my Laravel projects that will inevitably go nowhere, however, I don't want or need a full blown ticket management app to collect my thoughts for my agent army to work through. That's where [backlog](https://github.com/MrLesk/Backlog.md) comes in.

I used [taskwarrior](https://taskwarrior.org/) for years, though I've found given the onset of the agentic age, backlog is exactly what I've been looking for all this time. 

![backlog screenshot](/images/blog/artisanally-laravibing/backlog-board.webp)

Backlog is configurable as hell, and the defaults are more than sensible. I keep it simple, with just a To Do, In Progress, and Done column. Opening a ticket with those sweet, sweet neovim (btw) keybindings gives a sane view of a ticket:

![backlog open](/images/blog/artisanally-laravibing/backlog-ticket.webp)

Even better yet, backlog includes an MCP, so I can rip tickets and build the backlog within a session anytime anything comes to mind:

> Me: "Add a backlog ticket to remind me to get off my laptop and touch grass."
>
> Agent: "Say less, my guy. JOEY-22 has been added to the backlog."

When I'm plugged into flow state straight vibing with no time to write my thoughts, backlog comes in to save the day and organize the chaos in my brain in a sensible manor that's agent friendly and TUI ready.

## TUI-driven code review

At this point, there's no lack of terminal-based code review tools. If it's come out in the last decade, chances are I've probably tried it, and gone crawling back to GitHub's questionable PR UX. But then I found [tuicr](https://tuicr.dev/) and it changed how I viewed code review terminal tools. Tuicr is the first TUI code review tool that actually has sane vim keybinds and the interface is dead simple:

![tuicr](/images/blog/artisanally-laravibing/tuicr.webp)

View file diffs, leave comments like it's an actual PR, and with a `y`ank after you're done, you get a prompt that's agent ready for review:

```bash
I reviewed your code and have the following comments. Please address them.

Reviewing commit: 2fd3963

## Local tuicr Comments

1. `app/Models/Project.php:137` (commit 2fd3963) - Let's use `Config::string` instead here.
```

The prompt is configurable, and it just makes sense. I've had an on again/off again relationship with [octo](https://github.com/pwntester/octo.nvim), and it unfortunately never really stuck. Now when I'm vibing and want to get a quick review of the agent code, I spin up a tuicr session, review the code, and feed it back to the reviewer. Dead simple, ezpz.

## Skills, skills, skills

Use the `/grill-with-docs` and `/grilling` skills [Matt Pocock](https://x.com/mattpocockuk) has graciously provided the developer world. That's it, really. Ideate on a feature, have an agent write up a plan, feed it through a grill session and record an architecture decision record. Move on with with your life.

Also, manage your skills from a singular source. Much like dotfile utilities exist, I find it immensely helpful to keep the skills I want globally enabled for all the things I use across projects centrally located. I use nix, so I keep my skills in my [dotfiles](https://github.com/JoeyMckenzie/dotfiles/tree/main/nix-darwin/home/skills) managed with [home manager](https://github.com/nix-community/home-manager). Anytime I rebuild my system, nix will symlink out my global skills from the nix store to the places my agents look for them, like `~/.claude/skills`, `~/.codex/skills`, `~/.pi/skills`, etc. Adding a new skill is just adding it to my dotfiles, rebuilding the system, bada bing bada boom, now all my agent tooling picks it up and I don't have to think about. Works the same the agent files, too.

## Something something profit

There's probably _a lot_ I'm not doing here that could optimize how I Laravibe even harder, but this is what's been working for me. I just wrapped my mind around loops, only to find out we've moved on to [graphs](https://x.com/steipete/status/2078277297791189132?s=20) now. I have no fucking clue what's coming next, but I know I'm excited to learn it and have it inevitably contribute to my AI psychosis and perpetual fear of unemployment. 

I'm just gonna enjoy the ride and see where it takes me. Until next time, friend!

<main class="w-full max-w-2xl px-6 py-12 lg:px-8 lg:py-16 space-y-12">
    <header class="space-y-4">
        <div class="flex flex-col">
            <div class="flex flex-wrap items-center justify-between">
                <flux:heading size="xl" data-animation="slideUp">
                    What I'm focused on now
                </flux:heading>
                <x-social-links class="md:justify-end" />
            </div>
            <flux:text class="mt-2" data-animation="slideUp" data-stagger="0.05">
                A living changelog of what I'm learning, tinkering with, and thinking about outside of client work.
            </flux:text>
        </div>
    </header>

    <section class="space-y-6">
        <flux:heading size="lg" data-animation="slideUp">Building</flux:heading>
        <div class="space-y-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300" data-animation="slideUp"
            data-stagger="0.05">
            <p>
                I'm heads down on a few personal projects: polishing this blog, experimenting with Laravel packages that
                make developer tooling more fun, and continuing a series on small PHP APIs that power side projects.
            </p>
            <ul class="space-y-2 list-disc pl-6">
                <li>Refining a CLI-first documentation browser powered by SQLite + Laravel Zero.</li>
                <li>Iterating on a handful of Livewire components to make content-heavy pages more delightful.</li>
                <li>Sketching ideas for a workshop on Orbit content workflows.</li>
            </ul>
        </div>
    </section>

    <section class="space-y-6">
        <flux:heading size="lg" data-animation="slideUp">Learning</flux:heading>
        <div class="space-y-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300" data-animation="slideUp"
            data-stagger="0.05">
            <p>
                When I grab a spare hour I'm usually digging into: PHPStan rule authoring, Rust web tooling (Axum +
                Shuttle), and better content modeling patterns for Orbit/Laravel hybrid sites.
            </p>
            <p>
                I'm also keeping notes on DX ergonomics for APIs—expect future posts unpacking the trade-offs between
                "developer happiness" and strict static analysis in PHP land.
            </p>
        </div>
    </section>

    <section class="space-y-6">
        <flux:heading size="lg" data-animation="slideUp">Offline</flux:heading>
        <flux:text class="text-sm" data-animation="slideUp" data-stagger="0.05">
            Offline looks like chasing a toddler, perfecting my espresso game, and sneaking in early morning trail runs.
            If you're working on similar things or just want to talk shop, the links above are the fastest way to reach
            me.
        </flux:text>
    </section>
</main>

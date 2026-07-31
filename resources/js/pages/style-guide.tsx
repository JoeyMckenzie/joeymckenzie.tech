import { Head } from '@inertiajs/react';
import PostCard from '@/components/blog/post-card';
import type { BlogPost } from '@/types/blog';

const samplePosts: BlogPost[] = [
    {
        title: 'Local Laravel with nix and devenv',
        slug: 'local-laravel-with-nix',
        description: 'We have Herd at home.',
        tag: 'nix',
        cover: null,
        publishedAt: '2026-05-19',
        publishedLabel: 'May 19, 2026',
        readingMinutes: 12,
        views: 1200,
    },
    {
        title: 'Terminally driven, Laravel inspired',
        slug: 'terminally-driven-laravel-inspired',
        description: 'Neovim (btw).',
        tag: 'tooling',
        cover: null,
        publishedAt: '2026-01-22',
        publishedLabel: 'Jan 22, 2026',
        readingMinutes: 8,
        views: 843,
    },
];

const tokens: { name: string; className: string }[] = [
    { name: 'canvas', className: 'bg-canvas' },
    { name: 'panel', className: 'bg-panel' },
    { name: 'hairline', className: 'bg-hairline' },
    { name: 'prose', className: 'bg-prose' },
    { name: 'subtle', className: 'bg-subtle' },
    { name: 'iris', className: 'bg-iris' },
    { name: 'ember', className: 'bg-ember' },
];

export default function StyleGuide() {
    return (
        <>
            <Head title="Style guide" />

            <div className="mx-auto max-w-3xl px-6 py-16">
                <header>
                    <p className="font-mono text-xs tracking-widest text-subtle uppercase">
                        joey mckenzie · colophon
                    </p>
                    <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-prose">
                        Nocturne
                    </h1>
                    <div className="nocturne-sweep mt-4 w-40 rounded-full" />
                    <p className="mt-4 max-w-xl text-subtle">
                        My design tokens, here in the open. Type, color, and
                        components this whole site is built from. The aim is an
                        easy on the eyes typeset essay read at night, with a
                        craftsman&rsquo;s fingerprint at the bottom of the
                        screen.
                    </p>
                </header>

                <section className="mt-16">
                    <h2 className="font-mono text-xs tracking-widest text-subtle uppercase">
                        palette
                    </h2>
                    <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-7">
                        {tokens.map((t) => (
                            <div key={t.name} className="space-y-1.5">
                                <div
                                    className={`h-14 rounded-lg border border-hairline ${t.className}`}
                                />
                                <p className="font-mono text-[0.65rem] text-subtle">
                                    {t.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-16">
                    <h2 className="font-mono text-xs tracking-widest text-subtle uppercase">
                        post card
                    </h2>
                    <div className="mt-4 space-y-4">
                        {samplePosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                </section>

                <section className="mt-16">
                    <h2 className="font-mono text-xs tracking-widest text-subtle uppercase">
                        article prose
                    </h2>
                    <article className="prose-nocturne mt-6">
                        <h2>Rethinking the workflow</h2>
                        <p>
                            So I&rsquo;ve taken the last month or so to
                            completely rethink my workflow for Laravel
                            development. I&rsquo;ve been a loyal JetBrains
                            subscriber since 2016, but something had to give,
                            and it turned out to be my{' '}
                            <a href="#">entire editor</a>.
                        </p>
                        <blockquote>
                            We have Herd at home. The Herd at home: a pile of
                            nix expressions and a suspicious amount of
                            confidence.
                        </blockquote>
                        <p>
                            The trick is to keep the good parts, a fast{' '}
                            <code>artisan</code> loop, real type-checking
                            &mdash; while dropping the ceremony. Here&rsquo;s
                            the shape of it:
                        </p>
                        <pre data-language="rust">
                            <code>{`fn main() {
    let greeting = "hello, nocturne";
    println!("{greeting}");
}`}</code>
                        </pre>
                        <ul>
                            <li>Terminal-native, but dressed for company.</li>
                            <li>One motion moment, then silence.</li>
                            <li>Code that feels at home on the page.</li>
                        </ul>
                    </article>
                </section>

                {/* Statusline motif */}
                <section className="mt-16">
                    <h2 className="font-mono text-xs tracking-widest text-subtle uppercase">
                        statusline
                    </h2>
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-hairline bg-panel px-3 py-2 font-mono text-xs text-subtle">
                        <span className="rounded bg-iris/15 px-1.5 py-0.5 font-medium text-iris">
                            NORMAL
                        </span>
                        <span>~/blog/local-laravel-with-nix</span>
                        <span className="text-iris">nix</span>
                        <span className="ml-auto">42%</span>
                        <span>↑ 1.2k</span>
                        <span className="nocturne-cursor text-prose">▮</span>
                    </div>
                </section>

                {/* Colophon note */}
                <p className="mt-20 font-mono text-xs text-subtle">
                    built with Laravel, Inertia &amp; Tailwind · type set in
                    Fraunces, Geist &amp; Geist Mono
                </p>
            </div>
        </>
    );
}

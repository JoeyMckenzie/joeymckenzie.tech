import { Head, Link } from '@inertiajs/react';
import PostCard from '@/components/blog/post-card';
import SocialLinks from '@/components/social-links';
import { index as blogIndex } from '@/routes/blog';
import type { BlogPost } from '@/types/blog';

interface HomeProps {
    posts: BlogPost[];
}

/**
 * Home page (JOEY-13.2): a Fraunces typographic hero with the first-light
 * sweep, a short bio, social links, and the 3 most-recent published posts.
 *
 * The hero is intentionally sparse — one thesis line in Joey's register, set
 * large in Fraunces, with the ember→iris sweep beneath it. Everything below
 * earns its place by leading the reader toward the writing.
 */
export default function Home({ posts }: HomeProps) {
    return (
        <>
            <Head>
                <meta
                    name="description"
                    content="Software engineer, professional rabbit-hole diver. Writing about Laravel, Rust, and whatever has my attention this month."
                />
            </Head>

            <div className="mx-auto max-w-3xl px-6 py-16">
                {/* Hero */}
                <header>
                    <p className="font-mono text-xs tracking-widest text-subtle uppercase">
                        joey mckenzie
                    </p>
                    <h1 className="mt-4 font-display text-5xl leading-[1.05] font-medium tracking-tight text-prose sm:text-6xl">
                        Software engineer.
                        <br />
                        <span className="text-subtle">Professional</span>{' '}
                        <span className="text-subtle">rabbit-hole diver.</span>
                    </h1>
                    <div className="nocturne-sweep mt-6 w-40 rounded-full" />
                    <p className="mt-6 max-w-xl text-lg text-subtle">
                        I build things with Laravel, Rust, and whatever has my
                        attention this month. Mostly code, occasionally
                        opinions, perpetually down a wiki trail.
                    </p>
                    <div className="mt-8">
                        <SocialLinks />
                    </div>
                </header>

                {/* Recent writing */}
                {posts.length > 0 && (
                    <section className="mt-20">
                        <div className="flex items-baseline justify-between">
                            <h2 className="font-mono text-xs tracking-widest text-subtle uppercase">
                                recent writing
                            </h2>
                            <Link
                                href={blogIndex.url()}
                                className="font-mono text-xs text-iris transition-colors hover:underline"
                            >
                                all posts →
                            </Link>
                        </div>
                        <div className="mt-6 space-y-4">
                            {posts.map((post) => (
                                <PostCard key={post.slug} post={post} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}

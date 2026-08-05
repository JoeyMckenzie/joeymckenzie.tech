import { Link } from '@inertiajs/react';
import { PostCard } from '@/components/blog/post-card';
import { Seo } from '@/components/seo';
import { SocialLinks } from '@/components/social-links';
import { index as blogIndex } from '@/routes/blog';
import type { BlogPost } from '@/types/blog';

interface HomeProps {
    posts: BlogPost[];
}

export default function Home({ posts }: HomeProps) {
    return (
        <>
            <Seo description="Software engineer, professional rabbit-hole diver. Writing about Laravel, PHP, and whatever has my attention this month." />

            <div className="mx-auto max-w-3xl px-6 py-16">
                <header>
                    <p className="font-mono text-xs tracking-wide text-subtle">
                        ~/
                    </p>
                    <h1 className="mt-4 font-display text-5xl leading-[1.05] font-medium tracking-tight text-prose sm:text-6xl">
                        Software developer.
                        <br />
                        <span className="text-subtle">Professional</span>{' '}
                        <span className="text-subtle">sidequester.</span>
                    </h1>
                    <div className="nocturne-sweep mt-6 w-40 rounded-full" />
                    <p className="mt-6 max-w-xl text-lg text-subtle">
                        Hey, I'm Joey. I build things with Laravel, PHP, and
                        whatever has my attention this month. Mostly code,
                        occasionally opinions, perpetually down a rabbit-hole.
                    </p>
                    <div className="mt-8">
                        <SocialLinks />
                    </div>
                </header>

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

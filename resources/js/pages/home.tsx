import { Head, Link } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/BlogController';
import { StaggeredItem, StaggeredList } from '@/components/motion';
import PostPreviewCard from '@/components/post-preview-card';
import SocialLinks from '@/components/social-links';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import type { PostSummary } from '@/types';

export default function Home({ recentPosts }: { recentPosts: PostSummary[] }) {
    return (
        <>
            <Head title="Home">
                <meta
                    name="description"
                    content="Developer. Dad. PHP enjoyer. Building things with Laravel and giving unsolicited advice on tech."
                />
            </Head>

            <div className="space-y-3">
                <p className="font-mono text-xs tracking-wide text-muted-foreground">
                    ~/joeymckenzie
                </p>
                <h1 className="text-2xl font-bold tracking-tight">
                    Hi, I'm{' '}
                    <AnimatedShinyText
                        shimmerWidth={80}
                        className="inline text-foreground"
                    >
                        Joey
                    </AnimatedShinyText>
                    .
                </h1>
                <p className="leading-7 text-muted-foreground">
                    Developer. Product builder. Dad. PHP enjoyer. Building
                    things with Laravel and giving unsolicited advice on tech.
                </p>
                <SocialLinks />
            </div>

            <section className="mt-10 space-y-4 pt-6">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl tracking-tight">Recent Posts</h2>
                    <Link
                        href={index()}
                        className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                        more →
                    </Link>
                </div>

                <StaggeredList className="space-y-8">
                    {recentPosts.map((post) => (
                        <StaggeredItem key={post.slug}>
                            <PostPreviewCard post={post} />
                        </StaggeredItem>
                    ))}
                </StaggeredList>
            </section>
        </>
    );
}

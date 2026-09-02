import Link from "next/link";

import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/posts";

export default function Home() {
    const posts = getPosts().slice(0, 3);

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-16">
            <header>
                <h1 className="font-heading text-4xl font-semibold tracking-tight">
                    Software developer.
                    <br />
                    <span className="text-muted-foreground">
                        Professional sidequester.
                    </span>
                </h1>
                <p className="text-muted-foreground mt-6 max-w-xl">
                    Hi, I&apos;m Joey. I build things with Laravel, PHP, and
                    whatever has my attention this month. Mostly code,
                    occasionally opinions, perpetually down a rabbit-hole.
                </p>
            </header>

            {posts.length > 0 && (
                <section className="mt-20">
                    <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-muted-foreground font-mono text-xs tracking-[0.15em]">
                            recent writing
                        </h2>
                        <Button
                            variant="link"
                            size="sm"
                            className="font-mono"
                            render={<Link href="/blog" />}
                            nativeButton={false}
                        >
                            all posts
                        </Button>
                    </div>
                    <div className="mt-6 flex flex-col gap-4">
                        {posts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

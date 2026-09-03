import Link from "next/link";

import { PostCard } from "@/components/post-card";
import { revealDelay } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { getPosts } from "@/lib/posts";

export default function Home() {
    const posts = getPosts().slice(0, 3);

    return (
        <main className="mx-auto w-full max-w-3xl px-4 pt-20 pb-24">
            <header>
                <h1
                    className="font-heading text-display reveal font-semibold"
                    style={revealDelay(1)}
                >
                    Hi<span className="text-primary">,</span> I&apos;m Joey
                    <span className="text-primary">.</span>
                </h1>
                <p
                    className="text-muted-foreground reveal mt-7 max-w-xl leading-relaxed"
                    style={revealDelay(2)}
                >
                    Hi, I&apos;m Joey. I build things with Laravel, PHP, and
                    whatever has my attention this month. Mostly code,
                    occasionally opinions, perpetually down a rabbit-hole.
                </p>
            </header>

            {posts.length > 0 && (
                <section className="mt-24">
                    <div className="reveal" style={revealDelay(3)}>
                        <SectionLabel
                            action={
                                <Link
                                    href="/blog"
                                    className="text-muted-foreground hover:text-primary text-label tracking-label font-mono whitespace-nowrap uppercase transition-colors duration-200"
                                >
                                    all posts
                                </Link>
                            }
                        >
                            recent writing
                        </SectionLabel>
                    </div>
                    {/* No `border-t` here: `SectionLabel` already draws the rule. */}
                    <div className="mt-2 divide-y">
                        {posts.map((post, index) => (
                            <div
                                key={post.slug}
                                className="reveal"
                                style={revealDelay(4 + index)}
                            >
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { colors, fonts, text, tracking } from "@/app/tokens.stylex";
import { Main } from "@/components/main";
import { PostCard } from "@/components/post-card";
import { reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { getPosts } from "@/lib/posts";

const styles = stylex.create({
    heading: {
        fontSize: text.display,
        lineHeight: text.displayLineHeight,
        letterSpacing: tracking.display,
        fontWeight: 600,
    },
    accent: { color: colors.primary },
    intro: {
        marginTop: 28,
        maxWidth: "36rem",
        color: colors.mutedForeground,
        lineHeight: 1.625,
    },
    section: { marginTop: 96 },
    allPosts: {
        color: { default: colors.mutedForeground, ":hover": colors.primary },
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        textDecoration: "none",
        transitionProperty: "color",
        transitionDuration: "200ms",
    },
    list: { marginTop: 8 },
    divided: {
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: colors.border,
    },
});

export default function Home() {
    const posts = getPosts().slice(0, 3);

    return (
        <Main>
            <header>
                <h1 {...stylex.props(styles.heading, reveal(1))}>
                    Hi<span {...stylex.props(styles.accent)}>,</span> I&apos;m
                    Joey
                    <span {...stylex.props(styles.accent)}>.</span>
                </h1>
                <p {...stylex.props(styles.intro, reveal(2))}>
                    Hi, I&apos;m Joey. I build things with Laravel, PHP, and
                    whatever has my attention this month. Mostly code,
                    occasionally opinions, perpetually down a rabbit-hole.
                </p>
            </header>

            {posts.length > 0 && (
                <section {...stylex.props(styles.section)}>
                    <div {...stylex.props(reveal(3))}>
                        <SectionLabel
                            action={
                                <Link
                                    href="/blog"
                                    {...stylex.props(styles.allPosts)}
                                >
                                    all posts
                                </Link>
                            }
                        >
                            recent writing
                        </SectionLabel>
                    </div>
                    <div {...stylex.props(styles.list)}>
                        {posts.map((post, index) => (
                            <div
                                key={post.slug}
                                {...stylex.props(
                                    index > 0 && styles.divided,
                                    reveal(4 + index)
                                )}
                            >
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </Main>
    );
}

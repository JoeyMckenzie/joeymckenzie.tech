import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";

import { Main } from "@/components/main";
import { PageHeader } from "@/components/page-header";
import { SectionLabel } from "@/components/section-label";
import { Prose } from "@/components/prose";

const description =
    "A living changelog of what I'm learning, tinkering with, and thinking about outside of client work.";

export const metadata: Metadata = { title: "Now", description };

const sections = [
    {
        title: "Work",
        body: (
            <>
                <p>
                    I&apos;m currently a Senior Developer at{" "}
                    <a
                        href="https://www.givebutter.com/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Givebutter
                    </a>{" "}
                    building things with PHP, Laravel, TypeScript, and React.
                    Our goal is to make the world a better place and empower the
                    changemaker in all of us.
                </p>
                <p>
                    I work on a lot of things, mainly Laravel and React. I love
                    my job and the people I get to work with. I love working
                    with PHP and TypeScript, and do a lot to build our community
                    and empower our developers to be the best they can be.
                </p>
            </>
        ),
    },
    {
        title: "Online",
        body: (
            <p>
                In my spare time, I write a lot of PHP and enjoy tinkering on
                ideas with Laravel. I&apos;ve got quite a few fun projects
                I&apos;ve worked on that usually make their way over to the
                blog. Find me on{" "}
                <a
                    href="https://github.com/joeymckenzie"
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub
                </a>
                .
            </p>
        ),
    },
    {
        title: "Offline",
        body: (
            <p>
                If I&apos;m not sitting in front of a terminal, I&apos;m chasing
                around my kid and spending time with my family. I enjoy fishing,
                grabbing a drink at my local watering hole with friends, and
                posting mid takes about software on{" "}
                <a
                    href="https://x.com/_joeyMcKenzie"
                    target="_blank"
                    rel="noreferrer"
                >
                    X
                </a>
                .
            </p>
        ),
    },
];

const styles = stylex.create({
    sections: {
        marginTop: 48,
        display: "flex",
        flexDirection: "column",
        gap: 40,
    },
    section: { display: "flex", flexDirection: "column", gap: 16 },
});

export default function Now() {
    return (
        <Main>
            <PageHeader
                heading="Now"
                intro={description}
                updated="2026-07"
                updatedLabel="updated jul 2026"
            />
            <div {...stylex.props(styles.sections)}>
                {sections.map((section) => (
                    <section
                        key={section.title}
                        {...stylex.props(styles.section)}
                    >
                        <SectionLabel>{section.title}</SectionLabel>
                        <Prose>{section.body}</Prose>
                    </section>
                ))}
            </div>
        </Main>
    );
}

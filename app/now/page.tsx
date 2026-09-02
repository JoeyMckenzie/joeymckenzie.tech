import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { Prose } from "@/components/prose";
import { Separator } from "@/components/ui/separator";

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

export default function Now() {
    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-16">
            <PageHeader
                heading="Now"
                intro={description}
                updated="2026-07"
                updatedLabel="updated jul 2026"
            />
            <div className="mt-12 flex flex-col gap-10">
                {sections.map((section, index) => (
                    <section
                        key={section.title}
                        className="flex flex-col gap-4"
                    >
                        {index > 0 && <Separator className="mb-6" />}
                        <h2 className="font-heading text-2xl font-medium">
                            {section.title}
                        </h2>
                        <Prose>{section.body}</Prose>
                    </section>
                ))}
            </div>
        </main>
    );
}

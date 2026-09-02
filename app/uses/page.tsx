import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
    title: "Uses",
    description: "The tools, software, and hardware I use for development.",
};

const sections = [
    {
        title: "Stack",
        items: [
            { name: "Laravel", description: "As the good Lord intended" },
            {
                name: "React + TypeScript",
                description:
                    "At some point it's easier to follow the zeitgeist",
            },
            { name: "Tailwind", description: "Self-explanatory" },
            {
                name: "SQLite / MySQL",
                description: "I'll get around to Postgres eventually",
            },
            { name: "AWS", description: "There's no other options" },
            {
                name: "Cloudflare",
                description: "Can't trust anyone these days",
            },
        ],
    },
    {
        title: "Software",
        items: [
            {
                name: "Comet",
                description:
                    "FOTM browser of choice (until I go back to Firefox)",
            },
            {
                name: "Linear",
                description:
                    "I'm not middle management enough to respect a Jira dashboard",
            },
            {
                name: "Notion",
                description: "Miss me with those Atlassian products",
            },
            { name: "Claude", description: "Truly innovative, I know" },
            {
                name: "Monologue",
                description:
                    "I work remote, gotta talk to someone (read: Claude)",
            },
            {
                name: "Slack",
                description: "Teams users are hostages of Microslop",
            },
        ],
    },
    {
        title: "Hardware",
        items: [
            {
                name: "MacBook Pro M4",
                description: "Because I'm not smart enough for Linux",
            },
            {
                name: "Fifine Condenser Mic",
                description: "I've been told I have a face for radio",
            },
            {
                name: "AirPods Max 2",
                description: "Sticking to the uninformed consumerist theme",
            },
            {
                name: "ZSA Moonlander",
                description: "I still hit 'x' instead of 'c' 200 times a day",
            },
        ],
    },
    {
        title: "Tools",
        items: [
            {
                name: "Ghostty",
                description:
                    "Because I don't want AI in my terminal (looking at you, Warp...)",
            },
            { name: "Neovim", description: "btw" },
            {
                name: "Nix",
                description:
                    "I'm a creature of habit, I can't function if it's not a flake",
            },
            { name: "Claude Code", description: "Like the rest of the world" },
            { name: "Herdr", description: "Most of my success is due to tmux" },
        ],
    },
];

export default function Uses() {
    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-16">
            <PageHeader
                heading="Uses"
                intro="The tools, software, and hardware I use on a daily basis."
            />
            <div className="mt-12 flex flex-col gap-10">
                {sections.map((section, index) => (
                    <section
                        key={section.title}
                        className="flex flex-col gap-5"
                    >
                        {index > 0 && <Separator className="mb-5" />}
                        <h2 className="font-heading text-2xl font-medium">
                            {section.title}
                        </h2>
                        <ul className="flex flex-col gap-4">
                            {section.items.map((item) => (
                                <li
                                    key={item.name}
                                    className="grid gap-0.5 text-sm sm:grid-cols-[11rem_1fr] sm:gap-5"
                                >
                                    <span className="text-foreground font-mono">
                                        {item.name}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {item.description}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </main>
    );
}

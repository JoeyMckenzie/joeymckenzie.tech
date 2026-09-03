import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";

import { breakpoints, colors, fonts } from "@/app/tokens.stylex";
import { Main } from "@/components/main";
import { PageHeader } from "@/components/page-header";
import { SectionLabel } from "@/components/section-label";

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

const styles = stylex.create({
    sections: {
        marginTop: 48,
        display: "flex",
        flexDirection: "column",
        gap: 40,
    },
    section: { display: "flex", flexDirection: "column", gap: 20 },
    list: { display: "flex", flexDirection: "column", gap: 16 },
    row: {
        display: "grid",
        gap: { default: 2, [breakpoints.sm]: 20 },
        gridTemplateColumns: { default: null, [breakpoints.sm]: "11rem 1fr" },
        fontSize: "0.875rem",
    },
    name: { color: colors.foreground, fontFamily: fonts.mono },
    note: { color: colors.mutedForeground },
});

export default function Uses() {
    return (
        <Main>
            <PageHeader
                heading="Uses"
                intro="The tools, software, and hardware I use on a daily basis."
            />
            <div {...stylex.props(styles.sections)}>
                {sections.map((section) => (
                    <section
                        key={section.title}
                        {...stylex.props(styles.section)}
                    >
                        <SectionLabel>{section.title}</SectionLabel>
                        <ul {...stylex.props(styles.list)}>
                            {section.items.map((item) => (
                                <li
                                    key={item.name}
                                    {...stylex.props(styles.row)}
                                >
                                    <span {...stylex.props(styles.name)}>
                                        {item.name}
                                    </span>
                                    <span {...stylex.props(styles.note)}>
                                        {item.description}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </Main>
    );
}

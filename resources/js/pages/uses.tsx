import { Head } from '@inertiajs/react';
import ScrollFade from '@/components/scroll-fade';

const sections = [
    {
        title: 'Stack',
        items: [
            { name: 'Laravel', description: 'As the good Lord intended' },
            {
                name: 'React + TypeScript',
                description:
                    "At some point it's easier to follow the zeitgeist",
            },
            { name: 'Tailwind', description: 'Self-explanatory' },
            {
                name: 'SQLite / MySQL',
                description: "I'll get around to Postgres eventually",
            },
            { name: 'AWS', description: "There's no other options" },
            {
                name: 'Cloudflare',
                description: "Can't trust anyone these days",
            },
        ],
    },
    {
        title: 'Software',
        items: [
            {
                name: 'Comet',
                description:
                    'FOTM browser of choice (until I go back to Firefox)',
            },
            {
                name: 'Linear',
                description:
                    "I'm not middle management enough to respect a Jira dashboard",
            },
            {
                name: 'Notion',
                description: 'Miss me with those Atlassian products',
            },
            { name: 'Claude', description: 'Truly innovative, I know' },
            {
                name: 'Monologue',
                description:
                    'I work remote, gotta talk to someone (read: Claude)',
            },
            {
                name: 'Slack',
                description: 'Teams users are hostages of Microslop',
            },
        ],
    },
    {
        title: 'Hardware',
        items: [
            {
                name: 'MacBook Pro M4',
                description: "Because I'm not smart enough for Linux",
            },
            {
                name: 'Fifine Condenser Mic',
                description: "I've been told I have a face for radio",
            },
            {
                name: 'AirPods Max 2',
                description: 'Sticking to the uninformed consumerist theme',
            },
            {
                name: 'ZSA Moonlander',
                description: "I still hit 'x' instead of 'c' 200 times a day",
            },
        ],
    },
    {
        title: 'Tools',
        items: [
            {
                name: 'Ghostty',
                description:
                    "Because I don't want AI in my terminal (looking at you, Warp...)",
            },
            { name: 'Neovim', description: 'btw' },
            {
                name: 'Nix',
                description:
                    "I'm a creature of habit, I can't function if it's not a flake",
            },
            { name: 'Claude Code', description: 'Like the rest of the world' },
            {
                name: 'Zellij',
                description: 'Most of my success is due to tmux',
            },
        ],
    },
];

export default function Uses() {
    return (
        <>
            <Head title="Uses">
                <meta
                    name="description"
                    content="The tools, software, and hardware I use for development."
                />
            </Head>

            <div className="mx-auto max-w-3xl px-6 py-16">
                <header>
                    <p className="font-mono text-xs tracking-wide text-subtle">
                        ~/uses
                    </p>
                    <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-prose">
                        Uses
                    </h1>
                    <div className="nocturne-sweep mt-4 w-40 rounded-full" />
                    <p className="mt-5 max-w-xl text-lg leading-8 text-subtle">
                        The tools, software, and hardware I use on a daily
                        basis.
                    </p>
                </header>

                <div className="mt-14 divide-y divide-hairline">
                    {sections.map((section, sectionIndex) => (
                        <ScrollFade
                            key={section.title}
                            className={
                                sectionIndex === 0 ? 'pb-10' : 'py-10 last:pb-0'
                            }
                        >
                            <h2 className="font-display text-2xl font-medium text-prose">
                                {section.title}
                            </h2>
                            <ul className="mt-5 space-y-4">
                                {section.items.map((item) => (
                                    <li
                                        key={item.name}
                                        className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-5"
                                    >
                                        <span className="font-mono text-sm text-prose">
                                            {item.name}
                                        </span>
                                        <span className="text-sm leading-6 text-subtle">
                                            {item.description}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </ScrollFade>
                    ))}
                </div>
            </div>
        </>
    );
}

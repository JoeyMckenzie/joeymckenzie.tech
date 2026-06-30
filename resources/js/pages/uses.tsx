import { Head } from '@inertiajs/react';
import {
    FadeInSection,
    StaggeredItem,
    StaggeredList,
} from '@/components/motion';

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
            {
                name: 'AWS',
                description: "There's no other options",
            },
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
            {
                name: 'Claude',
                description: 'Truly innovative, I know',
            },
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
            {
                name: 'Neovim',
                description: 'btw',
            },
            {
                name: 'Nix',
                description:
                    "I'm a creature of habit, I can't function if it's not a flake",
            },
            {
                name: 'Claude Code',
                description: 'Like the rest of the world',
            },
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

            <div className="space-y-2">
                <p className="font-mono text-xs tracking-wide text-muted-foreground">
                    ~/uses
                </p>
                <h1 className="text-2xl font-bold tracking-tight">Uses</h1>
                <p className="text-muted-foreground">
                    The tools, software, and hardware I use on a daily basis.
                </p>
            </div>

            {sections.map((section) => (
                <FadeInSection
                    key={section.title}
                    className="mt-8 space-y-3 pt-6"
                >
                    <h2 className="text-xl tracking-tight">{section.title}</h2>
                    <StaggeredList className="space-y-3">
                        {section.items.map((item) => (
                            <StaggeredItem key={item.name}>
                                <span className="font-medium">{item.name}</span>
                                <span className="text-muted-foreground">
                                    {' '}
                                    &mdash; {item.description}
                                </span>
                            </StaggeredItem>
                        ))}
                    </StaggeredList>
                </FadeInSection>
            ))}
        </>
    );
}

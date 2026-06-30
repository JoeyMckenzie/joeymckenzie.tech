import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAppearance } from '@/hooks/use-appearance';
import type { Appearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { cv, guestbook, home, now, uses } from '@/routes';
import { index as blogIndex } from '@/routes/blog';
import type { NowPlaying } from '@/types';

type OutputLine = {
    readonly kind: 'input' | 'output' | 'error' | 'system';
    readonly text: string;
};

type CommandContext = {
    readonly args: string[];
    readonly print: (lines: string | string[]) => void;
    readonly clear: () => void;
    readonly close: () => void;
};

type Command = {
    readonly description: string;
    readonly run: (ctx: CommandContext) => void | Promise<void>;
};

const PAGES: Record<string, { url: string; label: string }> = {
    home: { url: home().url, label: '/home' },
    now: { url: now().url, label: '/now' },
    blog: { url: blogIndex().url, label: '/blog' },
    uses: { url: uses().url, label: '/uses' },
    cv: { url: cv().url, label: '/cv' },
    guestbook: { url: guestbook().url, label: '/guestbook' },
};

const SOCIALS: Record<string, string> = {
    github: 'https://github.com/joeymckenzie',
    x: 'https://x.com/_joeyMcKenzie',
    twitter: 'https://x.com/_joeyMcKenzie',
    linkedin: 'https://linkedin.com/in/joeymckenzie',
};

function navigateTo(page: string, ctx: CommandContext): void {
    const target = PAGES[page];

    if (!target) {
        ctx.print(`cd: no such page: ${page}`);

        return;
    }

    ctx.print(`navigating to ${target.label}...`);
    ctx.close();
    router.visit(target.url);
}

function buildCommands(
    updateAppearance: (mode: Appearance) => void,
): Record<string, Command> {
    const commands: Record<string, Command> = {
        help: {
            description: 'list available commands',
            run: (ctx) => {
                const longest = Math.max(
                    ...Object.keys(commands).map((name) => name.length),
                );

                ctx.print([
                    'available commands:',
                    '',
                    ...Object.entries(commands).map(
                        ([name, command]) =>
                            `  ${name.padEnd(longest + 2)}${command.description}`,
                    ),
                    '',
                    'tip: page names (home, blog, now, uses, cv, guestbook) work too.',
                ]);
            },
        },
        ls: {
            description: 'list the pages on this site',
            run: (ctx) => {
                ctx.print(
                    Object.values(PAGES)
                        .map((page) => page.label)
                        .join('   '),
                );
            },
        },
        cd: {
            description: 'navigate to a page (e.g. cd blog)',
            run: (ctx) => {
                const page = ctx.args[0]?.replace(/^\//, '');

                if (!page) {
                    ctx.print('usage: cd <page>');

                    return;
                }

                navigateTo(page, ctx);
            },
        },
        whoami: {
            description: 'a little about me',
            run: (ctx) => {
                ctx.print([
                    'Joey McKenzie',
                    'Developer. Dad. PHP enjoyer.',
                    'Building things with Laravel and giving unsolicited advice on tech.',
                ]);
            },
        },
        socials: {
            description: 'list my links (socials <github|x|linkedin> to open)',
            run: (ctx) => {
                const target = ctx.args[0]?.toLowerCase();

                if (target) {
                    const url = SOCIALS[target];

                    if (!url) {
                        ctx.print(`socials: unknown profile: ${target}`);

                        return;
                    }

                    ctx.print(`opening ${url}...`);
                    window.open(url, '_blank', 'noopener,noreferrer');

                    return;
                }

                ctx.print([
                    'github     https://github.com/joeymckenzie',
                    'x          https://x.com/_joeyMcKenzie',
                    'linkedin   https://linkedin.com/in/joeymckenzie',
                ]);
            },
        },
        theme: {
            description: 'switch theme (theme <dark|light|system>)',
            run: (ctx) => {
                const mode = ctx.args[0]?.toLowerCase();

                if (mode !== 'dark' && mode !== 'light' && mode !== 'system') {
                    ctx.print('usage: theme <dark|light|system>');

                    return;
                }

                updateAppearance(mode);
                ctx.print(`theme set to ${mode}.`);
            },
        },
        spotify: {
            description: "what I'm listening to right now",
            run: async (ctx) => {
                ctx.print('checking spotify...');

                try {
                    const response = await fetch('/api/spotify/now-playing');
                    const data: { nowPlaying: NowPlaying | null } =
                        await response.json();

                    if (!data.nowPlaying) {
                        ctx.print('not listening to anything right now.');

                        return;
                    }

                    ctx.print(
                        `♪ ${data.nowPlaying.title} — ${data.nowPlaying.artist}`,
                    );
                } catch {
                    ctx.print('spotify: could not reach the turntable.');
                }
            },
        },
        echo: {
            description: 'print some text',
            run: (ctx) => {
                ctx.print(ctx.args.join(' '));
            },
        },
        date: {
            description: 'show the current date and time',
            run: (ctx) => {
                ctx.print(new Date().toString());
            },
        },
        sudo: {
            description: 'nice try',
            run: (ctx) => {
                ctx.print("whoa there bud... i don't think so.");
            },
        },
        clear: {
            description: 'clear the screen',
            run: (ctx) => {
                ctx.clear();
            },
        },
        exit: {
            description: 'close the terminal',
            run: (ctx) => {
                ctx.close();
            },
        },
    };

    return commands;
}

export function CommandTerminal() {
    const { updateAppearance } = useAppearance();
    const [open, setOpen] = useState(false);
    const [lines, setLines] = useState<OutputLine[]>([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const commandsRef = useRef<Record<string, Command>>(
        buildCommands(updateAppearance),
    );

    commandsRef.current = buildCommands(updateAppearance);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                setOpen((previous) => !previous);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (open) {
            setLines([]);
            window.requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    const print = (incoming: string | string[]): void => {
        const next = (Array.isArray(incoming) ? incoming : [incoming]).map(
            (text) => ({ kind: 'output', text }) as const,
        );

        setLines((previous) => [...previous, ...next]);
    };

    const runCommand = async (raw: string): Promise<void> => {
        const trimmed = raw.trim();

        setLines((previous) => [...previous, { kind: 'input', text: trimmed }]);

        if (trimmed === '') {
            return;
        }

        setHistory((previous) => [...previous, trimmed]);
        setHistoryIndex(null);

        const [name, ...args] = trimmed.split(/\s+/);
        const lowered = name.toLowerCase();
        const commands = commandsRef.current;

        const ctx: CommandContext = {
            args,
            print,
            clear: () => setLines([]),
            close: () => setOpen(false),
        };

        if (commands[lowered]) {
            await commands[lowered].run(ctx);

            return;
        }

        if (PAGES[lowered]) {
            navigateTo(lowered, ctx);

            return;
        }

        setLines((previous) => [
            ...previous,
            {
                kind: 'error',
                text: `command not found: ${name}. type 'help' for options.`,
            },
        ]);
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ): void => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const value = input;
            setInput('');
            void runCommand(value);

            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();

            if (history.length === 0) {
                return;
            }

            const nextIndex =
                historyIndex === null
                    ? history.length - 1
                    : Math.max(0, historyIndex - 1);

            setHistoryIndex(nextIndex);
            setInput(history[nextIndex]);

            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();

            if (historyIndex === null) {
                return;
            }

            const nextIndex = historyIndex + 1;

            if (nextIndex >= history.length) {
                setHistoryIndex(null);
                setInput('');

                return;
            }

            setHistoryIndex(nextIndex);
            setInput(history[nextIndex]);

            return;
        }

        if (event.key === 'Tab') {
            event.preventDefault();
            const partial = input.trim().toLowerCase();

            if (partial === '') {
                return;
            }

            const candidates = [
                ...Object.keys(commandsRef.current),
                ...Object.keys(PAGES),
            ].filter((name) => name.startsWith(partial));

            if (candidates.length === 1) {
                setInput(candidates[0]);
            } else if (candidates.length > 1) {
                print(candidates.join('   '));
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="top-[20%] translate-y-0 gap-0 overflow-hidden border-border bg-background/95 p-0 font-mono shadow-2xl backdrop-blur-sm sm:max-w-2xl [&>button]:hidden"
                onOpenAutoFocus={(event) => {
                    event.preventDefault();
                    inputRef.current?.focus();
                }}
            >
                <DialogTitle className="sr-only">Command terminal</DialogTitle>
                <DialogDescription className="sr-only">
                    A terminal for navigating joeymckenzie.tech with keyboard
                    commands.
                </DialogDescription>
                <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
                    <span className="size-3 rounded-full bg-red-500/80" />
                    <span className="size-3 rounded-full bg-yellow-500/80" />
                    <span className="size-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs text-muted-foreground">
                        guest@joeymckenzie.tech
                    </span>
                </div>
                <div
                    ref={scrollRef}
                    className="h-80 space-y-1 overflow-y-auto px-4 py-3 text-sm"
                    onClick={() => inputRef.current?.focus()}
                >
                    {lines.map((line, index) => (
                        <Line key={index} line={line} />
                    ))}
                    <div className="flex items-center gap-2">
                        <Prompt />
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={handleKeyDown}
                            spellCheck={false}
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                            aria-label="Terminal input"
                            className="flex-1 bg-transparent text-foreground caret-emerald-500 outline-none"
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Prompt() {
    return (
        <span className="shrink-0 text-emerald-500 select-none">
            suh@dude<span className="text-muted-foreground">:</span>
            <span className="text-sky-500">~</span>
            <span className="text-muted-foreground">$</span>
        </span>
    );
}

function Line({ line }: { line: OutputLine }) {
    if (line.kind === 'input') {
        return (
            <div className="flex items-center gap-2">
                <Prompt />
                <span className="text-foreground">{line.text}</span>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'break-words whitespace-pre-wrap',
                line.kind === 'error' && 'text-red-500',
                line.kind === 'system' && 'text-muted-foreground',
                line.kind === 'output' && 'text-foreground/90',
            )}
        >
            {line.text}
        </div>
    );
}

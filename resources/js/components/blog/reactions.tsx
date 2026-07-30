import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
    index as reactionsIndex,
    store as reactionsStore,
} from '@/routes/blog/reactions';

const REACTIONS = [
    { key: 'fire', emoji: '🔥', label: 'Fire' },
    { key: 'thumbs_up', emoji: '👍', label: 'Thumbs up' },
    { key: 'mind_blown', emoji: '🤯', label: 'Mind blown' },
    { key: 'heart', emoji: '❤️', label: 'Heart' },
] as const;

type ReactionKey = (typeof REACTIONS)[number]['key'];

interface Snapshot {
    counts: Record<string, number>;
    userReactions: string[];
}

/** Laravel sets the XSRF-TOKEN cookie; echo it back so the POST clears CSRF. */
function xsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : '';
}

/**
 * Anonymous emoji reactions (JOEY-4.3), wired to the JOEY-9 API. Loads the
 * per-type counts + this visitor's reactions on mount, and toggles optimistically
 * — reconciling from the server response (or reverting on failure).
 */
export default function Reactions({ postSlug }: { postSlug: string }) {
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [mine, setMine] = useState<string[]>([]);
    const [pending, setPending] = useState<ReactionKey | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        fetch(reactionsIndex.url({ post: postSlug }), {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
            signal: controller.signal,
        })
            .then((response) => response.json() as Promise<Snapshot>)
            .then((data) => {
                setCounts(data.counts);
                setMine(data.userReactions);
            })
            .catch(() => {
                // Ignore load/abort errors; the widget just stays at zero.
            });

        return () => controller.abort();
    }, [postSlug]);

    async function toggle(key: ReactionKey): Promise<void> {
        if (pending !== null) {
            return;
        }

        const wasActive = mine.includes(key);

        // Optimistic: flip immediately, reconcile with the server below.
        setMine((current) =>
            wasActive ? current.filter((k) => k !== key) : [...current, key],
        );
        setCounts((current) => ({
            ...current,
            [key]: (current[key] ?? 0) + (wasActive ? -1 : 1),
        }));
        setPending(key);

        try {
            const response = await fetch(
                reactionsStore.url({ post: postSlug }),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-XSRF-TOKEN': xsrfToken(),
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({ reaction: key }),
                },
            );

            if (response.ok) {
                const data = (await response.json()) as Snapshot;
                setCounts(data.counts);
                setMine(data.userReactions);
            } else {
                // Revert the optimistic change (e.g. rate-limited).
                setMine((current) =>
                    wasActive
                        ? [...current, key]
                        : current.filter((k) => k !== key),
                );
                setCounts((current) => ({
                    ...current,
                    [key]: (current[key] ?? 0) + (wasActive ? 1 : -1),
                }));
            }
        } catch {
            setMine((current) =>
                wasActive
                    ? [...current, key]
                    : current.filter((k) => k !== key),
            );
            setCounts((current) => ({
                ...current,
                [key]: (current[key] ?? 0) + (wasActive ? 1 : -1),
            }));
        } finally {
            setPending(null);
        }
    }

    return (
        <div className="mt-16 border-t border-hairline pt-8">
            <p className="font-mono text-xs tracking-widest text-subtle uppercase">
                react
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
                {REACTIONS.map((reaction) => {
                    const active = mine.includes(reaction.key);

                    return (
                        <button
                            key={reaction.key}
                            type="button"
                            onClick={() => void toggle(reaction.key)}
                            aria-pressed={active}
                            aria-label={reaction.label}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-colors',
                                active
                                    ? 'border-iris bg-iris/15 text-prose'
                                    : 'border-hairline text-subtle hover:border-iris/50 hover:text-prose',
                            )}
                        >
                            <span
                                aria-hidden
                                className="text-base leading-none"
                            >
                                {reaction.emoji}
                            </span>
                            <span className="font-mono text-xs tabular-nums">
                                {counts[reaction.key] ?? 0}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

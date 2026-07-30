import { useEffect, useState } from 'react';
import { nowPlaying } from '@/routes';

interface NowPlaying {
    title: string;
    artist: string;
    albumImage: string | null;
    href: string | null;
}

type NowPlayingResponse = { nowPlaying: NowPlaying | null };

/**
 * Spotify now-playing — footer statusline slot (JOEY-13.5).
 *
 * Polls `/now-playing` ~30s. When a track is playing, renders `▶ track —
 * artist` with an iris accent; otherwise rests on "not listening". All errors
 * degrade silently to the resting state so the footer never looks broken.
 */
export default function SpotifyNowPlaying() {
    const [playing, setPlaying] = useState<NowPlaying | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const poll = () =>
            fetch(nowPlaying.url(), {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
                signal: controller.signal,
            })
                .then(
                    (response) =>
                        response.json() as Promise<NowPlayingResponse>,
                )
                .then((data) => setPlaying(data.nowPlaying))
                .catch(() => {
                    // Ignore network/abort errors; widget stays in its last state.
                });

        poll();
        const interval = setInterval(poll, 30_000);

        return () => {
            controller.abort();
            clearInterval(interval);
        };
    }, []);

    if (playing === null) {
        return (
            <span className="inline-flex items-center gap-2 font-mono text-xs text-subtle">
                <span aria-hidden>♪</span>
                <span>not listening</span>
            </span>
        );
    }

    const label = `${playing.title} — ${playing.artist}`;

    return (
        <a
            href={playing.href ?? '#'}
            target={playing.href ? '_blank' : undefined}
            rel="noreferrer"
            className="inline-flex max-w-[12rem] items-center gap-2 overflow-hidden font-mono text-xs sm:max-w-[16rem]"
        >
            <span aria-hidden className="shrink-0 text-iris">
                ▶
            </span>
            <span className="truncate text-iris hover:underline" title={label}>
                {label}
            </span>
        </a>
    );
}

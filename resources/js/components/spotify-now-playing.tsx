import { useNowPlaying } from '@/hooks/use-now-playing';

/**
 * Spotify now-playing — footer statusline slot (JOEY-13.5).
 *
 * When a track is playing, renders `▶ track — artist` with an iris accent;
 * otherwise rests on "not listening". Polling and error handling live in
 * `useNowPlaying`, which only ever hands back a track or `null`.
 */
export function SpotifyNowPlaying() {
    const playing = useNowPlaying();

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

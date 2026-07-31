import { useEffect, useState } from 'react';
import { nowPlaying } from '@/routes';

export interface NowPlaying {
    title: string;
    artist: string;
    albumImage: string | null;
    href: string | null;
}

type NowPlayingResponse = { nowPlaying: NowPlaying | null };

const POLL_INTERVAL_MS = 30_000;

/**
 * Polls `/now-playing` every 30s and returns the current track, or `null` when
 * nothing is playing. Any failure — non-2xx, network, abort — resolves to
 * `null` so consumers only ever render a track or their resting state.
 */
export const useNowPlaying = (): NowPlaying | null => {
    const [playing, setPlaying] = useState<NowPlaying | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const poll = () =>
            fetch(nowPlaying.url(), {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
                signal: controller.signal,
            })
                .then((response) =>
                    response.ok
                        ? (response.json() as Promise<NowPlayingResponse>)
                        : null,
                )
                .then((data) => setPlaying(data?.nowPlaying ?? null))
                .catch(() => {
                    console.log('Error while attempting to get Spotify status');
                });

        poll();
        const interval = setInterval(poll, POLL_INTERVAL_MS);

        return () => {
            controller.abort();
            clearInterval(interval);
        };
    }, []);

    return playing;
};

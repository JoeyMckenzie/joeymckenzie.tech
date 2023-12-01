import * as React from 'react';
import { type NowPlaying } from '@/types';
import { usePage } from '@inertiajs/react';

function NotCurrentlyPlaying({
    children,
}: {
    children: React.JSX.Element;
}): React.JSX.Element {
    return (
        <div className="flex flex-col space-y-1">
            <div className="flex flex-row items-center justify-center space-x-2">
                <slot />
                <div className="flex flex-col">
                    <h4 className="text-xs text-neutral-500">
                        Not currently listening
                    </h4>
                </div>
            </div>
        </div>
    );
}

function CurrentlyPlaying({
    nowPlaying,
    children,
}: {
    children: React.JSX.Element;
    nowPlaying: NowPlaying;
}): React.JSX.Element {
    return (
        <a
            href={nowPlaying.href}
            className="flex flex-col space-y-1"
            rel="noreferrer"
            target="_blank"
        >
            <h2 className="font-ubuntu inline-flex justify-center text-xs">
                Now listening
            </h2>
            <div className="flex flex-row items-center justify-center space-x-2">
                {children}
                <img
                    src={nowPlaying.albumImageSrc}
                    alt="Spotify listening to"
                    className="rounded-sm"
                    height="30"
                    width="30"
                />
                <div className="flex max-w-[16rem] flex-col">
                    <h4 className="line-clamp-1 overflow-hidden text-ellipsis text-xs font-semibold">
                        {nowPlaying.trackTitle}
                    </h4>
                    <p className="text-xs">{nowPlaying.artist}</p>
                </div>
            </div>
        </a>
    );
}

export default function SpotifyTracker({
    children,
}: {
    children: React.JSX.Element;
}): React.JSX.Element {
    const page = usePage();
    const nowPlaying = page.props.spotify as NowPlaying | undefined;
    const currentlyPlaying = nowPlaying?.nowPlaying ?? false;

    return (
        <>
            {currentlyPlaying && nowPlaying !== undefined && (
                <CurrentlyPlaying nowPlaying={nowPlaying}>
                    {children}
                </CurrentlyPlaying>
            )}
            {!currentlyPlaying && (
                <NotCurrentlyPlaying>{children}</NotCurrentlyPlaying>
            )}
        </>
    );
}

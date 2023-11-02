import { getSpotifyNowPlaying } from '@/lib/spotify';
import Image from 'next/image';
import { Suspense } from 'react';

function NotPlaying({
  text = 'Not currently listening',
  children,
}: {
  text?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-row items-center justify-center space-x-2">
        {children}
        <div className="flex flex-col">
          <h4 className="text-xs text-neutral-500">{text}</h4>
        </div>
      </div>
    </div>
  );
}

async function CurrentlyPlaying({ children }: { children: React.ReactNode }) {
  const response = await getSpotifyNowPlaying();

  return response.nowPlaying ? (
    <a
      href={response.href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col space-y-1"
    >
      <h2 className="font-ubuntu inline-flex justify-center text-xs">
        Now listening
      </h2>
      <div className="flex flex-row items-center justify-center space-x-2">
        {children}
        <Image
          src={response.albumImageSrc!}
          width="30"
          height="30"
          alt="Spotify listenting to"
          className="rounded-sm"
        />
        <div className="flex max-w-[16rem] flex-col">
          <h4 className="line-clamp-1 overflow-hidden text-ellipsis text-xs font-semibold">
            {response.trackTitle}
          </h4>
          <p className="text-xs">{response.artist}</p>
        </div>
      </div>
    </a>
  ) : (
    <NotPlaying>{children}</NotPlaying>
  );
}

export function NowPlaying({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<NotPlaying text="Loading...">{children}</NotPlaying>}>
      <CurrentlyPlaying>{children}</CurrentlyPlaying>
    </Suspense>
  );
}

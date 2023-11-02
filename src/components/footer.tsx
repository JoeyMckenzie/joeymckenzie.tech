import { NowPlayingResponse } from '@/lib/spotify';
import { BsSpotify } from 'react-icons/bs';
import { PoweredBy } from './powered-by';
import { SocialIcons } from './socials-icons';
import { NowPlaying } from './spotify';

export function Footer({ nowPlaying }: { nowPlaying: NowPlayingResponse }) {
  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-evenly gap-y-8 p-8 sm:flex-row sm:items-end">
      <PoweredBy />
      <NowPlaying nowPlaying={nowPlaying}>
        <BsSpotify className="h-6 w-6 text-green-500" />
      </NowPlaying>
      <SocialIcons />
    </div>
  );
}

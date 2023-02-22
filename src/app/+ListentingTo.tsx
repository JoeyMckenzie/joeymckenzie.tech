import { ListentingToMeta } from '@/lib/spotify';
import { SiSpotify } from 'react-icons/si';
import Image from 'next/image';

function ListeningToArtist({ listeningTo }: { listeningTo: ListentingToMeta }) {
  const { albumImage, artist, href, trackTitle } = listeningTo;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col space-y-1 pt-6 md:pt-0"
    >
      <h2 className="inline-flex justify-center font-ubuntu text-xs text-neutral-400 md:justify-start">
        Now listening
      </h2>
      <div className="flex flex-row items-center justify-center space-x-2">
        <SiSpotify className="h-6 w-6 text-green-500" />
        <Image
          src={albumImage.url}
          width="30"
          height="30"
          alt="Spotify listenting to"
          className="rounded-sm"
        />
        <div className="flex flex-col">
          <h4 className="text-sm font-semibold text-neutral-300">
            {trackTitle}
          </h4>
          <p className="text-xs text-neutral-400">{artist}</p>
        </div>
      </div>
    </a>
  );
}

function NotCurrentlyListening() {
  return (
    <div className="flex flex-col space-y-1 pt-6 md:pt-0">
      <div className="flex flex-row items-center justify-center space-x-2">
        <SiSpotify className="h-6 w-6 text-green-500" />
        <div className="flex flex-col">
          <h4 className="text-xs text-neutral-500">Not currently listening</h4>
        </div>
      </div>
    </div>
  );
}

export default function SpotifyNowListeningTo({
  listeningTo,
}: {
  listeningTo?: ListentingToMeta;
}) {
  return listeningTo ? (
    <ListeningToArtist listeningTo={listeningTo} />
  ) : (
    <NotCurrentlyListening />
  );
}

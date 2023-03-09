import { getCurrentlyListeningTo } from '@/lib/spotify';
import { Component, createResource, ParentProps, Show } from 'solid-js';

type CurrentListeningToProps = {
  href: string;
  albumImageSrc: string;
  trackTitle: string;
  artist: string;
};

const NotCurrentlyListening: Component<ParentProps> = (props) => (
  <div class="flex flex-col space-y-1 pt-6 md:pt-0">
    <div class="flex flex-row items-center justify-center space-x-2">
      {props.children}
      <div class="flex flex-col">
        <h4 class="text-xs text-neutral-500">Not currently listening</h4>
      </div>
    </div>
  </div>
);

const CurrentListeningTo: Component<ParentProps<CurrentListeningToProps>> = (
  props
) => {
  const { href, albumImageSrc, trackTitle, artist, children } = props;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      class="flex flex-col space-y-1 pt-6 md:pt-0"
    >
      <h2 class="inline-flex justify-center font-ubuntu text-xs text-neutral-400 md:justify-start">
        Now listening
      </h2>
      <div class="flex flex-row items-center justify-center space-x-2">
        {props.children}
        <img
          src={albumImageSrc}
          width="30"
          height="30"
          alt="Spotify listenting to"
          class="rounded-sm"
        />
        <div class="flex flex-col">
          <h4 class="text-sm font-semibold text-neutral-300">{trackTitle}</h4>
          <p class="text-xs text-neutral-400">{artist}</p>
        </div>
      </div>
    </a>
  );
};

const ListeningTo: Component<
  ParentProps<{ hash: string; refreshToken: string }>
> = (props) => {
  const [data] = createResource(() =>
    getCurrentlyListeningTo(props.hash, props.refreshToken)
  );

  return (
    <>
      {/* Currently listening to */}
      <Show when={!!data()}>
        <CurrentListeningTo
          href={data()!.href}
          albumImageSrc={data()!.albumImage.url}
          artist={data()!.artist}
          trackTitle={data()!.trackTitle}
        >
          {props.children}
        </CurrentListeningTo>
      </Show>

      {/* Not listening */}
      <Show when={!data()}>
        <NotCurrentlyListening>{props.children}</NotCurrentlyListening>
      </Show>
    </>
  );
};

export default ListeningTo;

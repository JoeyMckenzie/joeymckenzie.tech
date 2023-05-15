/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, ParentProps, Show, createResource } from 'solid-js';
import SpotifyNowCurrentlyPlaying from './SpotifyCurrentlyNowPlaying';
import SpotifyNotCurrentlyListening from './SpotifyNotCurrentlyListening';

export type NowPlayingResponse = {
  href: string;
  albumImageSrc: string;
  trackTitle: string;
  artist: string;
  nowPlaying: boolean;
};

type SpotifyNowPlayingProps = {
  nowPlayingUrl: string;
};

async function getNowPlaying(
  nowPlayingUrl: string
): Promise<NowPlayingResponse> {
  const response = await fetch(nowPlayingUrl);
  return response.json();
}

const SpotifyNowPlaying: Component<ParentProps<SpotifyNowPlayingProps>> = (
  props
) => {
  // Note: the now playing URL comes as an env var from astro and will never change,
  // so we can relax solid's warning here for reactivity
  // eslint-disable-next-line solid/reactivity
  const [data] = createResource(props.nowPlayingUrl, getNowPlaying);

  return (
    <>
      {/* While loading, show the fallback */}
      <Show when={data.loading}>
        <SpotifyNotCurrentlyListening text="Loading...">
          {props.children}
        </SpotifyNotCurrentlyListening>
      </Show>

      {/* Once we have spotify data, show the now playing widget if available */}
      <Show when={!!data()}>
        <Show when={data()!.nowPlaying}>
          <SpotifyNowCurrentlyPlaying response={data()!} />
        </Show>
        <Show when={!data()!.nowPlaying}>
          <SpotifyNotCurrentlyListening>
            {props.children}
          </SpotifyNotCurrentlyListening>
        </Show>
      </Show>

      {/* On any error, show the fallback */}
      <Show when={data.error}>
        <SpotifyNotCurrentlyListening>
          {props.children}
        </SpotifyNotCurrentlyListening>
      </Show>
    </>
  );
};

export default SpotifyNowPlaying;

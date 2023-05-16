import type { Component, ParentProps } from 'solid-js';
import type { NowPlayingResponse } from './SpotifyNowPlaying';

type CurrentlyPlayingProps = {
  response: NowPlayingResponse;
};

const SpotifyNowCurrentlyPlaying: Component<
  ParentProps<CurrentlyPlayingProps>
> = (props) => (
  <a
    href={props.response.href}
    target="_blank"
    rel="noreferrer"
    class="flex flex-col"
  >
    <h2 class="inline-flex justify-center font-ubuntu text-xs text-neutral-400 md:justify-start">
      Now listening
    </h2>
    <div class="flex flex-row items-center justify-center gap-x-2">
      {props.children}
      <img
        src={props.response.albumImageSrc}
        width="30"
        height="30"
        alt="Spotify listenting to"
        class="rounded-sm"
      />
      <div class="flex flex-col">
        <h4 class="text-xs font-semibold text-neutral-300">
          {props.response.trackTitle}
        </h4>
        <p class="text-xs text-neutral-400">{props.response.artist}</p>
      </div>
    </div>
  </a>
);

export default SpotifyNowCurrentlyPlaying;

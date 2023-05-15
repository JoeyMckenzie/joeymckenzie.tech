import type { Component, ParentProps } from 'solid-js';

type NotCurrentlyListeningProps = {
  text?: string;
};

const SpotifyNotCurrentlyListening: Component<
  ParentProps<NotCurrentlyListeningProps>
> = (props) => (
  <div class="flex flex-col space-y-1 pt-6 md:pt-0">
    <div class="flex flex-row items-center justify-center space-x-2">
      {props.children}
      <div class="flex flex-col">
        <h4 class="text-xs text-neutral-500">
          {props.text ?? 'Not currently listening'}
        </h4>
      </div>
    </div>
  </div>
);

export default SpotifyNotCurrentlyListening;

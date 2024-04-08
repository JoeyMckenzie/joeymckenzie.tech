use leptos::*;

use crate::spotify::SpotifyTracking;

#[component]
pub fn SpotifyNowPlaying(
    now_playing: ReadSignal<SpotifyTracking>,
    children: Children,
) -> impl IntoView {
    view! {
        <a
            href=now_playing.get().href
            class="flex flex-col space-y-1"
            rel="noreferrer"
            target="_blank"
        >
            <h2 class="font-ubuntu inline-flex justify-center text-xs">"Now listening"</h2>
            <div class="flex flex-row items-center justify-center space-x-2">
                {children()}
                <img
                    src=now_playing.get().album_image_src
                    alt="Spotify listening to"
                    class="rounded-sm"
                    height="30"
                    width="30"
                />
                <div class="flex max-w-[16rem] flex-col">
                    {now_playing.get().track_title}
                    <h4 class="line-clamp-1 overflow-hidden text-ellipsis text-xs font-semibold"></h4>
                    <p class="text-xs">{now_playing.get().artist}</p>
                </div>
            </div>
        </a>
    }
}

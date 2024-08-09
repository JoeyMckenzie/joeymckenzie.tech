use leptos::*;

use crate::spotify::NowPlaying;

#[component]
pub fn SpotifyNowPlaying(now_playing: NowPlaying) -> impl IntoView {
    view! {
        <a href=now_playing.href class="flex flex-col space-y-1" rel="noreferrer" target="_blank">
            <h2 class="inline-flex justify-center text-sm font-ubuntu">"Now listening"</h2>
            <div class="flex flex-row items-center justify-center space-x-2">
                <span class="w-6 h-6 icon-[logos--spotify-icon]"></span>
                <img
                    src=now_playing.album_image_src
                    alt="Spotify listening to"
                    class="rounded-sm"
                    height="30"
                    width="30"
                />
                <div class="flex max-w-[16rem] flex-col">
                    <h4 class="overflow-hidden text-xs font-semibold line-clamp-1 text-ellipsis">
                        {now_playing.track_title}
                    </h4>
                    <p class="overflow-hidden text-xs line-clamp-1 text-ellipsis">
                        {now_playing.artist}
                    </p>
                </div>
            </div>
        </a>
    }
}

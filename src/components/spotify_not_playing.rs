use leptos::*;

#[component]
pub fn SpotifyNotPlaying() -> impl IntoView {
    view! {
        <div class="flex flex-col space-y-1">
            <div class="flex flex-row items-center justify-center space-x-2">
                <span class="w-6 h-6 icon-[logos--spotify-icon]"></span>
                <div class="flex flex-col">
                    <h4 class="text-xs text-neutral-500">"Not currently listening"</h4>
                </div>
            </div>
        </div>
    }
}

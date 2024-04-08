use leptos::*;

#[component]
pub fn SpotifyNotPlaying(children: Children) -> impl IntoView {
    view! {
        <div class="flex flex-col space-y-1">
            <div class="flex flex-row items-center justify-center space-x-2">
                {children()} <div class="flex flex-col">
                    <h4 class="text-xs text-neutral-500">"Not currently listening"</h4>
                </div>
            </div>
        </div>
    }
}

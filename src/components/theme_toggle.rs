use leptos::*;

#[component]
pub fn ThemeToggle() -> impl IntoView {
    let (theme, set_theme) = create_signal("forest");

    view! {
        <label class="swap swap-rotate">
            // <!-- this hidden checkbox controls the state -->
            <input
                type="checkbox"
                class="theme-controller"
                value=theme.get()
                on:click=move |_| {
                    if theme.get() == "forest" {
                        set_theme("light");
                    } else {
                        set_theme("forest");
                    }
                }
            />

            // <!-- sun icon -->
            <Show
                when=move || { theme.get() == "forest" }
                fallback=|| view! { <span class="w-6 h-6 icon-[solar--moon-broken]"></span> }
            >
                <span class="w-6 h-6 icon-[solar--sun-broken]"></span>
            </Show>
        </label>
    }
}

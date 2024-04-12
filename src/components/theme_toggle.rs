use gloo_storage::Storage;
use leptos::*;

const THEMES: [&str; 32] = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
];

#[component]
pub fn ThemeToggle() -> impl IntoView {
    let (theme, set_theme) = create_signal("light");
    let html_element: NodeRef<html::Html> = create_node_ref();

    create_effect(move |_| {
        let storage = gloo_storage::LocalStorage::raw();
        logging::log!("{storage:?}");
    });

    create_effect(move |_| {
        logging::log!("{:?}", html_element.get().unwrap().get_attribute_names());
    });

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

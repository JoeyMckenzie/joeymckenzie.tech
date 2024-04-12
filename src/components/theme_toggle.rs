use gloo_storage::Storage;
use leptos::*;

#[component]
pub fn ThemeToggle() -> impl IntoView {
    let (theme, set_theme) = create_signal("light");
    let html_element: NodeRef<html::Html> = create_node_ref();
    let themes = create_rw_signal(vec![
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
    ]);

    create_effect(move |_| {
        let storage = gloo_storage::LocalStorage::raw();
        logging::log!("{storage:?}");
    });

    // create_effect(move |_| {
    //     logging::log!("{:?}", html_element.get().unwrap().get_attribute_names());
    // });

    view! {
        <select class="select w-full max-w-xs">
            <For each=themes key=|theme| theme.to_string() let:theme>
                <option>{theme}</option>
            </For>
        </select>
    }
}

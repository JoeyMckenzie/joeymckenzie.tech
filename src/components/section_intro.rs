use leptos::*;

#[component]
pub fn SectionIntro(title: String, children: Children) -> impl IntoView {
    view! {
        <div class="mx-auto max-w-2xl">
            <h2 class="text-center text-4xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
            <p class="mx-auto mt-6 max-w-xl text-justify">{children()}</p>
        </div>
    }
}

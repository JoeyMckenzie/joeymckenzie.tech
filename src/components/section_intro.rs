use leptos::*;

#[component]
pub fn SectionIntro(title: String, children: Children) -> impl IntoView {
    view! {
        <div class="max-w-2xl mx-auto">
            <h2 class="text-4xl font-extrabold tracking-tight text-center sm:text-4xl">{title}</h2>
            <p class="max-w-xl mx-auto mt-6 text-justify">{children()}</p>
        </div>
    }
}

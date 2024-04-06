use leptos::*;

#[component]
pub fn SocialButtons() -> impl IntoView {
    view! {
        <div class="flex flex-row mx-auto justify-center">
            <button class="btn">
                <span class="icon-[mdi--github]"></span>
                "GitHub"
            </button>
        </div>
    }
}

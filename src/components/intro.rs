use leptos::*;

use crate::components::section_intro::SectionIntro;

#[component]
pub fn Intro() -> impl IntoView {
    view! {
        <div class="py-12 sm:px-6 lg:px-8">
            <SectionIntro title=String::from(
                "Hi, I'm Joey.",
            )>
                "I'm a software developer based in Northern California working in fintech. I enjoy writing about software,
                design, dad jokes, and cheap beer among a few other things. I like building fast, efficient web services,
                learning new things, and writing code in the open source ecosystem."
            </SectionIntro>
        </div>
    }
}

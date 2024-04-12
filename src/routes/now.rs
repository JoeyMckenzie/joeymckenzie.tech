use leptos::*;
use leptos_meta::*;

use crate::components::section_intro::SectionIntro;

#[component]
pub fn NowPage() -> impl IntoView {
    view! {
        <Title text="Now. | joeymckenzie.tech"/>

        <div class="py-12 sm:px-6 lg:px-8">
            <SectionIntro title=String::from(
                "Now.",
            )>
                "I write about a lot of things, mainly languages, ecosystems,
                and software design. I consider my writing a journal of
                technologies I've worked with at some point during my
                career, and I'm always happy to field questions and
                conversations from interested readers. Feel free to"
                <a href="mailto:joey.mckenzie.dev@gmail.com">"contact me"</a>
                "about any of the writing I do here, or to simply say hello!"
            </SectionIntro>
        </div>
    }
}

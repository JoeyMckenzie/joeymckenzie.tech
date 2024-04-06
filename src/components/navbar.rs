use leptos::*;
use leptos_router::*;

#[derive(Debug, Clone)]
struct NavbarLink {
    display: String,
    href: String,
}

#[component]
pub fn Navbar() -> impl IntoView {
    let links = create_rw_signal(vec![
        NavbarLink {
            display: String::from("Home"),
            href: String::from("/"),
        },
        NavbarLink {
            display: String::from("Now"),
            href: String::from("/now"),
        },
        NavbarLink {
            display: String::from("Blog"),
            href: String::from("/blog"),
        },
    ]);

    view! {
        <div class="flex flex-row gap-x-4 mx-auto justify-center pt-8">
            <For
                each=links
                key=|link| link.display.clone()
                let:child
            >
                <A href=child.href class="hover:underline">
                    {child.display}
                </A>
            </For>
        </div>
    }
}

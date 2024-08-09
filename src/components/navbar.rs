use leptos::*;
use leptos_router::*;

use crate::components::{theme_toggle::ThemeToggle, DisplayableIcon};

#[component]
pub fn Navbar() -> impl IntoView {
    let links = create_rw_signal(vec![
        DisplayableIcon {
            display: "Home",
            href: "/",
            icon: None,
        },
        DisplayableIcon {
            display: "Now",
            href: "/now",
            icon: None,
        },
        DisplayableIcon {
            display: "Blog",
            href: "/blog",
            icon: None,
        },
    ]);

    view! {
        <div class="flex flex-row items-center justify-between py-4 mx-auto">
            <div class="text-sm breadcrumbs">
                <ul>
                    <For each=links key=|link| link.display let:link>
                        <li>
                            <A class="nav-link" href=link.href>
                                {link.display}
                            </A>
                        </li>
                    </For>
                </ul>
            </div>
            <ThemeToggle />
        </div>
    }
}

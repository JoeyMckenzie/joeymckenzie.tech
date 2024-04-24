use leptos::*;

#[derive(Debug, Clone, PartialEq, Eq)]
struct Note {
    title: String,
    description: String,
}

#[component]
pub fn NoteToSelf() -> impl IntoView {
    let notes = create_rw_signal(vec![
        Note {
            title: "Salesforce".to_string(),
            description: "Empowering atrocity driven development since 1999.".to_string(),
        },
        Note {
            title: "Microliths".to_string(),
            description: "\"Put it in service x/y/z, we'll refactor it later.\"".to_string(),
        },
        Note {
            title: "Networking".to_string(),
            description: "I have no clue how SSL works.".to_string(),
        },
    ]);

    view! {
        <h2 class="text-3xl font-bold tracking-tight text-center sm:text-4xl">"Note to self."</h2>
        <div class="py-8 grid grid-cols-1 sm:grid-cols-3 sm:space-x-4 sm:space-y-0 space-y-2">
            <For each=notes key=|note| note.title.clone() let:note>
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">
                            <span class="icon-[octicon--command-palette-16]"></span>
                            {note.title}
                        </h2>
                        <p>{note.description}</p>
                    </div>
                </div>
            </For>
        </div>
    }
}

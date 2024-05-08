<div>
    <h2 class="py-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Note to self.
    </h2>
    <div
        class="grid max-w-4xl grid-cols-1 space-y-2 sm:grid-cols-3 sm:space-x-4 sm:space-y-0"
    >
        @foreach ($notes as $note)
            <div
                class="hover:scale-102 card border border-base-300 bg-base-100 shadow-xl transition duration-150 ease-in-out hover:-translate-y-1"
            >
                <div class="card-body">
                    <h2 class="card-title text-lg">
                        <span class="icon-[octicon--command-palette-16]"></span>
                        {{ $note->title }}
                    </h2>
                    <p>{{ $note->description }}</p>
                </div>
            </div>
        @endforeach
    </div>
</div>

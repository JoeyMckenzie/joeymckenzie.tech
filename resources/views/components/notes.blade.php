<div>
    <h2 class="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Note to self.
    </h2>
    <div
        class="grid grid-cols-1 space-y-2 sm:grid-cols-3 sm:space-x-4 sm:space-y-0"
    >
        @foreach ($notes as $note)
            <div
                class="border-1 card h-56 border border-base-300 bg-base-100 shadow-xl"
            >
                <div class="card-body">
                    <h2 class="card-title text-lg underline">
                        <span class="icon-[octicon--command-palette-16]"></span>
                        {{ $note->title }}
                    </h2>
                    <p>{{ $note->description }}</p>
                </div>
            </div>
        @endforeach
    </div>
</div>

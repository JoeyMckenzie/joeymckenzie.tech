<div>
    <h2
        class="py-12 text-center text-3xl font-bold tracking-tight dark:text-neutral-300 sm:text-4xl"
    >
        Note to self.
    </h2>
    <div
        class="grid max-w-4xl grid-cols-1 space-y-2 sm:grid-cols-3 sm:space-x-4 sm:space-y-0"
    >
        @foreach ($notes as $note)
            <x-card title="{{$note->title}}">
                {{ $note->description }}
            </x-card>
        @endforeach
    </div>
</div>

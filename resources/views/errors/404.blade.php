@extends("errors::layout")

@section("content")
    <main
        class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8"
    >
        <div class="text-center">
            <p class="text-base font-semibold">Four... oh, four.</p>
            <h1 class="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                You seem to be lost.
            </h1>
            <p class="mt-6 text-base leading-7">
                Either I've led you down a path less traveled, or you're
                snooping around for secrets...
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
                <a href="/" class="flex justify-center">
                    <button class="btn">
                        <span class="icon-[mdi--arrow-left] h-4 w-4"></span>
                        Back to safety
                    </button>
                </a>
            </div>
        </div>
    </main>
@endsection

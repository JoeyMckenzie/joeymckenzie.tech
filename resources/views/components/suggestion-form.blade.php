<form method="post" action="{{ route('feedback.store') }}">
    <p>
        Want to help me grow as a writer? Submit your anonymous suggestions, feedback, or just say hi. I'm always
        looking for
        something to write about next!
    </p>
    <div class="py-2">
        @if (session('status'))
            <div class="alert alert-success">
                <x-bi-check-circle class="hidden sm:block" />
                {{ session('status') }}
            </div>
        @endif
    </div>
    <div class="flex flex-col gap-y-2">
        <textarea class="textarea textarea-bordered" name="feedback" cols="45" placeholder="Rust and PHP walk into a bar..."></textarea>
        <button class="btn" type="submit">Submit</button>
    </div>
</form>

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
    <!-- *Insert meme about frontend validation being a single gate in front of a giant field* -->
    <div class="flex flex-col gap-y-2" x-data="{ feedback: '' }">
        <textarea class="textarea textarea-bordered" name="feedback" x-model="feedback" cols="45"
            placeholder="Rust and PHP walk into a bar..."></textarea>
        <button class="btn" type="submit" :disabled="!feedback.trim()">Submit</button>
    </div>
</form>

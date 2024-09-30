@section('title')
    Hey, I'm Joey.
@endsection

<x-app-layout>
    <div class="hero">
        <div class="hero-content">
            <div class="max-w-md  prose">
                <h1 class="text-xl font-bold text-center">Hey, I'm Joey.</h1>
                <p>
                    I'm a software developer based in Northern California working in fintech. I enjoy writing about
                    software, design, dad jokes, and cheap beer among a few other things. I like building fast,
                    efficient
                    web services, learning new things, and writing code in the open source ecosystem.
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a href="https://github.com/joeymckenzie" class="btn btn-primary">
                        <x-bi-github />
                        GitHub
                    </a>
                    <a href="https://linkedin.com/in/joeymckenzie" class="btn btn-primary">
                        <x-bi-linkedin />
                        LinkedIn
                    </a>
                    <a href="https://x.com/_joeyMcKenzie" class="btn btn-primary">
                        <x-bi-twitter-x />
                        Twitter
                    </a>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

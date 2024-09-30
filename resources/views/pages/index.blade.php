@section('title')
    Hey, I'm Joey.
@endsection

<x-app-layout>
    <div class="hero">
        <div class="hero-content">
            <div class="prose max-w-md">
                <h1 class="text-center text-xl font-bold">Hey, I'm Joey.</h1>
                <p>
                    I'm a software developer based in Northern California. I enjoy writing about
                    software, design, dad jokes, and cheap beer among a few other things. I like building fast,
                    efficient
                    web apps, learning new things, and writing code in the open source ecosystem.
                </p>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <a class="btn btn-primary" href="https://github.com/joeymckenzie">
                        <x-bi-github />
                        GitHub
                    </a>
                    <a class="btn btn-primary" href="https://linkedin.com/in/joeymckenzie">
                        <x-bi-linkedin />
                        LinkedIn
                    </a>
                    <a class="btn btn-primary" href="https://x.com/_joeyMcKenzie">
                        <x-bi-twitter-x />
                        Twitter
                    </a>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

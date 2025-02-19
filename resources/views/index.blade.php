<x-layout title="Hi, I'm Joey." subtitle="Programmer. Dad. PHP Enjoyer. Beer snob. 🍺">
    <p>
        I'm a software developer based in Northern California. I enjoy writing about software, design, dad jokes,
        and cheap beer. I like building for the web, open source, learning new things, and professional wrestling. I
        enjoy writing about my adventures in software and the things I'm currently working on, exploring new
        technologies, and convincing people that PHP is, in fact, not completely dead yet.
    </p>
    <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
        <a href="https://github.com/joeymckenzie">GitHub</a>
        <a href="https://linkedin.com/in/JoeyMcKenzie">LinkedIn</a>
        <a href="https://bsky.app/profile/joeymckenzie.tech">Bluesky</a>
    </div>
    <x-office-quote :quote="$quote ?? null" />
    <h3>Latest thoughts</h3>
    <x-bluesky-post :post="$latestPost" />
</x-layout>

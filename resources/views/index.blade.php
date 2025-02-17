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
    <x-bluesky-post username="Joey McKenzie" handle="@joeymckenzie.tech"
        content="
Our next president will have to be technologically competent, at least, in order for us to sustain our place in the world.

This will become increasingly obvious over the next 4 years as AI gets more powerful

This isn't necessarily bad. Truly. Done right, we will be a better, more equal society"
        avatar="https://cdn.bsky.app/img/avatar/plain/did:plc:3ond7kebhvszgzsqo5llyipd/bafkreibphmjzwfs6gkdg3fqslkddnikj2wvqfws2i6k6wotx7dwanyatmm@jpeg"
        postUrl="/profile/mcuban.bsky.social/post/3liayebscik2o" timestamp="20h" :replyCount="2882" :repostCount="2100"
        :likeCount="18186" />
</x-layout>

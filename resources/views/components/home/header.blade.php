<div class="mb-16 lg:mb-24">
    <div class="flex flex-row justify-between">
        <flux:heading size="xl" data-animation="slideUp">
            Hi, I'm Joey.
        </flux:heading>
        <div class="flex flex-row items-center">
            <flux:button class="hover:-translate-y-1 transition ease-in-out" x-data
                         x-on:click="$flux.dark = ! $flux.dark" icon="moon" variant="subtle"
                         aria-label="Toggle dark mode" data-animation="slideUp" data-stagger="0.1"/>
            <flux:button class="hover:-translate-y-1 transition ease-in-out" icon="twitter" variant="subtle"
                         aria-label="GitHub Link" data-animation="slideUp" data-stagger="0.1"/>
            <flux:button class="hover:-translate-y-1 transition ease-in-out" icon="github" variant="subtle"
                         aria-label="GitHub Link" data-animation="slideUp" data-stagger="0.1"/>
            <flux:button class="hover:-translate-y-1 transition ease-in-out" icon="linkedin" variant="subtle"
                         aria-label="GitHub Link" data-animation="slideUp" data-stagger="0.1"/>
            <flux:button class="hover:-translate-y-1 transition ease-in-out" icon="mail" variant="subtle"
                         aria-label="GitHub Link" data-animation="slideUp" data-stagger="0.1"/>
        </div>
    </div>
    <flux:text data-animation="slideUp" data-stagger="0.15">
        Full-stack developer passionate about building scalable web applications with PHP and Laravel.
    </flux:text>
</div>
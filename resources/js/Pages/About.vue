<script lang="ts" setup>
import { Link } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
</script>

<template>
    <MainLayout>
        <div>
            <h2 class="text-4xl font-bold tracking-tight sm:text-center">
                Bio.
            </h2>
            <div
                class="prose mx-auto flex max-w-2xl flex-col text-justify leading-6 dark:prose-invert"
            >
                <p class="mt-6">
                    I'm Joey. I've got a passion for the web and developing
                    services and applications with performance in mind. I've
                    spent nearly a decade working on technologies across the
                    stack, from Java, IBM, .NET, and most of the major web
                    frontend frameworks you'll see folks arguing about over on
                    <a href="https://reddit.com/r/webdev">r/webdev </a>
                    .
                </p>
                <p>
                    By day, I'm a Senior Software Engineer working on mostly
                    .NET technologies in the web space. I've worked
                    professionally as a developer in healthcare, insurance, SaaS
                    startups, manufacturing, and now finance. I enjoy building
                    fast and efficient web services, exploring new technologies,
                    and arguing with other developers about the value of
                    pre-commit hooks when used wisely.
                </p>
                <p>
                    In my spare time, I like to do things with TypeScript, PHP
                    (pause for audible gasps) and Rust (I'm even writing some
                    cool stuff about
                    <a href="https://fullstackrust.netlify.app/">Rust! </a>
                    ), contributing to projects I find interesting and exploring
                    new frontiers. I like to write about things I come across in
                    the wild (of software), design, frameworks, and language
                    features among other things. If I find the time, you can
                    catch any of my content on
                    <a
                        href="https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#"
                        >YouTube
                    </a>
                    or streaming live on
                    <a href="https://twitch.tv/JoeTheDevMan">Twitch </a>
                    . Checkout my
                    <Link :href="route('blogs.all')">blog</Link>
                    for things I publish that mostly deal with my questionable
                    takes on development.
                </p>
                <p>
                    Outside of refactoring legacy code and convincing managers
                    that estimates are not deadlines, I enjoy spending time with
                    my wife and dog, family and friends, and sampling the latest
                    installment of adult beverages at my local breweries.
                </p>
            </div>
        </div>
    </MainLayout>
</template>

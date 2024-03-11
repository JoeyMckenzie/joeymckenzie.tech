<script lang="ts" setup>
import Hero from '@/Components/Hero.vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import LatestPosts from '@/Components/LatestPosts.vue';
import SocialButtons from '@/Components/SocialButtons.vue';
import { Head } from '@inertiajs/vue3';
import { FrontMatter } from '@/types';
import Notes from '@/Components/Notes.vue';

defineProps<{
    frontMatters: FrontMatter[];
}>();
</script>

<template>
    <Head>
        <title>Hi, I'm Joe.</title>
    </Head>

    <MainLayout>
        <Hero />
        <SocialButtons />
        <LatestPosts :front-matters="frontMatters" />
        <Notes />
    </MainLayout>
</template>

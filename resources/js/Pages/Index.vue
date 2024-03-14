<script lang="ts" setup>
import Hero from '@/Components/Hero.vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import LatestPosts from '@/Components/LatestPosts.vue';
import SocialButtons from '@/Components/SocialButtons.vue';
import { Head } from '@inertiajs/vue3';
import { FrontMatter, Note } from '@/types';
import Notes from '@/Components/Notes.vue';

defineProps<{
    frontMatters: FrontMatter[];
    notes: Note[];
}>();
</script>

<template>
    <Head>
        <title>Hi, I'm Joey.</title>
    </Head>

    <MainLayout>
        <Hero />
        <SocialButtons />
        <LatestPosts :front-matters="frontMatters" />
        <Notes :notes="notes" />
    </MainLayout>
</template>

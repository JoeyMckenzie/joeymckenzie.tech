<script lang="ts" setup>
import Hero from '@/Components/Hero.vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import LatestPosts from '@/Components/LatestPosts.vue';
import SocialButtons from '@/Components/SocialButtons.vue';
import { Head } from '@inertiajs/vue3';
import { Brewery, FrontMatter, Note } from '@/types';
import Notes from '@/Components/Notes.vue';
import BreweriesTable from '@/Components/BreweriesTable.vue';

defineProps<{
    frontMatters: FrontMatter[];
    notes: Note[];
    breweries: Brewery[];
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
        <BreweriesTable :breweries="breweries" />
    </MainLayout>
</template>

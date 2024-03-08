<script lang="ts" setup>
import Hero from '@/Components/Hero.vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import LatestPosts from '@/Components/LatestPosts.vue';
import Notes from '@/Components/Notes.vue';
import SocialButtons from '@/Components/SocialButtons.vue';
</script>

<template>
    <MainLayout>
        <Hero />
        <SocialButtons />
        <LatestPosts />
        <Notes />
    </MainLayout>
</template>

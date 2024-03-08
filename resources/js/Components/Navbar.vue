<script lang="ts" setup>
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/vue3';
import ThemeToggle from '@/Components/ThemeToggle.vue';

const links = [
    {
        to: 'home',
        display: 'Home',
    },
    {
        to: 'home',
        display: 'Now',
    },
    {
        to: 'blogs',
        display: 'Blog',
    },
];
</script>

<template>
    <nav class="flex flex-row items-center justify-center gap-x-2 px-6 pt-8">
        <Button v-for="link in links" :key="link.to" variant="outline">
            <Link :href="route(link.to)"> {{ link.display }}</Link>
        </Button>
        <ThemeToggle />
    </nav>
</template>

<style scoped></style>

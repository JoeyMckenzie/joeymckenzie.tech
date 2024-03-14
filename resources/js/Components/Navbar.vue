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
        to: 'now',
        display: 'Now',
    },
    {
        to: 'blog',
        display: 'Blog',
    },
];
</script>

<template>
    <nav class="flex flex-row items-center justify-center gap-x-2 px-6 pt-8">
        <Link v-for="link in links" :key="link.to" :href="route(link.to)">
            <Button variant="outline">
                {{ link.display }}
            </Button>
        </Link>
        <ThemeToggle />
    </nav>
</template>

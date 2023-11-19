<script lang="ts" setup>
import Button from '@/Components/ui/button/Button.vue';
import ThemeToggle from '@/Components/ThemeToggle.vue';
import { Link } from '@inertiajs/vue3';

type NavLinkProps = {
    name: string;
    display: string;
};

const links: NavLinkProps[] = [
    {
        display: 'Home',
        name: route('home'),
    },
    {
        display: 'About',
        name: route('about'),
    },
    {
        display: 'Blog',
        name: route('blogs.all'),
    },
];
</script>

<template>
    <header>
        <nav
            class="flex flex-row items-center justify-center gap-x-2 px-6 py-8"
        >
            <Link
                v-for="{ display, name } of links"
                :key="display"
                :href="name"
            >
                <Button variant="outline">
                    {{ display }}
                </Button>
            </Link>
            <ThemeToggle />
        </nav>
    </header>
</template>

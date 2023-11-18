<script lang="ts" setup>
import Button from '@/Components/ui/button/Button.vue';
import ThemeToggle from '@/Components/ThemeToggle.vue';
import { Link } from '@inertiajs/vue3';

type NavLinkProps = {
    href: string;
    display: string;
};

const links: NavLinkProps[] = [
    {
        display: 'Home',
        href: '/',
    },
    {
        display: 'About',
        href: '/about',
    },
    {
        display: 'Blog',
        href: '/blog',
    },
];
</script>

<template>
    <header>
        <nav
            class="flex flex-row items-center justify-center gap-x-2 px-6 py-8"
        >
            <Link
                v-for="{ display, href } of links"
                :key="display"
                :href="href"
            >
                <Button variant="outline">
                    {{ display }}
                </Button>
            </Link>
            <ThemeToggle />
        </nav>
    </header>
</template>

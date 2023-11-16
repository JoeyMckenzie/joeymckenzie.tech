<script lang="ts" setup>
import Button from '@/Components/ui/button/Button.vue';
import ThemeToggle from '@/Components/ThemeToggle.vue';

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
            <Button
                v-for="{ display, href } of links"
                :key="display"
                :href="href"
                as="a"
                variant="outline"
            >
                {{ display }}
            </Button>
            <ThemeToggle />
        </nav>
    </header>
</template>

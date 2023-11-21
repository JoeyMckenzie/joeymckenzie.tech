<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { Link } from '@inertiajs/vue3';
import Button from '@/Components/ui/button/Button.vue';

const socials = [
    {
        href: 'https://github.com/joeymckenzie',
        icon: 'mdi:github',
        display: 'GitHub',
        external: 'gg:external',
    },
    {
        href: 'https://linkedin.com/in/JoeyMcKenzie',
        icon: 'mdi:linkedin',
        display: 'LinkedIn',
        external: 'gg:external',
    },
    {
        href: 'https://x.com/_joeyMcKenzie',
        icon: 'mdi:twitter',
        display: 'Twitter',
        external: 'gg:external',
    },
    {
        href: 'https://resume.joeymckenzie.tech/JoeyMcKenzie_resume.pdf',
        icon: 'carbon:identification',
        display: 'Resume',
        external: 'material-symbols:download-sharp',
    },
];
</script>

<template>
    <div
        class="mx-auto grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4 py-8 sm:grid-cols-4"
    >
        <Link
            v-for="{ display, href, icon, external } in socials"
            :key="icon"
            :href="href"
        >
            <Button class="flex w-full flex-row gap-x-2" variant="outline">
                <Icon :icon="icon" class="h-5 w-5" />
                {{ display }}
                <Icon :icon="external" class="h-5 w-5" />
            </Button>
        </Link>
    </div>
</template>

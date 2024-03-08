<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { Button } from '@/Components/ui/button';

const socials = [
    {
        href: 'https://github.com/joeymckenzie',
        display: 'GitHub',
        icon: 'mdi:github',
    },
    {
        href: 'https://linkedin.com/in/JoeyMcKenzie',
        display: 'LinkedIn',
        icon: 'mdi:linkedin',
    },
    {
        href: 'https://x.com/_joeyMcKenzie',
        display: 'Twitter',
        icon: 'mdi:twitter',
    },
];
</script>

<template>
    <div
        class="mx-auto grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4 py-8 sm:grid-cols-3"
    >
        <div v-for="social in socials" :key="social.display">
            <a :href="social.href">
                <Button
                    class="flex w-full flex-row items-center justify-center gap-x-3"
                    variant="outline"
                >
                    <Icon :icon="social.icon" class="h-4 w-4" />
                    {{ social.display }}
                    <Icon icon="tabler:external-link" />
                </Button>
            </a>
        </div>
    </div>
</template>

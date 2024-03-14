<script lang="ts" setup>
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const page = usePage();
const commitSha = computed(() => page.props.commit);
const commitShaForDisplay = commitSha.value.substring(0, 6);
const commitUrl = `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${commitSha.value.substring(0, 6)}`;
const poweredBy = [
    {
        display: 'Laravel',
        href: 'https://laravel.com',
        icon: 'logos:laravel',
    },
    {
        display: 'Vue.js',
        href: 'https://vuejs.org',
        icon: 'logos:vue',
    },
    {
        display: 'Inertia.js',
        href: 'https://inertiajs.com/',
        icon: 'simple-icons:inertia',
    },
    {
        display: 'Fly.io',
        href: 'https://fly.io',
        icon: 'logos:fly-icon',
    },
    {
        display: 'Neon DB',
        href: 'https://neon.tech',
        icon: 'logos:neon-icon',
    },
];
</script>

<template>
    <div class="mx-auto inline-flex flex-row items-center gap-x-2 md:mx-0">
        <p class="font-ubuntu text-center text-xs leading-5">Powered by</p>
        <a
            v-for="provider in poweredBy"
            :key="provider.display"
            :href="provider.href"
        >
            <span class="sr-only">{{ provider.display }}</span>
            <Icon
                :icon="provider.icon"
                class="h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            />
        </a>

        <a
            :href="commitUrl"
            class="font-ubuntu text-center text-xs leading-5 hover:underline"
        >
            {{ commitShaForDisplay }}
        </a>
    </div>
</template>

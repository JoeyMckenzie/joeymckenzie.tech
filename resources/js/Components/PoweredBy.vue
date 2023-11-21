<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const page = usePage();

const commitSha = computed(() => page.props.commit);
const commitShaForDisplay = computed(() => commitSha.value.substring(0, 6));
const commitUrl = computed(
    () =>
        `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${commitSha.value}`,
);

const poweredBy = [
    {
        display: 'Larvel',
        href: 'https://laravel.com',
        icon: 'logos:laravel',
    },
    {
        display: 'Vue',
        href: 'https://vuejs.org',
        icon: 'logos:vue',
    },
    {
        display: 'Inertia.js',
        href: 'https://inertiajs.com',
        icon: 'simple-icons:inertia',
    },
    {
        display: 'Fly.io',
        href: 'https://fly.io',
        icon: 'logos:fly-icon',
    },
];
</script>

<template>
    <div class="mx-auto inline-flex flex-row items-center gap-x-3 md:mx-0">
        <p class="font-ubuntu text-center text-xs leading-5">Powered by</p>
        <a
            v-for="{ display, icon, href } in poweredBy"
            :key="icon"
            :href="href"
        >
            <span class="sr-only">{{ display }}</span>
            <Icon
                :icon="icon"
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

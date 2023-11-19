<script lang="ts" setup>
import { Head, Link } from '@inertiajs/vue3';
import Button from '@/Components/ui/button/Button.vue';

import { computed } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';

const props = defineProps<{
    status: number;
}>();

const title = computed(() => {
    return {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[props.status];
});

const description = computed(() => {
    return {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: "The page you're looking for doesn't exact, or something catastrophic happened that I'll probably never fix.",
        403: 'Sorry, you are forbidden from accessing this page.',
    }[props.status];
});
</script>

<template>
    <Head :title="title" />

    <MainLayout>
        <main
            class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8"
        >
            <div class="text-center">
                <p class="text-base font-semibold">{{ status }}</p>
                <h1 class="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                    Uh oh...
                </h1>
                <p class="mt-6 text-base leading-7">
                    {{ description }}
                </p>
                <div class="mt-10 flex items-center justify-center gap-x-6">
                    <Link :href="route('home')" class="flex flex-row gap-x-2">
                        <Button variant="outline">
                            <!--                    <Icon class="h-5 w-5" icon="mdi:arrow-left" />-->
                            Back to safety
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    </MainLayout>
</template>

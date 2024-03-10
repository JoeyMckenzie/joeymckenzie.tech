<script lang="ts" setup>
import { FrontMatter } from '@/types';
import BlogPreviews from '@/Components/BlogPreviews.vue';

defineProps<{
    frontMatters: FrontMatter[];
}>();
</script>

<template>
    <div class="px-6 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl">
            <h2
                class="text-3xl text-right sm:text-center font-bold tracking-tight sm:text-4xl"
            >
                Latest thoughts.
            </h2>
            <BlogPreviews :front-matters="frontMatters" />
        </div>
    </div>
</template>

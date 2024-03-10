<script lang="ts" setup>
import { FrontMatter } from '@/types';
import BlogPreviews from '@/Components/BlogPreviews.vue';

defineProps<{
    frontMatters: FrontMatter[];
}>();
</script>

<template>
    <div class="px-6 sm:px-6 pt-12 lg:px-8">
        <div class="mx-auto max-w-2xl">
            <h2
                class="text-right text-3xl font-bold tracking-tight sm:text-center sm:text-4xl"
            >
                Latest thoughts.
            </h2>
            <BlogPreviews :front-matters="frontMatters" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { FrontMatter } from '@/types';
import BlogPreviews from '@/Components/BlogPreviews.vue';

defineProps<{
    frontMatters: FrontMatter[];
}>();
</script>

<template>
    <div class="pt-12 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
            <h2
                class="text-right text-4xl font-bold tracking-tight sm:text-center sm:text-4xl"
            >
                Latest thoughts.
            </h2>
            <BlogPreviews :front-matters="frontMatters" />
        </div>
    </div>
</template>

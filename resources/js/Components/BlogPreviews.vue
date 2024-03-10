<script lang="ts" setup>
import { FrontMatter } from '@/types';
import BlogCard from '@/Components/BlogCard.vue';

defineProps<{
    frontMatters: FrontMatter[];
}>();
</script>

<template>
    <div
        class="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-12 py-8 sm:grid-cols-3"
    >
        <BlogCard
            v-for="frontMatter in frontMatters"
            :key="frontMatter.slug"
            :front-matter="frontMatter"
        />
    </div>
</template>

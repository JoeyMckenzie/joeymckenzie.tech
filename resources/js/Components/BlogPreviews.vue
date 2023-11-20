<script lang="ts" setup>
import { ContentMeta } from '@/models';
import BlogCard from '@/Components/BlogCard.vue';

defineProps<{ contentMetas: ContentMeta[] }>();
</script>

<template>
    <div
        class="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-12 py-8 sm:grid-cols-3"
    >
        <BlogCard
            v-for="meta in contentMetas"
            :key="meta.title"
            :post="meta"
            :view-count="0"
        />
    </div>
</template>

<style scoped></style>

<script lang="ts" setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import { ContentMeta } from '@/models';
import BlogPreviews from '@/Components/BlogPreviews.vue';
import { Head } from '@inertiajs/vue3';

defineProps<{
    contentMetas: ContentMeta[];
}>();
</script>

<template>
    <Head title="Blog | joeymckenzie.tech" />

    <MainLayout>
        <div class="pb-12">
            <h2 class="text-4xl font-bold tracking-tight sm:text-center">
                Blog.
            </h2>
            <p
                class="prose mx-auto mt-6 text-justify leading-6 dark:prose-invert"
            >
                I write about a lot of things, mainly languages, ecosystems, and
                software design. I consider my writing a journal of technologies
                I've worked with at some point during my career, and I'm always
                happy to field questions and conversations from interested
                readers. Feel free to
                <a href="mailto:joey.mckenzie27@gmail.com">contact</a>
                me about any of the writing I do here, or to simply say hello!
            </p>
        </div>
        <BlogPreviews :content-metas="contentMetas" />
    </MainLayout>
</template>

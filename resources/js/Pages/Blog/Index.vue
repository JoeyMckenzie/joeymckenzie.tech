<script lang="ts" setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import { Head } from '@inertiajs/vue3';
import { FrontMatter } from '@/types';
import BlogPreviews from '@/Components/BlogPreviews.vue';

defineProps<{
    frontMatters: FrontMatter[];
}>();
</script>

<template>
    <Head>
        <title>Blog.</title>
    </Head>
    <MainLayout>
        <div class="py-12 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl pb-12">
                <h2
                    class="text-center text-4xl font-extrabold tracking-tight sm:text-4xl"
                >
                    Blog.
                </h2>
                <p class="mx-auto mt-6 max-w-xl text-justify">
                    I write about a lot of things, mainly languages, ecosystems,
                    and software design. I consider my writing a journal of
                    technologies I've worked with at some point during my
                    career, and I'm always happy to field questions and
                    conversations from interested readers. Feel free to
                    <a href="mailto:joey.mckenzie.dev@gmail.com">contact me</a>
                    about any of the writing I do here, or to simply say hello!
                </p>
            </div>
            <BlogPreviews :front-matters="frontMatters" />
        </div>
    </MainLayout>
</template>

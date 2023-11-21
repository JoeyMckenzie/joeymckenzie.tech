<script lang="ts" setup>
import Button from '@/Components/ui/button/Button.vue';
import { Head, Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import Badge from '@/Components/ui/badge/Badge.vue';
import { ContentMeta } from '@/models';

const props = defineProps<{
    contentMeta: ContentMeta;
}>();

const frontMatter = computed(() => props.contentMeta.frontMatter);
const formattedDate = computed(() =>
    new Date(frontMatter.value.pubDate ?? '').toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }),
);
</script>

<template>
    <Head :title="`${frontMatter.title} | joeymckenzie.tech`" />

    <MainLayout>
        <div class="flex flex-col justify-center">
            <article
                class="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-img:mx-auto prose-img:rounded-md"
            >
                <h1 class="text-center text-2xl">{{ frontMatter.title }}</h1>
                <div
                    class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight"
                >
                    <time :datetime="frontMatter.pubDate">
                        {{ formattedDate }}
                    </time>
                    <Badge>{{ frontMatter.category }}</Badge>
                </div>
                <img
                    :alt="`${frontMatter.title} hero image`"
                    :src="frontMatter.heroImage"
                    height="400"
                    width="500"
                />
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div v-html="contentMeta.content" />
            </article>
            <Link :href="route('blogs')" class="mx-auto max-w-md">
                <Button variant="secondary"> Back to blogs</Button>
            </Link>
        </div>
    </MainLayout>
</template>

<script lang="ts" setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { Post } from '@/types';
import { computed } from 'vue';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';

const props = defineProps<{
    post: Post;
    keywords: string[];
}>();

const keywordList = computed(() => props.keywords.join(','));
const altText = computed(() => `${props.post.title} blog meme`);
</script>

<template>
    <Head>
        <meta :content="keywordList" name="keywords" />
        <title>
            {{ post.title }}
        </title>
    </Head>

    <MainLayout>
        <div class="flex flex-col justify-center pt-12">
            <article
                class="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-pre:text-sm prose-img:mx-auto prose-img:rounded-md"
            >
                <h1 class="text-center text-2xl font-semibold">
                    {{ post.title }}
                </h1>
                <div
                    class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight"
                >
                    <time dateTime="{post.pubDate}"
                        >{{ post.published_date }}
                    </time>
                    <Badge variant="secondary">{{ post.category }}</Badge>
                </div>
                <img
                    :alt="altText"
                    :src="post.hero_image"
                    height="400"
                    width="500"
                />
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div v-html="post.parsed_content" />
            </article>
            <Link :href="route('blog')" class="mx-auto max-w-md">
                <Button variant="secondary"> Back to blogs</Button>
            </Link>
        </div>
    </MainLayout>
</template>

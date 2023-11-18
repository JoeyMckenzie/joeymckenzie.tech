<script lang="ts" setup>
import Badge from '@/Components/ui/badge/Badge.vue';
import { Link } from '@inertiajs/vue3';

defineProps<{
    slug: string;
}>();
</script>

<template>
    <div class="flex flex-col justify-center">
        <article
            class="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-img:mx-auto prose-img:rounded-md"
        >
            <h1 class="text-center text-2xl">{{ slug }}</h1>
            <div
                class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight"
            >
                <!--                <time dateTime={new Date(data.post.pubDate ?? '')?.toISOString() ?? ''}>
                                {new Date(data.post.pubDate ?? '').toLocaleDateString('en-us', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                })}
                                </time>-->
                <Badge>category</Badge>
            </div>
            <!--            <img
                            height="400"
                            width="500"
                            alt={`${data.post.title} hero image`}
                            src={data.post.heroImage}
                        />
                        &lt;!&ndash; eslint-disable-next-line  &ndash;&gt;
                        {@html markdownContent}-->
        </article>
        <Button class="mx-auto max-w-md">
            <Link href="/blog">Back to blogs</Link>
        </Button>
    </div>
</template>

<style scoped></style>

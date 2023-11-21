<script lang="ts" setup>
import Badge from '@/Components/ui/badge/Badge.vue';
import { Link } from '@inertiajs/vue3';
import { format } from 'date-fns';
import { computed } from 'vue';
import { FrontMatter } from '@/models';

const props = defineProps<{
    frontMatter: FrontMatter;
    viewCount: number;
}>();

const formattedDate = computed(() =>
    format(new Date(props.frontMatter.pubDate), 'PP'),
);
</script>

<template>
    <article
        class="hover:scale-102 flex max-w-xl flex-col items-start transition duration-150 ease-in-out hover:-translate-y-1"
    >
        <Link
            :href="
                route('post', {
                    slug: frontMatter.slug,
                })
            "
        >
            <div class="flex items-center gap-x-4 text-xs">
                <time :datetime="frontMatter.pubDate">
                    {{ formattedDate }}
                </time>
                <Badge>{{ frontMatter.category }}</Badge>
                <div v-if="viewCount > 0" class="font-medium text-neutral-400">
                    {{ viewCount }} views
                </div>
            </div>
            <div class="group relative">
                <h3 class="mt-3 text-lg font-semibold leading-6">
                    <span class="absolute inset-0" />
                    {{ frontMatter.title }}
                </h3>
                <p class="mt-5 line-clamp-3 text-sm leading-6">
                    {{ frontMatter.description }}
                </p>
            </div>
        </Link>
    </article>
</template>

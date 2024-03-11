<script lang="ts" setup>
import { Badge } from '@/Components/ui/badge';
import { Link } from '@inertiajs/vue3';
import { FrontMatter } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
    frontMatter: FrontMatter;
}>();

const href = computed(() => `/blog/${props.frontMatter.slug}`);
</script>

<template>
    <article
        class="hover:scale-102 flex max-w-xl flex-col items-start transition duration-150 ease-in-out hover:-translate-y-1"
    >
        <Link :href="href">
            <div class="flex items-center gap-x-4 text-xs">
                <time dateTime="frontMatter.published_date"
                    >{{ frontMatter.published_date }}
                </time>
                <Badge variant="secondary">{{ frontMatter.category }}</Badge>
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

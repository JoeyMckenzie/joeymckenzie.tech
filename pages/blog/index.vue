<script setup lang="ts">
import { BlogPostProps } from '~/components/blog/PostPreview.vue';

useSeoMeta({
  title: 'joeymckenzie.tech',
  ogTitle: 'Blog | joeymckenzie.tech',
  description: 'A blog about code, software, and sometimes beer.',
  ogDescription: 'A blog about code, software, and sometimes beer.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
});

const [viewCounts, posts] = await Promise.all([
  useFetch('/api/blogs'),
  queryContent('blog')
    .only(['_path', 'category', 'description', 'pubDate', 'title'])
    .find(),
]);

const viewCountData = computed(() => viewCounts.data.value?.viewCounts);

// TODO: Clean this up, redundant
const previewPosts = posts
  .sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf())
  .map(
    (p) =>
      ({
        slug: p._path!,
        category: p.category,
        description: p.description,
        pubDate: new Date(p.pubDate),
        title: p.title!,
        viewCount:
          viewCountData.value?.find((vc) => p._path?.includes(vc.slug))
            ?.count ?? 0,
      }) satisfies BlogPostProps,
  );
</script>

<template>
  <div>
    <SectionHeader title="Blog" />
    <div
      class="prose mx-auto flex max-w-2xl flex-col text-sm leading-6 text-neutral-400"
    >
      <p class="mt-6 sm:text-center">
        I write about a lot of things, mainly languages, ecoystems, and software
        design. I consider my writing a journal of technologies I've worked with
        at some point during my career, and I'm always happy to field questions
        and conversations from interested readers. Feel free to
        <a
          class="text-indigo-400 hover:text-indigo-500"
          href="mailto:joey.mckenzie27@gmail.com"
          >contact</a
        >
        me about any of the writing I do here, or to simply say hello!
      </p>
    </div>
    <BlogPostPreviews :posts="previewPosts" />
  </div>
</template>

<script setup lang="ts">
import type { BlogPostProps } from '~/components/blog/PostPreview.vue';

useSeoMeta({
  title: 'joeymckenzie.tech',
  ogTitle: "Hi, I'm Joe | joeymckenzie.tech",
  description: 'A blog about code, software, and sometimes beer.',
  ogDescription: 'A blog about code, software, and sometimes beer.',
  ogImage: 'https://joeymckenzie.tech/favicon-32x32.png',
  twitterCard: 'summary_large_image',
});

const [viewCounts, posts] = await Promise.all([
  useFetch('/api/blogs'),
  queryContent('blog').find(),
]);

const viewCountData = computed(() => viewCounts.data.value?.viewCounts);

const previewPosts = posts
  .sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf())
  .slice(0, 3)
  .concat()
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
    <SectionHeader title="Hi, I'm Joey" />
    <HomeIntro />
    <HomeSocialButtons />
    <BlogPostPreviews :posts="previewPosts" />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'joeymckenzie.tech',
  ogTitle: "Hi, I'm Joe | joeymckenzie.tech",
  description: 'A blog about code, software, and sometimes beer.',
  ogDescription: 'A blog about code, software, and sometimes beer.',
  ogImage: 'https://joeymckenzie.tech/favicon-32x32.png',
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <div>
    <SectionHeader title="Hi, I'm Joey" />
    <HomeIntro />
    <HomeSocialButtons />
    <Suspense>
      <BlogPostPreviews :include-latest="true" />
      <template #fallback>
        <BlogPostsLoading />
      </template>
    </Suspense>
  </div>
</template>

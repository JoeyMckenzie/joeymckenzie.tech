<script setup lang="ts">
useSeoMeta({
  title: 'joeymckenzie.tech',
  ogTitle: "Hi, I'm Joe | joeymckenzie.tech",
  description: 'A blog about code, software, and sometimes beer.',
  ogDescription: 'A blog about code, software, and sometimes beer.',
  ogImage: 'https://joeymckenzie.tech/favicon-32x32.png',
  twitterCard: 'summary_large_image',
});

const blogs = await useFetch('/api/blogs?includeTop=true');
console.log('blogs.data.value?.viewCounts', blogs.data.value?.viewCounts);

const top = await useFetch('/api/blogs');
console.log('top.data.value?.viewCounts', top.data.value?.viewCounts);
</script>

<template>
  <Header title="Hi, I'm Joey" />
  <HomeIntro />
  <HomeSocialButtons />
</template>

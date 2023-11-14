<script setup lang="ts">
useSeoMeta({
  title: 'About | joeymckenzie.tech',
  ogTitle: 'About | joeymckenzie.tech',
  description: 'Beers. Beats. Battlestar Galactica.',
  ogDescription: 'Beers. Beats. Battlestar Galactica.',
  ogImage: 'https://joeymckenzie.tech/favicon-32x32.png',
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <div>
    <h2 class="text-4xl font-bold tracking-tight sm:text-center">Bio.</h2>
    <p class="prose mx-auto mt-6 text-justify leading-6 dark:prose-invert">
      I'm a <span class="font-semibold">Senior Software Engineer</span> based in
      Northern California working in fintech. I enjoy writing about software,
      design, dad jokes, and cheap beer among a few other things. I like
      building fast, efficient web services, learning new things, and writing
      code in the open source ecosystem.
    </p>
    <SocialButtons />
    <h2
      class="pb-4 pt-8 text-right text-4xl font-bold tracking-tight sm:text-center"
    >
      Latest thoughts.
    </h2>
    <!-- <BlogPreview posts={$viewCountStore.latest} /> -->
  </div>
</template>

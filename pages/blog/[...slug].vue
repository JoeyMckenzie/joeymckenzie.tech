<script setup lang="ts">
const { path } = useRoute();

useSeoMeta({
  title: 'joeymckenzie.tech',
  ogTitle: 'Blog | joeymckenzie.tech',
  description: 'A blog about code, software, and sometimes beer.',
  ogDescription: 'A blog about code, software, and sometimes beer.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
});

const response = await useFetch('/api/blogs/view', {
  method: 'POST',
  body: { slug: path },
});
console.log(response.data?.value);
</script>

<template>
  <div>
    <ContentDoc v-slot="{ doc }">
      <article
        class="prose prose-invert mx-auto overflow-hidden pb-12 font-merriweather text-neutral-400 prose-h2:text-neutral-200 prose-a:text-neutral-200 hover:prose-a:text-neutral-300 prose-code:text-neutral-300 prose-img:mx-auto prose-img:rounded-md"
      >
        <h1 class="text-center font-merriweather text-2xl text-neutral-300">
          {{ doc.title }}
        </h1>
        <div
          class="flex flex-row items-center justify-center gap-x-2 font-roboto-mono text-sm tracking-tighter"
        >
          <FormattedDate :date="new Date(doc.pubDate)" />
          <span class="font-bold">#{{ doc.category }}</span>
        </div>
        <img
          width="540"
          height="280"
          :src="doc.heroImage"
          alt="Blog header image"
        />
        <ContentRenderer :value="doc" />
      </article>
      <NuxtLink
        to="/blog"
        type="button"
        class="mx-auto flex w-40 items-center justify-center gap-x-1.5 rounded-md bg-neutral-800 px-3 py-2 text-sm font-semibold text-neutral-400 shadow-sm hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600"
      >
        <Icon name="ic:round-arrow-back" class="h-6 w-6" />
        Back to blogs
      </NuxtLink>
    </ContentDoc>
  </div>
</template>

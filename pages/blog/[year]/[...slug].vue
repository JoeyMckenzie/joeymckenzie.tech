<template>
  <main class="mx-auto px-4 py-12">
    <ContentDoc v-slot="{ doc }">
      <article class="prose dark:prose-invert">
        <h1 class="text-2xl sm:text-center">
          {{ doc.title }}
        </h1>
        <NuxtImg
          :src="doc.heroImage" :alt="`${doc.title} blog meme image`"
          class="mx-auto rounded-md"
        />
        <ContentRenderer :value="doc" />
      </article>
    </ContentDoc>
    <div class="flex justify-center pt-8">
      <UButton to="/blog">
        Back to blog
      </UButton>
    </div>
  </main>
</template>

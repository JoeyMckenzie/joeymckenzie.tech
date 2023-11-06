<script lang="ts">
  import BlogPreview from '$lib/components/BlogPreview.svelte';
  import { viewCountStore } from '$lib/views';
</script>

<svelte:head>
  <title>Blog | joeymckenzie.tech</title>
</svelte:head>

<div class="pb-12">
  <h2 class="text-4xl font-bold tracking-tight sm:text-center">Blog.</h2>
  <p class="prose mx-auto mt-6 text-justify leading-6 dark:prose-invert">
    I write about a lot of things, mainly languages, ecoystems, and software
    design. I consider my writing a journal of technologies I&apos;ve worked
    with at some point during my career, and I&apos;m always happy to field
    questions and conversations from interested readers. Feel free to
    <a href="mailto:joey.mckenzie27@gmail.com">contact</a> me about any of the writing
    I do here, or to simply say hello!
  </p>
</div>
<BlogPreview posts={$viewCountStore.all} />

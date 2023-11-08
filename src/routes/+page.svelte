<script lang="ts">
  import BlogPreview from '$lib/components/BlogPreview.svelte';
  import SocialButtons from '$lib/components/SocialButtons.svelte';
  import { viewCountStore } from '$lib/views';
</script>

<svelte:head>
  <title>Bears. Beets. Battlestar Galactiga. | joeymckenzie.tech</title>
  <meta
    content="A blog about software, technology, and sometimes beer."
    name="description"
  />
  <meta content="software, programming, technology" name="keywords" />
</svelte:head>

<h2 class="text-4xl font-bold tracking-tight sm:text-center">Hi, I'm Joey.</h2>
<p class="prose mx-auto mt-6 text-justify leading-6 dark:prose-invert">
  I'm a <span class="font-semibold">Senior Software Engineer</span> based in Northern
  California working in fintech. I enjoy writing about software, design, dad jokes,
  and cheap beer among a few other things. I like building fast, efficient web services,
  learning new things, and writing code in the open source ecosystem. If you'd like
  to get in touch, feel free to reach on on any of my socials.
</p>
<SocialButtons />
<h2
  class="pb-4 pt-8 text-right text-4xl font-bold tracking-tight sm:text-center"
>
  Latest thoughts.
</h2>
<BlogPreview posts={$viewCountStore.latest} />

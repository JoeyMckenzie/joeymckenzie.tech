<script lang="ts">
  import BlogCard from '$lib/components/BlogCard.svelte';
  import type { PostWithViewCount } from '$lib/types';

  export let posts: PostWithViewCount[];
</script>

<div
  class="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-12 py-8 sm:grid-cols-3"
>
  {#each posts as post}
    <BlogCard {post} />
  {/each}
</div>

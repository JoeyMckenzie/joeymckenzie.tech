<script lang="ts">
  import BlogCard from '$lib/components/BlogCard.svelte';
  import type { PostWithViewCount } from '$lib/types';
  import { Skeleton } from './ui/skeleton';

  const { posts } = $props<{ posts: PostWithViewCount[] }>();
  const loadingPosts = $derived(posts.length === 0);
</script>

{#if loadingPosts}
  <div class="mx-auto flex items-center justify-center space-x-4 p-12">
    <Skeleton class="h-12 w-12 rounded-full" />
    <div class="space-y-2">
      <Skeleton class="h-4 w-[250px]" />
      <Skeleton class="h-4 w-[200px]" />
    </div>
  </div>
{:else}
  <div
    class="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-12 py-8 sm:grid-cols-3"
  >
    {#each posts as post}
      <BlogCard {post} />
    {/each}
  </div>
{/if}

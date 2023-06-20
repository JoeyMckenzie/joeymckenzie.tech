<script lang="ts">
  import { viewCountStore } from './view-counts';

  export let slug = '';

  $: viewCount =
    $viewCountStore.allBlogs?.counts.find((vc) => vc.slug === slug)?.count ?? 0;
</script>

{#if viewCount > 0}
  <div class="font-medium text-neutral-400">
    {viewCount} views
  </div>
{/if}

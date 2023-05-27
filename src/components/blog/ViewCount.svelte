<script lang="ts">
  type ViewCountMeta = {
    count: number;
    slug: string;
  };

  export let slug = '';
  export let apiBaseUrl = '';
  export let viewCountThreshold = 0;

  async function getViewCount(): Promise<ViewCountMeta> {
    const response = await fetch(`${apiBaseUrl}/views/${slug}`);
    return response.json();
  }
</script>

{#await getViewCount()}
  <div class="font-medium text-neutral-400">Loading...</div>
{:then { count }}
  {#if count >= viewCountThreshold}
    <div class="font-medium text-neutral-400">{count} views</div>
  {:else}
    <div class="font-medium text-neutral-400">get fucked idiot</div>
  {/if}
{/await}

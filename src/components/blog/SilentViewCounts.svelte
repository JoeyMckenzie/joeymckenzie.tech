<script lang="ts">
  import { onMount } from 'svelte';
  import type { ViewCountMetadata } from './view-counts';
  import { viewCountStore } from './view-counts';

  export let apiBaseUrl = '';

  async function getViewCounts(): Promise<ViewCountMetadata> {
    const viewCountResponse = await fetch(`${apiBaseUrl}/views`);
    return viewCountResponse.json();
  }

  onMount(async () => {
    const viewCountData = await getViewCounts();
    const { set } = viewCountStore;
    set(viewCountData.counts);
  });
</script>

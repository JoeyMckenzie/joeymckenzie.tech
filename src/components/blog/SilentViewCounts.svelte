<script lang="ts">
  import { onMount } from 'svelte';
  import type { ViewCountMetadata } from './view-counts';
  import { viewCountStore } from './view-counts';

  export let apiBaseUrl = '';
  export let includeTopCounts = false;

  async function getAllViewCounts(): Promise<ViewCountMetadata> {
    const viewCountResponse = await fetch(`${apiBaseUrl}/views`);
    return viewCountResponse.json();
  }

  async function getTopViewCounts(): Promise<ViewCountMetadata> {
    const viewCountResponse = await fetch(`${apiBaseUrl}/views/top`);
    return viewCountResponse.json();
  }

  onMount(async () => {
    const viewCounts = [getAllViewCounts()];

    if (includeTopCounts) {
      viewCounts.push(getTopViewCounts());
    }

    const { set } = viewCountStore;
    const [allViewCountsData, topViewCountsData] = await Promise.all(
      viewCounts
    );

    set({
      allBlogs: allViewCountsData,
      topBlogs: topViewCountsData,
    });
  });
</script>

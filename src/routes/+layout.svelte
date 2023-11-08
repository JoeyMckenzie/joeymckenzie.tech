<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { viewCountStore } from '$lib/views';
  import { webVitals } from '$lib/vitals';
  import { ModeWatcher } from 'mode-watcher';
  import { onMount } from 'svelte';
  import '../app.css';
  import type { LayoutServerData } from './$types';

  export let data: LayoutServerData;

  const analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;

  onMount(() => {
    const latestPosts = data.postPreviews.slice(0, 3);
    const { set } = viewCountStore;

    set({
      all: data.postPreviews,
      latest: latestPosts,
    });
  });

  $: if (browser && analyticsId) {
    webVitals({
      path: $page.url.pathname,
      params: $page.params,
      analyticsId,
    });
  }
</script>

<ModeWatcher />

<div class="mx-auto my-auto max-w-screen-2xl px-6 lg:px-8">
  <Navbar />
  <slot />
  <Footer commitSha={data.commitSha} nowPlaying={data.nowPlaying} />
</div>

<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import ModeWatcher from '$lib/theme/ModeWatcher.svelte';
  import createViewCounts from '$lib/views';
  import { webVitals } from '$lib/vitals';
  import { setContext } from 'svelte';
  import '../app.css';
  import type { LayoutServerData } from './$types';

  const { data } = $props<{ data: LayoutServerData }>();
  const analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;

  $effect(() => {
    const viewCounts = createViewCounts(data.postPreviews);
    setContext('viewCounts', viewCounts);
  });

  $effect(() => {
    if (browser && analyticsId) {
      webVitals({
        path: $page.url.pathname,
        params: $page.params,
        analyticsId,
      });
    }
  });
</script>

<ModeWatcher track={true} />

<div class="mx-auto my-auto max-w-screen-2xl px-6 lg:px-8">
  <Navbar />
  <slot />
  <Footer commitSha={data.commitSha} nowPlaying={data.nowPlaying} />
</div>

<script lang="ts">
  import '../app.css';
  import { ModeWatcher } from 'mode-watcher';
  import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import type { LayoutServerData } from './$types';
  import { onMount } from 'svelte';
  import { viewCountStore } from '$lib/views';

  export let data: LayoutServerData;

  onMount(() => {
    const latestPosts = data.postPreviews.slice(0, 3);
    const { set } = viewCountStore;

    set({
      all: data.postPreviews,
      latest: latestPosts,
    });
  });
</script>

<svelte:head>
  <title>Hi, I'm Joey. | joeymckenzie.tech</title>
</svelte:head>

<ModeWatcher />

<div class="mx-auto my-auto max-w-screen-2xl px-6 lg:px-8">
  <Navbar />
  <slot />
  <Footer commitSha={data.commitSha} nowPlaying={data.nowPlaying} />
</div>

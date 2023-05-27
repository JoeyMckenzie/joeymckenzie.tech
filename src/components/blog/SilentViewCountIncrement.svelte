<script lang="ts">
  import { onMount } from 'svelte';

  export let slug = '';
  export let apiBaseUrl = '';

  onMount(async () => {
    await fetch(`${apiBaseUrl}/${slug}`, {
      method: 'POST',
    });
  });
</script>

<script lang="ts">
  import { viewCountStore } from './view-counts';

  export let slug = '';
</script>

<div class="font-medium text-neutral-400">
  {$viewCountStore.find((vc) => vc.slug === slug)?.count ?? 0} views
</div>

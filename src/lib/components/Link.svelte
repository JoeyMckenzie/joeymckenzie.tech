<script lang="ts">
  export let href: string;
</script>

<a class="text-indigo-400 hover:text-indigo-500" {href}>
  <slot />
</a>

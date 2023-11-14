<script lang="ts">
  const { href } = $props<{ href: string }>();
</script>

<a class="text-indigo-400 hover:text-indigo-500" {href}>
  <slot />
</a>

<script lang="ts">
  export let text = 'Not currently listening';
</script>

<div class="flex flex-col space-y-1">
  <div class="flex flex-row items-center justify-center space-x-2">
    <slot />
    <div class="flex flex-col">
      <h4 class="text-xs text-neutral-500">{text}</h4>
    </div>
  </div>
</div>

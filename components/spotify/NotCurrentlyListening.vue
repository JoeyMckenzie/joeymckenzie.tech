<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: 'Not currently listening',
  },
});
</script>

<template>
  <div class="flex flex-col space-y-1">
    <div class="flex flex-row items-center justify-center space-x-2">
      <slot />
      <div class="flex flex-col">
        <h4 class="text-xs text-neutral-500">
          {{ text }}
        </h4>
      </div>
    </div>
  </div>
</template>

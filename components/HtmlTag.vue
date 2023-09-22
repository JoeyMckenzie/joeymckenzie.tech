<script setup lang="ts">
const props = defineProps<{
  tagName: string;
  additionalClasses?: string;
}>();

const defaultClasses = 'text-neutral-400 font-mono';
const classes = computed(() =>
  props.additionalClasses
    ? `${defaultClasses} ${props.additionalClasses}`
    : defaultClasses,
);
</script>

<template>
  <span :class="classes">&lt;{{ props.tagName }}&gt;</span>
  <slot />
  <span :class="classes">&lt;/{{ props.tagName }}&gt;</span>
</template>

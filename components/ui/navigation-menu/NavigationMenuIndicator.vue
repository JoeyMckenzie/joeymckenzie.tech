<script setup lang="ts">
import {
  NavigationMenuIndicator,
  type NavigationMenuIndicatorProps,
} from 'radix-vue';
import { cn } from '~/utils/shadcn';

const props = defineProps<NavigationMenuIndicatorProps>();
</script>

<template>
  <NavigationMenuIndicator
    v-bind="props"
    :class="
      cn(
        'data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
        $attrs.class ?? '',
      )
    "
  >
    <div
      class="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md"
    />
  </NavigationMenuIndicator>
</template>

<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <LayoutNavbar />
  <slot />
  <SpeedInsights />
</template>

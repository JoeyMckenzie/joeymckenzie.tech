<script setup lang="ts">
import { darkTheme } from 'naive-ui';
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-global-style />
    <n-layout embedded content-style="padding: 24px;">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </n-layout>
  </n-config-provider>
</template>

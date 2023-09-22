<script setup lang="ts">
const pageContent = await queryContent().findOne();
console.log('pageContent', pageContent);
</script>

<template>
  <main>
    <ContentDoc />
  </main>
</template>

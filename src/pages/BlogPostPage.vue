<script setup lang="ts">
import { useRoute } from 'vue-router';

const { params } = useRoute();
const response = await fetch(`/api/posts/${params.slug}`);
const post = await response.json();
</script>

<template>
  <div class="about">
    <h1>{{ post }}</h1>
  </div>
</template>

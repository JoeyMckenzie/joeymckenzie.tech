<script lang="ts" setup>
import Navbar from '@/Components/Navbar.vue';
</script>

<template>
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Navbar />
        <slot />
    </div>
</template>

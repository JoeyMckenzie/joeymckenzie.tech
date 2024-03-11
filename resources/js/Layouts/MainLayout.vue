<script lang="ts" setup>
import Navbar from '@/Components/Navbar.vue';
import Footer from '@/Components/Footer.vue';
</script>

<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Navbar />
        <slot />
        <Footer />
    </div>
</template>

<script lang="ts" setup>
import ApplicationNavbar from '@/Components/ApplicationNavbar.vue';
import ApplicationFooter from '@/Components/ApplicationFooter.vue';
</script>

<template>
    <div class="mx-auto my-auto max-w-screen-md px-6 lg:px-8">
        <ApplicationNavbar />
        <slot />
        <ApplicationFooter commit-sha="abc123" />
    </div>
</template>

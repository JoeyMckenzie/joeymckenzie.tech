<script lang="ts" setup>
import ApplicationNavbar from '@/Components/ApplicationNavbar.vue';
</script>

<template>
    <div class="mx-auto my-auto max-w-screen-md px-6 lg:px-8">
        <ApplicationNavbar />
        <slot />
        <!--        <Footer commitSha={data.commitSha} nowPlaying={data.nowPlaying} />-->
    </div>
</template>

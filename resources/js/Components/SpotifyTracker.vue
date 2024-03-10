<script lang="ts" setup>
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import SpotifyCurrenlyPlaying from '@/Components/SpotifyCurrenlyPlaying.vue';
import SpotifyNotCurrentlyPlaying from '@/Components/SpotifyNotCurrentlyPlaying.vue';

const page = usePage();
const nowPlaying = computed(() => page.props.spotify);
</script>

<template>
    <SpotifyCurrenlyPlaying
        v-if="nowPlaying.nowPlaying"
        :now-playing="nowPlaying"
    >
        <slot />
    </SpotifyCurrenlyPlaying>
    <SpotifyNotCurrentlyPlaying v-else>
        <slot />
    </SpotifyNotCurrentlyPlaying>
</template>

<style scoped></style>

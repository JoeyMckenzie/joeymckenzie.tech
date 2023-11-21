<script lang="ts" setup>
import SpotifyCurrentlyPlaying from './SpotifyCurrentlyPlaying.vue';
import SpotifyNotPlaying from './SpotifyNotPlaying.vue';
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const page = usePage();

const nowPlaying = computed(() => page.props.spotify);
const isPlaying = computed(() => nowPlaying.value?.nowPlaying);
</script>

<template>
    <SpotifyCurrentlyPlaying v-if="isPlaying" :now-playing="nowPlaying!">
        <slot />
    </SpotifyCurrentlyPlaying>
    <SpotifyNotPlaying v-else>
        <slot />
    </SpotifyNotPlaying>
</template>

<script lang="ts" setup>
import PoweredBy from '@/Components/PoweredBy.vue';
import SocialIcons from '@/Components/SocialIcons.vue';
import SpotifyNowPlaying from '@/Components/SpotifyNowPlaying.vue';
import { Icon } from '@iconify/vue';
</script>

<template>
    <div
        class="max-w-screen-4xl mx-auto mt-auto flex w-full flex-col items-center justify-evenly gap-y-8 p-12 sm:flex-row sm:items-end"
    >
        <SocialIcons />
        <SpotifyNowPlaying>
            <Icon class="h-6 w-6" icon="logos:spotify-icon" />
        </SpotifyNowPlaying>
        <PoweredBy />
    </div>
</template>

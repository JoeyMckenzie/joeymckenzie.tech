<script lang="ts" setup>
import PoweredBy from '@/Components/PoweredBy.vue';
import SocialIcons from '@/Components/SocialIcons.vue';

defineProps<{
    commitSha: string;
}>();
</script>

<template>
    <div
        class="mx-auto mt-auto flex w-full max-w-screen-lg flex-col items-center justify-evenly gap-y-8 p-12 sm:flex-row sm:items-end"
    >
        <SocialIcons />
        <!--<SpotifyNowPlaying {nowPlaying}>
<Icon class="h-6 w-6" icon="logos:spotify-icon" />
</SpotifyNowPlaying>-->
        <PoweredBy :commit-sha="commitSha" />
    </div>
</template>

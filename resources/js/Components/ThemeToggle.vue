<script lang="ts" setup>
import { UseDark } from '@vueuse/components';
import { Button } from '@/Components/ui/button';
import { Icon } from '@iconify/vue';
</script>

<template>
    <UseDark v-slot="{ isDark, toggleDark }">
        <Button variant="ghost" @click="toggleDark()">
            <Icon v-if="isDark" class="h-6 w-6" icon="solar:sun-fog-bold" />
            <Icon v-else class="h-6 w-6" icon="solar:moon-fog-bold" />
        </Button>
    </UseDark>
</template>

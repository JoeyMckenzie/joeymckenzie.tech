<script lang="ts" setup>
import Button from '@/Components/ui/button/Button.vue';
import { Icon } from '@iconify/vue';

type Theme = 'light' | 'dark' | 'system';

const toggleMode = () => {
    const htmlTag = document.getElementsByTagName('html')[0];
    htmlTag.classList.toggle('dark');
};
</script>

<template>
    <Button variant="outline" @click="toggleMode">
        <Icon
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            icon="solar:sun-broken"
        />
        <Icon
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            icon="radix-icons:moon"
        />
        <span class="sr-only">Toggle theme</span>
    </Button>
</template>

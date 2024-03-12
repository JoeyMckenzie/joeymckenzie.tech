<script lang="ts" setup>
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/Components/ui/alert/index.js';
import { Icon } from '@iconify/vue';
import { Note } from '@/types';

defineProps<{
    notes: Note[];
}>();
</script>

<template>
    <div class="pb-4 sm:pb-16">
        <h2
            class="pb-4 pt-8 text-left text-4xl font-bold tracking-tight sm:text-center"
        >
            Note to self.
        </h2>
        <div
            class="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3"
        >
            <Alert v-for="note in notes" :key="note.title">
                <Icon class="h-4 w-4" icon="tabler:terminal" />
                <AlertTitle class="font-bold">{{ note.title }}</AlertTitle>
                <AlertDescription>{{ note.description }}</AlertDescription>
            </Alert>
        </div>
    </div>
</template>

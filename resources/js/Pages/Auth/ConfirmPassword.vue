<script lang="ts" setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import { Head, useForm } from '@inertiajs/vue3';
import route from 'ziggy-js';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';

const form = useForm({
    password: '',
});

const submit = () => {
    form.post(route('password.confirm'), {
        onFinish: () => {
            form.reset();
        },
    });
};
</script>

<template>
    <GuestLayout>
        <Head title="Confirm Password" />

        <div class="mb-4 text-sm text-gray-600">
            This is a secure area of the application. Please confirm your
            password before continuing.
        </div>

        <form @submit.prevent="submit">
            <div>
                <Label for="password" value="Password" />

                <Input
                    id="password"
                    v-model="form.password"
                    autocomplete="current-password"
                    autofocus
                    class="mt-1 block w-full"
                    required
                    type="password"
                />

                <InputError :message="form.errors.password" class="mt-2" />
            </div>

            <div class="mt-4 flex justify-end">
                <Button
                    :class="{ 'opacity-25': form.processing }"
                    :disabled="form.processing"
                    class="ms-4"
                >
                    Confirm
                </Button>
            </div>
        </form>
    </GuestLayout>
</template>

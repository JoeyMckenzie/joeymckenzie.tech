<script lang="ts" setup>
import InputError from '@/Components/InputError.vue';
import { useForm } from '@inertiajs/vue3';
import { nextTick, ref } from 'vue';
import route from 'ziggy-js';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';

const confirmingUserDeletion = ref(false);
const passwordInput = ref<HTMLInputElement | null>(null);

const form = useForm({
    password: '',
});

const confirmUserDeletion = () => {
    confirmingUserDeletion.value = true;

    nextTick(() => passwordInput.value?.focus());
};

const deleteUser = () => {
    form.delete(route('profile.destroy'), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value?.focus(),
        onFinish: () => {
            form.reset();
        },
    });
};

const closeModal = () => {
    confirmingUserDeletion.value = false;

    form.reset();
};
</script>

<template>
    <section class="space-y-6">
        <header>
            <h2 class="text-lg font-medium text-gray-900">Delete Account</h2>

            <p class="mt-1 text-sm text-gray-600">
                Once your account is deleted, all of its resources and data will
                be permanently deleted. Before deleting your account, please
                download any data or information that you wish to retain.
            </p>
        </header>

        <Dialog>
            <DialogTrigger as-child>
                <Button variant="destructive" @click="confirmUserDeletion"
                    >Delete Account
                </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle class="text-lg font-medium text-gray-900"
                        >Are you sure you want to delete your account?
                    </DialogTitle>
                    <DialogDescription class="mt-1 text-sm text-gray-600">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </DialogDescription>
                </DialogHeader>
                <div class="mt-6">
                    <Label class="sr-only" for="password">Password</Label>

                    <Input
                        id="password"
                        ref="passwordInput"
                        v-model="form.password"
                        class="mt-1 block w-full"
                        placeholder="Password"
                        type="password"
                        @keyup.enter="deleteUser"
                    />

                    <InputError :message="form.errors.password" class="mt-2" />
                </div>
                <DialogFooter class="mt-6 flex justify-end">
                    <Button variant="secondary" @click="closeModal">
                        Cancel
                    </Button>

                    <Button
                        :class="{ 'opacity-25': form.processing }"
                        :disabled="form.processing"
                        class="ms-3"
                        type="submit"
                        variant="destructive"
                        @click="deleteUser"
                    >
                        Delete Account
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </section>
</template>

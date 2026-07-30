import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

const appHost = process.env.APP_HOST ?? 'joeymckenzie.test';
const viteHost = process.env.VITE_DEV_HOST ?? 'assets.joeymckenzie.test';
const vitePort = Number(process.env.VITE_PORT ?? 5173);

export default defineConfig({
    server: {
        host: '127.0.0.1',
        port: vitePort,
        strictPort: true,
        cors: true,
        allowedHosts: [appHost, viteHost],
        hmr: {
            host: viteHost,
            clientPort: 443,
            protocol: 'wss',
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                // Nocturne blog design system (JOEY-4.1):
                // Fraunces = display + italic asides, Geist = body/UI, Geist Mono = code/chrome.
                bunny('Fraunces', {
                    weights: [400, 500, 600],
                    styles: ['normal', 'italic'],
                }),
                bunny('Geist', {
                    weights: [400, 500, 600, 700],
                }),
                bunny('Geist Mono', {
                    weights: [400, 500],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
});

import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { readFileSync } from 'node:fs';
import { defineConfig, loadEnv } from 'vite';

const VITE_PORT_BASE = 5273;

function readWorktreeIndex(): number {
    try {
        return (
            Number.parseInt(readFileSync('.devenv-index', 'utf8').trim(), 10) ||
            0
        );
    } catch {
        return 0;
    }
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const viteUrl = new URL(
        env.VITE_APP_URL ?? 'https://assets.joeymckenzie.tech.test',
    );
    const vitePort = VITE_PORT_BASE + readWorktreeIndex();

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                refresh: true,
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
        server: {
            host: '127.0.0.1',
            port: vitePort,
            strictPort: true,
            cors: true,
            origin: viteUrl.origin,
            hmr: {
                host: viteUrl.hostname,
                protocol: 'wss',
                clientPort: Number.parseInt(viteUrl.port, 10) || 443,
            },
        },
    };
});

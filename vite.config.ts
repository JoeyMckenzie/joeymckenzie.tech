import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [sveltekit()],
  assetsInclude: ['**/*.md'],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  server: {
    fs: {
      strict: false,
    },
  },
  resolve: {
    alias: [
      {
        find: 'contentlayer/generated',
        replacement: fileURLToPath(
          new URL('./.contentlayer/generated', import.meta.url),
        ),
      },
    ],
  },
});

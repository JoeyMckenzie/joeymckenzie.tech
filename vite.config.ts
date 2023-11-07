import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

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
  define: {
    'import.meta.env.VERCEL_ANALYTICS_ID': JSON.stringify(
      process.env.VERCEL_ANALYTICS_ID,
    ),
  },
});

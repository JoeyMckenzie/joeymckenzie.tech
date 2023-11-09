import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  assetsInclude: ['**/*.md'],
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

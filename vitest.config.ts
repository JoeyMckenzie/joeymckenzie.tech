import { defineConfig } from 'vitest/config';

// Pure, framework-free units only — no jsdom, no testing-library. The suite
// covers logic that must not depend on CodeMirror or the DOM (JOEY-18.3).
export default defineConfig({
    test: {
        include: ['resources/js/**/*.test.ts'],
    },
});

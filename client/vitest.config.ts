import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: [], // Add setup file if needed for jest-dom matchers
        globals: true // allows describing tests without importing describe, it, expect
    },
});

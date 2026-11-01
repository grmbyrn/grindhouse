import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['backend/tests/**/*.test.ts'],
        setupFiles: ['backend/tests/setup.ts'],
        // The first run downloads a MongoDB binary for mongodb-memory-server
        hookTimeout: 120_000,
    },
})

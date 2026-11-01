/// <reference types="vitest/config" />
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': 'http://localhost:5000',
            '/uploads': 'http://localhost:5000',
        },
    },
    build: {
        outDir: 'build',
        rolldownOptions: {
            output: {
                // Libraries change less often than app code, so they get their own chunks that stay
                // cached across deploys. Higher priority wins when a module matches several groups.
                codeSplitting: {
                    groups: [
                        {
                            name: 'react',
                            test: /node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/,
                            priority: 3,
                        },
                        {
                            name: 'ui',
                            test: /node_modules[\\/](@radix-ui|radix-ui|lucide-react|embla-carousel[^\\/]*|cn|class-variance-authority)[\\/]/,
                            priority: 2,
                        },
                        { name: 'vendor', test: /node_modules/, priority: 1 },
                    ],
                },
            },
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
    },
})

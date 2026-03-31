import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost', // 🔥 THIS FIXES YOUR ERROR
        },
         // ✅ Add this — fixes file watching on Windows + Docker
        watch: {
            usePolling: true,
            interval: 1000, // check every 1 second
        },
    },
})
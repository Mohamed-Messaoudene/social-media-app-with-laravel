import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// ✅ recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.tsx"],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
        },
    },
    // ✅ Tell Vite to pre-bundle heavy deps ahead of time
    optimizeDeps: {
        include: [
            "emoji-picker-react",
            "@mui/material",
            "@mui/icons-material",
            "@inertiajs/react",
        ],
    },
    server: {
        host: "0.0.0.0",
        port: 5173,
        strictPort: true,
        hmr: {
            host: "localhost",
        },
        watch: {
            usePolling: true,
            interval: 1000,
        },
    },
});

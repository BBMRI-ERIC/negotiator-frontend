import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const PROXY_TARGET = 'http://localhost:8081'
const isDev = false

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: 8080,
        proxy: isDev ? {
            '^/api': {
                target: PROXY_TARGET,
                changeOrigin: true,
            },
        } : undefined,
    }
});

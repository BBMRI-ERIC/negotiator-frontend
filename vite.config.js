import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const PROXY_TARGET = 'http://localhost:8090'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: 8080,
        proxy: {
            '^/api': {
                target: PROXY_TARGET,
                changeOrigin: true
            }
        }
    }
});

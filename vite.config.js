import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from 'unplugin-vue-components/vite'
import { BootstrapVueNextResolver } from 'unplugin-vue-components/resolvers'

const PROXY_TARGET = 'http://localhost:8081'

export default defineConfig({
    plugins: [
        vue(),
        Components({
        resolvers: [BootstrapVueNextResolver()]
        })
    ],
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

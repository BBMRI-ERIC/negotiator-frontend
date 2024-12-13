import { fileURLToPath, URL } from "node:url"

import { defineConfig,loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import { BootstrapVueNextResolver } from "unplugin-vue-components/resolvers"
import git from "git-rev-sync"

const PROXY_TARGET = "http://localhost:8081"

export default defineConfig(({ command }) =>{
  if (command === 'serve') {
    // dev specific config
    process.env.VITE_GIT_TAG = git.tag()
  } else {
    // build specific config
    process.env.VITE_GIT_TAG = git.tag()
    // remove this line to build localy
    process.env.VITE_GIT_COMMIT_HASH = git.short()
  }


  return {
    plugins: [
      vue(),
      Components({
        resolvers: [BootstrapVueNextResolver()]
      })
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    server: {
      port: 8080,
      proxy: {
        "^/api": {
          target: PROXY_TARGET,
          changeOrigin: true
        }
      }
    }
  }
})

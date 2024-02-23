import { createApp } from "vue"
import App from "./App.vue"
import Vue3Tour from 'vue3-tour'
import VueMatomo from 'vue-matomo'
import router from "./router"
import store from "./store"
import { sync } from "vuex-router-sync"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faDownload, faPencil, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue-next/dist/bootstrap-vue-next.css"
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"
import 'vue3-tour/dist/vue3-tour.css'
import matomo from "./config/matomo.js" 
import activeTheme from "./config/theme.js" 

library.add(faSpinner)
library.add(faPencil)
library.add(faTrash)
library.add(faDownload)

const app = createApp(App).use(VueMatomo, {
    host: matomo.matomoHost,
    siteId: matomo.matomoId,
  })

app.use(router)
app.use(store)
app.use(Vue3Tour)

app.component("FontAwesomeIcon", FontAwesomeIcon)

sync(store, router)

app.mount("#app")

window._paq.push(['trackPageView']); // To track a page view

import (`./assets/scss/theme-${activeTheme.activeThemeFile}.scss`)

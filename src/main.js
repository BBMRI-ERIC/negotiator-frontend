import { createApp } from "vue"
import App from "./App.vue"
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

library.add(faSpinner)
library.add(faPencil)
library.add(faTrash)
library.add(faDownload)

let matomoHost = ''
let matomoSiteId = 0
if(window.location.origin === 'http://localhost:8080') {
    matomoHost = 'https://matomo.bbmri-eric.eu/'
    matomoSiteId = 1
}else if(window.location.origin === 'https://negotiator.acc.bbmri-eric.eu') {
    matomoHost = 'https://negotiator.acc.bbmri-eric.eu'
    matomoSiteId = 2
}else if(window.location.origin === 'https://negotiator.bbmri-eric.eu') {
    matomoHost = 'https://negotiator.bbmri-eric.eu'
    matomoSiteId = 3
}

const app = createApp(App).use(VueMatomo, {
    host: matomoHost,
    siteId: matomoSiteId,
  })

app.use(router)
app.use(store)


app.component("FontAwesomeIcon", FontAwesomeIcon)

sync(store, router)

app.mount("#app")

window._paq.push(['trackPageView']); // To track a page view

import "./assets/scss/bbmri.scss"

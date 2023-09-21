import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import { sync } from "vuex-router-sync"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faPencil, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue-next/dist/bootstrap-vue-next.css"
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"

library.add(faSpinner)
library.add(faPencil)
library.add(faTrash)

const app = createApp(App)

app.use(router)
app.use(store)


app.component("FontAwesomeIcon", FontAwesomeIcon)

sync(store, router)

app.mount("#app")

import "./assets/scss/bbmri.scss"

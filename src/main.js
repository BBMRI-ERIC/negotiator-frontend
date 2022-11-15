import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { sync } from 'vuex-router-sync'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { authService } from "./auth.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSpinner)

const app = createApp(App);

app.config.globalProperties.$auth = authService

app.use(router);
app.use(store)

app.component('font-awesome-icon', FontAwesomeIcon)

sync(store, router)

app.mount("#app");

import './assets/scss/bbmri.scss'

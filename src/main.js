import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { sync } from 'vuex-router-sync'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { library } from "@fortawesome/fontawesome-svg-core";
import {faPencil, faSpinner, faTrash} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSpinner)
library.add(faPencil)
library.add(faTrash)

const app = createApp(App);

app.use(router);
app.use(store)

app.component('font-awesome-icon', FontAwesomeIcon)

sync(store, router)

app.mount("#app");

import './assets/scss/bbmri.scss'

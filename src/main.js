import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { authService } from "./auth.js";

const app = createApp(App);

app.config.globalProperties.$auth = authService

app.use(router);

app.mount("#app");

import './assets/scss/bbmri.scss'

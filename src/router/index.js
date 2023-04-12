import { createRouter, createWebHistory } from "vue-router";
import OidcCallback from '@/components/OidcCallback.vue'
import HomePage from "../views/HomePage.vue";
import Login from "@/components/Login.vue";
import store from '@/store'
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc'



const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomePage,
            meta: { isPublic: true }
        },
        {
            path: '/logged-in',
            name: 'oidcCallback',
            component: OidcCallback,
            meta: { isPublic: true }
        },
        {
            path: "/requests/:requestId",
            name: "request",
            component: HomePage,
            meta: { isPublic: false }
        },
        {
            path: "/login",
            name: "login",
            component: Login,
            meta: { isPublic: true }
        }
    ],
});

router.beforeEach(vuexOidcCreateRouterMiddleware(store))

export default router;

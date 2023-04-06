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
        },
        {
            path: '/logged-in', // Needs to match redirectUri (redirect_uri if you use snake case) in you oidcSettings
            name: 'oidcCallback',
            component: OidcCallback
        },
        {
            path: "/requests/:requestId",
            name: "request",
            component: HomePage,
            meta: { requiresAuth: true }
        },
        {
            path: "/login",
            name: "login",
            component: Login
        }
    ],
});

router.beforeEach(vuexOidcCreateRouterMiddleware(store))

export default router;

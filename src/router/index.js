import { createRouter, createWebHistory } from "vue-router"
import OidcCallback from "@/components/OidcCallback.vue"
import HomePage from "../views/HomePage.vue"
import NegotiationCreatePage from "../views/NegotiationCreatePage.vue"
import NegotiationPage from "../views/NegotiationPage.vue"
import FaqPage from "../views/FaqPage.vue"
import store from "@/store"
import { vuexOidcCreateRouterMiddleware } from "vuex-oidc"
import UserPage from "@/views/UserPage.vue"
import { ROLES } from "@/config/consts"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: "/",
    name: "home",
    component: HomePage,
    meta: { isPublic: true }
  }, {
    path: "/logged-in",
    name: "oidcCallback",
    component: OidcCallback,
    meta: { isPublic: true }
  }, {
    path: "/requests/:requestId",
    name: "request",
    component: NegotiationCreatePage
  }, {
    path: "/researcher",
    name: "researcher",
    component: UserPage,
    props: { userRole: ROLES.RESEARCHER },
    meta: { isPublic: false }
  }, {
    path: "/biobanker",
    name: "biobanker",
    component: UserPage,
    props: { userRole: ROLES.REPRESENTATIVE },
    meta: { isPublic: false }
  }, {
    path: "/admin",
    name: "admin",
    component: UserPage,
    props: { userRole: ROLES.ADMINISTRATOR },
    meta: { isPublic: false }
  },
   {
    path: "/FAQ",
    name: "FAQ",
    component: FaqPage,
    meta: { isPublic: true }
  },
   {
    path: "/negotiations/:negotiationId/:userRole",
    name: "negotiation-page",
    component: NegotiationPage,
    props: true
  }]
})

router.beforeEach(vuexOidcCreateRouterMiddleware(store))

export default router

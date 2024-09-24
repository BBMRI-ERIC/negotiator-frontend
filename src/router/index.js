import { createRouter, createWebHistory } from "vue-router"
import OidcCallback from "@/components/OidcCallback.vue"
import HomePage from "../views/HomePage.vue"
import NegotiationCreatePage from "../views/NegotiationCreatePage.vue"
import NegotiationPage from "../views/NegotiationPage.vue"
import FaqPage from "../views/FaqPage.vue"
import NetworksPage from "../views/NetworksPage.vue"
import AdminSettingsPage from "../views/AdminSettingsPage.vue"
import UserPage from "@/views/UserPage.vue"
import ErrorPage from "@/views/ErrorPage.vue"
import { ROLES } from "@/config/consts"
import { useUserStore } from "../store/user.js"
import hasUser from "@/middlewares/hasUser.js"
import middlewarePipeline from "@/middlewares/middleware-pipeline.js"

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
    component: NegotiationCreatePage,
    meta: { middleware: [hasUser] }
  }, {
    path: "/researcher",
    name: "researcher",
    component: UserPage,
    props: { userRole: ROLES.RESEARCHER },
    meta: { isPublic: false, middleware: [hasUser] }
  }, {
    path: "/biobanker",
    name: "biobanker",
    component: UserPage,
    props: { userRole: ROLES.REPRESENTATIVE },
    meta: { isPublic: false, middleware: [hasUser] }
  }, {
    path: "/admin",
    name: "admin",
    component: UserPage,
    props: { userRole: ROLES.ADMINISTRATOR },
    meta: { isPublic: false, middleware: [hasUser] }
  },
  {
    path: "/FAQ",
    name: "FAQ",
    component: FaqPage,
    meta: { isPublic: true, middleware: [hasUser] }
  },
  {
    path: "/networks",
    name: "networks",
    component: NetworksPage,
    meta: { isPublic: false, middleware: [hasUser] }
  },
  {
    path: "/settings",
    name: "settings",
    component: AdminSettingsPage,
    meta: { isPublic: false, middleware: [hasUser] }
  },
  {
    path: "/negotiations/:negotiationId/:userRole",
    name: "negotiation-page",
    component: NegotiationPage,
    props: true,
    meta: { middleware: [hasUser] }
  },
  {
    path: "/networks/:networkId",
    name: "networks-page",
    component: NetworksPage,
    props: true,
    meta: { isPublic: false }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "error-page",
    component: ErrorPage,
    props: true,
    meta: { isPublic: false }
  }
]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (!to.meta.middleware) {
    return next()
  }

  const middleware = to.meta.middleware
  const context = {
    to,
    from,
    next,
    userStore
  }

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  })
})
export default router

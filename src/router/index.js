import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import { authService } from '../auth'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    }
  ],
});

router.beforeEach((to) => {
  console.log('Redirection...')
  console.log(to)
  console.log(window)
  // Here we handle the login redirect and than send the user to the "/" route.
  if (to.path === '/redirect')   {
    console.log('HERE')
    // Inform the authentication service that a user logged in. Afterwards we send the user to the main page
    authService.handleLoginRedirect()
      .then(() => {
        console.log(authService.getAccessToken())
        router.push('/')
      })
      .catch(error => {
        console.log(error)
        router.push('/')
      })
  }
})

export default router;

import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import { authService } from '@/auth'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomePage,
        },
        {
            path: "/requests/:requestId",
            name: "request",
            component: HomePage,
        }
    ],
});

router.beforeEach((to) => {
    // Here we handle the login redirect and than send the user to the "/" route.
    if (to.path === '/login') {
        // Inform the authentication service that a user logged in. Afterwards we send the user to the main page
        authService.handleLoginRedirect()
            .then((user) => {
                router.push(user.state.previousPath)
            })
            .catch(error => {
                console.log(error)
                router.push('/')
            })
    }
})

export default router;

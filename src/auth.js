import { UserManager, WebStorageStateStore } from 'oidc-client-ts'

/**
 * Config for the oidc client.
 */
// const settings = {
//     // Where the tokens will be stored
//     userStore: new WebStorageStateStore({ store: window.sessionStorage }),
//     // URL to the authentication server (including realm)
//     authority: 'https://login.bbmri-eric.eu/oidc/',
//     // The name of the client in Keycloak setup for this service
//     client_id: '5b0bed7f-eb53-4773-86de-8a47f48cd9bd',
//     // Where to redirect the user to after successful authentication
//     redirect_uri: 'http://negotiator-dev2.vm.cesnet.cz/login',
//     // Where to redirect the user to after logging the user out
//     post_logout_redirect_uri: 'http://negotiator-dev2.vm.cesnet.cz/',
//     // Indicate the the authorization code flow should be used
//     response_type: 'code',
//     // "openid" tells the server that this client uses oidc for authentication
//     scope: 'openid profile email offline_access eduperson_entitlement negotiator_api',
//     // Enable automatic (silent) renewal of the access token
//     automaticSilentRenew: true
// }

const settings = {
    // Where the tokens will be stored
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    // URL to the authentication server (including realm)
    authority: 'AUTH_URL_PLACEHOLDER',
    // The name of the client in Keycloak setup for this service
    client_id: 'CLIENT_ID_PLACEHOLDER',
    // Where to redirect the user to after successful authentication
    redirect_uri: 'REDIRECT_URI_PLACEHOLDER',
    // Where to redirect the user to after logging the user out
    post_logout_redirect_uri: 'LOGOUT_URI_PLACEHOLDER',
    // Indicate the the authorization code flow should be used
    response_type: 'code',
    // "openid" tells the server that this client uses oidc for authentication
    scope: 'openid profile email offline_access eduperson_entitlement negotiator_api',
    // Enable automatic (silent) renewal of the access token
    automaticSilentRenew: true
}

let userManager = new UserManager(settings)

/**
* Class to encapsulate all authentication related logic.
*/
class AuthService {
    /**
     * Initate the login process.
     */
    login() {
        userManager.signinRedirect()
            .catch(error => console.log(error))
    }

    logout() {
        userManager.signoutRedirect()
            .catch(error => console.log(error))
    }

    /**
     * Handles the redirect from the OAuth server after a user logged in.
     */
    handleLoginRedirect() {
        return userManager.signinRedirectCallback()
    }

    /**
     * Handles the redirect from the OAuth server after a user logged out.
     */
    handleLogoutRedirect() {
        return userManager.signoutRedirectCallback()
    }

    /**
     * Checks whether or not a user is currently logged in.
     *
     * Returns a promise which will be resolved to true/false or be rejected with an error.
     */
    isUserLoggedIn() {
        return new Promise((resolve, reject) => {
            userManager.getUser()
                .then(user => {
                    if (user === null || user.expired ) {
                        resolve(false)
                    }
                    resolve(true)
                })
                .catch(error => reject(error))
        })
    }

    /**
     * Get the profile data for the currently authenticated user.
     *
     * Returns an empty object if no user is logged in.
     */
    getProfile() {
        return new Promise((resolve, reject) => {
            userManager.getUser()
                .then(user => {
                    if (user === null  || user.expired) {
                        resolve(null)
                    }
                    resolve(user.profile)
                })
                .catch(error => reject(error))
        })
    }

    /**
     * Get the access token.
     *
     * Can be used to make requests to the backend.
     */
    getAccessToken() {
        return new Promise((resolve, reject) => {
            userManager.getUser()
                .then(user => {
                    resolve(user.access_token)
                })
                .catch(error => reject(error))
        })
    }

    async obtainToken() {
        const a = await this.getAccessToken()
        return a
    }

    async checkLogged() {
        return await (await (this.isUserLoggedIn()))
    }


}


/**
* Create and expose an instance of the auth service.
*/
export const authService = new AuthService()

// /**
//  * Default export to register the authentication service in the global Vue instance.
//  *
//  * This allows us to reference it using "this.$auth" whenever we are inside of a Vue context.
//  */
// export default {
//   install: function (Vue) {
//     Vue.prototype.$auth = authService
//   }
// }
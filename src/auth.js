import {UserManager, WebStorageStateStore} from 'oidc-client-ts'

const dev_settings = {
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    authority: 'http://localhost:4011/',
    loadUserInfo: true,
    user_info_endpoint: 'http://localhost:4011/connect/userinfo',
    client_id: 'client-credentials-mock-client',
    client_secret: 'authorization-code-with-pkce-client-secret',
    redirect_uri: 'http://localhost:8080/login',
    post_logout_redirect_uri: 'http://localhost:8080',
    response_type: 'code',
    scope: 'openid profile email permissions',
    automaticSilentRenew: true,

}
const prod_settings = {
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    authority: 'AUTH_URL_PLACEHOLDER',
    client_id: 'CLIENT_ID_PLACEHOLDER',
    redirect_uri: 'REDIRECT_URI_PLACEHOLDER',
    post_logout_redirect_uri: 'LOGOUT_URI_PLACEHOLDER',
    response_type: 'code',
    scope: 'openid profile email offline_access eduperson_entitlement negotiator_api',
    automaticSilentRenew: true
}
let settings = prod_settings
if (import.meta.env.DEV) {
    settings = dev_settings
}

let userManager = new UserManager(settings)

/**
* Class to encapsulate all authentication related logic.
*/
class AuthService {
    /**
     * Initate the login process.
     */
    login(currenPath) {
        userManager.signinRedirect({
            state: {
                previousPath: currenPath
            }
        }).catch(error => console.log(error))
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
                    if (user === null || user.expired) {
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
                    if (user === null || user.expired) {
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
                    console.log(user.access_token)
                    resolve(user.access_token)
                })
                .catch(error => reject(error))
        })
    }


}

/**
* Create and expose an instance of the auth service.
*/
export const authService = new AuthService()

import Vuex from "vuex"

import { vuexOidcCreateStoreModule } from "vuex-oidc"
import oidcSettings from "../config/oidc"

import state from "./state"
import mutations from "./mutations"
import getters from "./getters"
import actions from "./actions"

export default new Vuex.Store({
  modules: {
    oidc: vuexOidcCreateStoreModule(oidcSettings,
    // Optional OIDC store settings
    {  removeUserWhenTokensExpire: false },
    // Optional OIDC event listeners
    // {
    //   userLoaded: (user) => console.log('OIDC user is loaded:', user),
    //   userUnloaded: () => console.log('OIDC user is unloaded'),
    //   accessTokenExpiring: () => console.log('Access token will expire'),
    //   accessTokenExpired: () => console.log('Access token did expire'),
    //   silentRenewError: () => console.log('OIDC user is unloaded'),
    //   userSignedOut: () => console.log('OIDC user is signed out'),
    // }
      ),
    
  },
  state,
  mutations,
  actions,
  getters,
  strict: false
})

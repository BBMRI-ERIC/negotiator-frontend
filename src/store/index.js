
import Vuex from 'vuex'

import { vuexOidcCreateStoreModule } from 'vuex-oidc'
import oidcSettings from '../config/oidc'


import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

export default new Vuex.Store({
    modules: {
        oidcStore: vuexOidcCreateStoreModule(oidcSettings, { publicRoutePaths: ['/'] })
    },
    state,
    mutations,
    actions,
    getters,
    strict: false
})

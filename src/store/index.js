
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: false
})

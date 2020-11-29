import { createStore } from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'

export default createStore({
  state,
  mutations,
  actions,
  getters
})

import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
export default createStore({
  state: {
    username: '',
    token: '',
  },
  getters: {
  },
  mutations: {
    setUsername(state, val) {
      state.username = val
    },
    setToken(state, val) {
      state.token = val
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [new VuexPersistence().plugin]
})

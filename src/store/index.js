import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
export default createStore({
  state: {
    username: '',
  },
  getters: {
  },
  mutations: {
    setUsername(state, val) {
      state.username = val
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [new VuexPersistence().plugin]
})

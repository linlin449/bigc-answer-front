import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
export default createStore({
  state: {
    username: "",
    role: 1, // 学生 - 1 老师 - 2 管理员 - 3
    token: "",
    currentChapterId:""
  },
  getters: {},
  mutations: {
    setcurrentChapter(state,val){
      state.currentChapterId=val
    },
    setUsername(state, val) {
      state.username = val;
    },
    setRole(state, val) {
      state.role = val;
    },
    setToken(state, val) {
      state.token = val;
    },
  },
  actions: {},
  modules: {},
  plugins: [new VuexPersistence().plugin],
});

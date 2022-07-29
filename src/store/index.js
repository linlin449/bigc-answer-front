import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
export default createStore({
  state: {
    username: "",
    role: 1, // 学生 - 1 老师 - 2 管理员 - 3
    token: "",
    isAdd:true,//true 是添加题目
    chapterId:1,
    questionId:"",
    wrongQuestionList:"",
  },
  getters: {},
  mutations: {
    setwrongQuestionList(state,value){
      state.wrongQuestionList=""
      state.wrongQuestionList=value
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
    setIsAdd(state,val){
      state.isAdd=val
    },
    setchapterId(state,val){
      state.chapterId=val
    },
    setquestionId(state,val){
      state.questionId=val
    }
  },
  actions: {},
  modules: {},
  plugins: [new VuexPersistence().plugin],
});

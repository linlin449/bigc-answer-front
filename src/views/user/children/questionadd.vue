<template>
<div>
<md-editor v-model="text" :toolbars="toobars"  :previewOnly="isEdit"/>
<el-button type="primary"  @click="edit">编辑</el-button>
</div>
    
</template>
<script setup>
import {
  reactive,
  watch,
  shallowRef,
  onBeforeUnmount,
  ref,
  onMounted,
  onUnmounted
} from "vue";

import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";

import { useRouter } from "vue-router";
import link from "../../../api/link.js";
import url from "../../../api/url.js";
import code from "../../../api/code.js";
import sortQuestion from "../../../util/sortQuestion.js";
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { useStore } from 'vuex';
const text = ref("Hello Editor!");
let questionAllInfo = reactive({});
const store = useStore();
let isEdit=ref(true)
let isbutton=ref(false)
let edit=()=>{
  isEdit.value=!isEdit.value
  isbutton.value=true
}

let toobars=ref([  'revoke',"katex",
      'next','image','save']);
//回显数据
let getQuestionAllInfo = async () => {
  let response = await link(url.question.getQuestionById);
  if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(response.data.msg);
    return;
  }
  let responseOne = await link(url.questionOption.get);
  let responseTwo = await link(url.questionRightAnswer.get);
  questionAllInfo.question = response.data.data;
  questionAllInfo.questionOption = responseOne.data.data;
  questionAllInfo.questionRightAnswer = responseTwo.data.data;
};
let updateQuestionAllInfo = async () => {
  let responseOne = await link(url.question.update, "put",questionAllInfo.question);
   if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error("添加失败");
    return;
  }
  let responseTwo = await link(
    url.questionOption.update,"put",
    questionAllInfo.questionOption
  );
  let responseThree = await link(
    url.questionRightAnswer.update,"put",
    questionAllInfo.questionRightAnswer
  );
 
};
let addQuestionAllInfo = async () => {
  let responseOne = await link(url.question.add,"post", questionAllInfo.question);
  if(responseOne.data.code!== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error("添加失败");
    return;
  }
  questionAllInfo.questionOption.questionId=responseOne.data.questionId
  let responseTwo = await link(
    url.questionOption.add,"post",
    questionAllInfo.questionOption
  );
  let responseThree = await link(
    url.questionRightAnswer.add,"post",
    questionAllInfo.questionRightAnswer
  );
};


// onMounted(() => {
//   if(store.state.isAdd){
//     questionAllInfo={}
//     return
//   }
//   getQuestionAllInfo()
// });
// onUnmounted(()=>{
//   store.commit("setIsAdd",true)
// })
</script>
<style lang="scss" scoped>
.add {
  padding: 0px 40px;
  width: 400px;
}
#box {
  width: 980px;
}
</style>

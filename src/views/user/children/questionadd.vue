<template>
  <div>
    <md-editor editorId="one" v-model="text[0]" :previewOnly="true" />
    <el-button text @click="buttonClick(0)">click to open the Dialog</el-button>

    <md-editor editorId="two" v-model="text[1]" :previewOnly="true" />
    <el-button text @click="buttonClick(1)">click to open the Dialog</el-button>

    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="30%"
      @open="open"
      :before-close="handleClose"
    >
      <md-editor editorId="no" :toolbars="toolbars" v-model="editInfo" />
      <el-button text @click="text[id]=editInfo;dialogVisible=false">保存</el-button>
      <el-button text @click="dialogVisible=false">退出</el-button>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from "vue";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
const dialogVisible = ref(false);

const text = ref(["hello1", "hello2"]);
let toolbars = ["revoke", "katex", "next", "image", "save"];
const id = ref(1);
let editInfo=ref("")
let buttonClick = (index) => {
  id.value = index;
  dialogVisible.value = true;
};
let open = () => {
  editInfo.value=text.value[id.value]

};

// import {
//   reactive,
//   watch,
//   shallowRef,
//   onBeforeUnmount,
//   ref,
//   onMounted,
//   onUnmounted
// } from "vue";

// import MdEditor from 'md-editor-v3';
// import 'md-editor-v3/lib/style.css';

// import { useRouter } from "vue-router";
// import link from "../../../api/link.js";
// import url from "../../../api/url.js";
// import code from "../../../api/code.js";
// import sortQuestion from "../../../util/sortQuestion.js";
// import { ElMessage } from "element-plus";
// import { ArrowDown } from "@element-plus/icons-vue";
// import { useStore } from 'vuex';
// const text = ref("Hello Editor!");
// let questionAllInfo = reactive({});
// const store = useStore();
// let isEdit=ref(true)
// let isbutton=ref(false)
// let edit=()=>{
//   isEdit.value=!isEdit.value
//   console.log(isEdit.value)
//   isbutton.value=true
// }

// let toobars=['revoke',"katex",
//       'next','image','save']
//回显数据
// let getQuestionAllInfo = async () => {
//   let response = await link(url.question.getQuestionById);
//   if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
//     ElMessage.error(response.data.msg);
//     return;
//   }
//   let responseOne = await link(url.questionOption.get);
//   let responseTwo = await link(url.questionRightAnswer.get);
//   questionAllInfo.question = response.data.data;
//   questionAllInfo.questionOption = responseOne.data.data;
//   questionAllInfo.questionRightAnswer = responseTwo.data.data;
// };
// let updateQuestionAllInfo = async () => {
//   let responseOne = await link(url.question.update, "put",questionAllInfo.question);
//    if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
//     ElMessage.error("添加失败");
//     return;
//   }
//   let responseTwo = await link(
//     url.questionOption.update,"put",
//     questionAllInfo.questionOption
//   );
//   let responseThree = await link(
//     url.questionRightAnswer.update,"put",
//     questionAllInfo.questionRightAnswer
//   );

// };
// let addQuestionAllInfo = async () => {
//   let responseOne = await link(url.question.add,"post", questionAllInfo.question);
//   if(responseOne.data.code!== ErrorCode.NORMAL_SUCCESS) {
//     ElMessage.error("添加失败");
//     return;
//   }
//   questionAllInfo.questionOption.questionId=responseOne.data.questionId
//   let responseTwo = await link(
//     url.questionOption.add,"post",
//     questionAllInfo.questionOption
//   );
//   let responseThree = await link(
//     url.questionRightAnswer.add,"post",
//     questionAllInfo.questionRightAnswer
//   );
// };

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
<style scoped></style>

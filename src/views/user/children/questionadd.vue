<template>
  <div class="add">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="form.teacherName"></el-input>
      </el-form-item>
      <el-form-item label="学院">
        <el-input v-model="form.institute"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="form.sex"></el-input>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="form.tel"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.pwd"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="form.cardId"></el-input>
      </el-form-item>
      <el-form-item label="职称">
        <el-input v-model="form.type"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">立即创建</el-button>
        <el-button type="text" @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
      @ready="onEditorReady($event)"
    >
    </quill-editor>
  </div>
  <div id="box" style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
  <md-editor v-model="text" />
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
import questionVue from "./question.vue.js";
const text = ref("Hello Editor!");
let questionAllInfo = reactive({});
const store = useStore();
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
  let responseTwo = await link(
    url.questionOption.update,"put",
    questionAllInfo.questionOption
  );
  let responseThree = await link(
    url.questionRightAnswer.update,"put",
    questionAllInfo.questionRightAnswer
  );
  if (response.data.code !== ErrorCode.NORMAL_SUCCESS&&) {
    ElMessage.error("添加失败");
    return;
  }
};
let addQuestionAllInfo = async () => {
  let responseOne = await link(url.question.add,"post", questionAllInfo.question);
  let responseTwo = await link(
    url.questionOption.add,"post",
    questionAllInfo.questionOption
  );
  let responseThree = await link(
    url.questionRightAnswer.add,"post",
    questionAllInfo.questionRightAnswer
  );
};


onMounted(() => {
  if(store.state.isAdd){
    questionAllInfo={}
    return
  }
  getQuestionAllInfo()
});
onUnmounted(()=>{
  store.commit("setIsAdd",true)
})
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

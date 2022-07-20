<template>
  <div id="qadd">
    <div class="main">
      <el-dialog
        v-model="dialogVisible"
        title="Tips"
        width="30%"
        @open="open"
        :before-close="handleClose"
      >
        <md-editor editorId="no" :toolbars="toolbars" v-model="editInfo" />
        <el-button text @click="saveInfo">保存</el-button>
        <el-button text @click="dialogVisible = false">退出</el-button>
      </el-dialog>
      <el-form label-width="120px">
        <el-form-item label="题干">
          <md-editor
            editorId="one"
            v-model="text.question"
            :previewOnly="true"
          />
          <el-button
            type="primary"
            class="option"
            @click="buttonClick('question')"
            >编辑</el-button
          >
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="text.describe" />
        </el-form-item>
        <el-form-item label="成绩">
          <el-input v-model="text.score" />
        </el-form-item>

        <el-form-item label="课程">
          <el-select placeholder="请选择课程">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
          <el-form-item label="章节">
            <el-select placeholder="请选择章节">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
        </el-form-item>

        <el-form-item label="题型">
          <el-radio-group v-model="text.type">
            <el-radio label="单选" />
            <el-radio label="多选" />
            <el-radio label="简答" />
          </el-radio-group>
          <el-form-item label="难度">
            <el-radio-group v-model="text.level">
              <el-radio label="简单" />
              <el-radio label="中等" />
              <el-radio label="困难" />
            </el-radio-group>
          </el-form-item>
        </el-form-item>

        <el-form-item label="选项" v-if="text.type != '简答'">
          <md-editor
            class="option"
            editorId="two"
            v-model="text.A"
            :previewOnly="true"
          />
          <el-button class="option" type="primary" @click="buttonClick('A')"
            >编辑</el-button
          >
          <md-editor
            class="option"
            editorId="two"
            v-model="text.B"
            :previewOnly="true"
          />
          <el-button class="option" type="primary" @click="buttonClick('B')"
            >编辑</el-button
          >
          <md-editor
            class="option"
            editorId="two"
            v-model="text.C"
            :previewOnly="true"
          />
          <el-button class="option" type="primary" @click="buttonClick('C')"
            >编辑</el-button
          >
          <md-editor
            class="option"
            editorId="two"
            v-model="text.D"
            :previewOnly="true"
          />
          <el-button class="option" type="primary" @click="buttonClick('D')"
            >编辑</el-button
          >
          <template v-if="text.type == '多选'">
            <md-editor
              class="option"
              editorId="two"
              v-model="text.E"
              :previewOnly="true"
            />
            <el-button class="option" type="primary" @click="buttonClick('E')"
              >编辑</el-button
            >
            <md-editor
              class="option"
              editorId="two"
              v-model="text.F"
              :previewOnly="true"
            />
            <el-button class="option" type="primary" @click="buttonClick('F')"
              >编辑</el-button
            >
          </template>
        </el-form-item>
        <el-form-item label="答案">
          <md-editor editorId="two" v-model="text.answer" :previewOnly="true" />
          <el-button
            type="primary"
            class="option"
            @click="buttonClick('answer')"
            >编辑</el-button
          >
        </el-form-item>
        <el-form-item label="解析">
          <md-editor
            editorId="two"
            v-model="text.analysis"
            :previewOnly="true"
          />
          <el-button
            type="primary"
            class="option"
            @click="buttonClick('analysis')"
            >编辑</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="unSave">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
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
  onUnmounted,
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
import { useStore } from "vuex";

const onSubmit = () => {
  console.log(text.value);
};

const dialogVisible = ref(false);

const text = ref({
  question: "题干",
  describe: "",
  score: "",
  level: "简单",
  type: "单选",
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  answer: "答案",
  analysis: "解析",
});
let toolbars = ["revoke", "katex", "next", "image"];
const item = ref("question");
let editInfo = ref("");
let buttonClick = (name) => {
  item.value = name;
  dialogVisible.value = true;
};
let open = () => {
  let arr = ["A", "B", "C", "D", "E", "F", "题干", "答案", "解析"];
  if (arr.includes(text.value[item.value])) {
    editInfo.value = "";
    return;
  }
  editInfo.value = text.value[item.value];
};
let unSave=()=>{
  
}
let saveInfo = () => {
  if (editInfo.value === "") {
    if (item.value === "question") {
      text.value[item.value] = "题干";
    } else if (item.value === "answer") {
      text.value[item.value] = "答案";
    } else if (item.value === "analysis") {
      text.value[item.value] = "解析";
    } else {
      text.value[item.value] = item.value;
    }
    dialogVisible.value = false;
    return;
  }
  text.value[item.value] = editInfo.value;
  dialogVisible.value = false;
};
const store = useStore();
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
  let responseOne = await link(
    url.question.update,
    "put",
    questionAllInfo.question
  );
  if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error("添加失败");
    return;
  }
  let responseTwo = await link(
    url.questionOption.update,
    "put",
    questionAllInfo.questionOption
  );
  let responseThree = await link(
    url.questionRightAnswer.update,
    "put",
    questionAllInfo.questionRightAnswer
  );
};
let addQuestionAllInfo = async () => {
  let responseOne = await link(
    url.question.add,
    "post",
    questionAllInfo.question
  );
  if (responseOne.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error("添加失败");
    return;
  }
  questionAllInfo.questionOption.questionId = responseOne.data.questionId;
  let responseTwo = await link(
    url.questionOption.add,
    "post",
    questionAllInfo.questionOption
  );
  let responseThree = await link(
    url.questionRightAnswer.add,
    "post",
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
onUnmounted(() => {
  store.commit("setIsAdd", true);
});
</script>
<style scoped>
#qadd {
  width: 800px;
  margin: 0 auto;
}
.el-form-item {
  margin-top: 0px;
}
.option {
  margin-top: 10px;
}
</style>

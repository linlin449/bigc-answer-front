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
          <el-select
            placeholder="请选择课程"
            v-model="subjectId"
            @change="changeSubject(subjectId)"
          >
            <el-option
              v-for="v in MenuData.data"
              :key="v.subjectId"
              :label="v.subjectname"
              :value="v.subjectId"
            />
          </el-select>
          <el-form-item label="章节">
            <el-select placeholder="请选择章节" v-model="chapterId">
              <el-option
                v-for="v in chapters.data"
                :key="v.id"
                :label="v.name"
                :value="v.id"
              />
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
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { useStore } from "vuex";
import sortQuestion from "../../../util/sortQuestion.js";
const ErrorCode = code;
const MenuData = ref({ data: [] });
let subjectId = ref();
let chapters = reactive({ data: [] });
let chapterId = ref();
let changeSubject = (subjectId) => {
  chapters.data = [];
  MenuData.value.data.forEach((e) => {
    if (e.subjectId == subjectId) {
      e.chapters.forEach((item) => {
        let chapter = {};
        chapter.id = item.id;
        chapter.name = item.name;
        chapters.data.push(chapter);
      });
    }
  });
};
let getChapter = async () => {
  let response = await link(url.allChapter);
  if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
    return ElMessage.error(response.data.msg);
  }
  MenuData.value.data = response.data.data;
};
const dialogVisible = ref(false);
const text = ref({
  questionId: "",
  question: "题干",
  describe: "",
  score: "",
  level: "简单",
  type: "单选",
  chapterId: "",
  subjectId: "",
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

let unSave = () => {};
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

const onSubmit = () => {
  //增加
  if (store.state.isAdd) {
    addQuestionAllInfo();
  }
};
let sortLevel = (level) => {
  if (level == "困难") return 3;
  if (level == "简单") return 1;
  if (level == "中等") return 2;
};
let sortType = (type) => {
  if (type == "简答") return 3;
  if (type == "单选") return 1;
  if (type == "多选") return 2;
};
let getQuestionAllInfo = async (question) => {
  let response = await link(url.question.getQuestionById(question.id));
  if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(response.data.msg);
    return;
  }
  let responseOne = await link(url.questionOption.get(question.id));
  let responseTwo = await link(url.questionRightAnswer.get(question.id));
  let arr = [];
  arr.push(question);
  let q = sortQuestion(arr)[0];
  text.value.questionId = q.id;
  text.value.question = q.title;
  text.value.describe = q.describe;
  text.value.score = q.score;
  text.value.level = q.level;
  text.value.type = q.type;
  if (q.type != "简答") {
    text.value.A = responseOne.data.data.a;
    text.value.B = responseOne.data.data.b;
    text.value.C = responseOne.data.data.c;
    text.value.D = responseOne.data.data.d;
    text.value.E = responseOne.data.data.e;
    text.value.F = responseOne.data.data.f;
  }
  text.value.answer = responseTwo.data.data.rightAnswer;
  text.value.analysis = responseTwo.data.data.analysis;
};

let updateQuestionAllInfo = async (q) => {
  //传递的参数是question
  let question = {};
  question.id = q.id;
  question.title = text.value.question;
  question.describe = text.value.describe;
  question.score = text.value.score;
  question.levelId = sortLevel(text.value.level);
  question.typeId = sortType(text.value.type);
  let responseOne = await link(url.question.update, "put", question);
  if (responseOne.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(responseOne.data.msg);
    return;
  }
  if (text.value.type != "简答") {
    let questionOption = {};
    questionOption.questionId = q.id;
    questionOption.a = text.value.A;
    questionOption.b = text.value.B;
    questionOption.c = text.value.C;
    questionOption.d = text.value.D;
    questionOption.e = text.value.E;
    questionOption.f = text.value.F;
    let responseTwo = await link(
      url.questionOption.update,
      "put",
      questionOption
    );
  }
  let questionRightAnswer = {};
  questionRightAnswer.questionId = q.id;
  questionRightAnswer.rightAnswer = text.value.answer;
  questionRightAnswer.analysis = text.value.analysis;
  let responseThree = await link(
    url.questionRightAnswer.update,
    "put",
    questionRightAnswer
  );
};
let addQuestionAllInfo = async () => {
  let question = {};
  question.question = text.value.question;
  question.describe = text.value.describe;
  question.score = text.value.score;
  question.levelId = sortLevel(text.value.level);
  question.typeId = sortType(text.value.type);
  question.chapterId = chapterId.value;
  question.subjectId = subjectId.value;
  console.log(question)
  let responseOne = await link(url.question.add, "post", question);
  if (responseOne.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(responseOne.data.msg);
    return;
  }else{
    ElMessage.success("添加成功！")
  }
  if (text.value.type != "简答") {
    let questionOption = {};
    console.log(responseOne.data.data)
    questionOption.questionId = responseOne.data.data;
    questionOption.a = text.value.A;
    questionOption.b = text.value.B;
    questionOption.c = text.value.C;
    questionOption.d = text.value.D;
    questionOption.e = text.value.E;
    questionOption.f = text.value.F;
    let responseTwo = await link(
      url.questionOption.add,
      "post",
      questionOption
    );
  }
  let questionRightAnswer = {};
  questionRightAnswer.questionId = responseOne.data.data;
  questionRightAnswer.rightAnswer = text.value.answer;
  questionRightAnswer.analysis = text.value.analysis;
  let responseThree = await link(
    url.questionRightAnswer.add,
    "post",
    questionRightAnswer
  );
};

onMounted(() => {
  // if(store.state.isAdd){
  //   questionAllInfo={}
  //   return
  // }
  // getQuestionAllInfo()
  getChapter();
});
// onUnmounted(() => {
//   store.commit("setIsAdd", true);
// });
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

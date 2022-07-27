<template>
  <el-card class="box-card">
    <div class="main">
      <el-dialog
        v-model="dialogVisible"
        title="Tips"
        width="30%"
        @open="open"
        :before-close="handleClose"
      >
        <md-editor
          editorId="no"
          :toolbars="toolbars"
          v-model="editInfo"
          @on-upload-img="onUploadImg"
          @onHtmlChanged="saveHtml"
        />
        <el-button text @click="saveInfo">保存</el-button>
        <el-button text @click="dialogVisible = false">退出</el-button>
      </el-dialog>

      <el-form label-width="120px">
        <el-form-item label="题干">
          <md-editor
            class="editor"
            editorId="one"
            :html-preview="true"
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
            placeholder="A选项"
            class="option editor"
            editorId="two"
            v-model="text.A"
            :previewOnly="true"
          />
          <el-button class="option" type="primary" @click="buttonClick('A')"
            >编辑</el-button
          >
          <md-editor
            class="option editor"
            editorId="two"
            v-model="text.B"
            :previewOnly="true"
          />
          <el-button class="option" type="primary" @click="buttonClick('B')"
            >编辑</el-button
          >
          <md-editor
            class="option editor"
            editorId="two"
            v-model="text.C"
            :previewOnly="true"
          />
          <el-button class="option" type="primary" @click="buttonClick('C')"
            >编辑</el-button
          >
          <md-editor
            class="option editor"
            editorId="two"
            v-model="text.D"
            :previewOnly="true"
          />
          <el-button class="option" type="primary" @click="buttonClick('D')"
            >编辑</el-button
          >
          <template v-if="text.type == '多选'">
            <md-editor
              class="option editor"
              editorId="two"
              v-model="text.E"
              :previewOnly="true"
            />
            <el-button class="option" type="primary" @click="buttonClick('E')"
              >编辑</el-button
            >
            <md-editor
              class="option editor"
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
          <md-editor
            class="editor"
            editorId="two"
            v-model="text.answer"
            :previewOnly="true"
          />
          <el-button
            type="primary"
            class="option"
            @click="buttonClick('answer')"
            >编辑</el-button
          >
        </el-form-item>
        <el-form-item label="解析">
          <md-editor
            class="editor"
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
  </el-card>
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
// import sanitizeHtml from "sanitize-html";

const sanitize = (html) => {
  return sanitizeHtml(html);
};

const ErrorCode = code;



const router = useRouter();
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
let textHtml = {
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
};

let editHtmlInfo = "";
let saveHtml = (html) => {
  editHtmlInfo = html;
};
let Imgbase64 = "";
const onUploadImg = (files) => {
  for (var i = 0; i < files.length; i++) {
    var reader = new FileReader();
    reader.readAsDataURL(files[i]);
    reader.onload = function (e) {
      const base64Img = e.target.result;
      editInfo.value = editInfo.value + "<img src='" + base64Img + "'/>";
    };
  }
};
let unSave = () => {};
let saveInfo = () => {
  if (editInfo.value === "") {
    if (item.value === "question") {
      text.value[item.value] = "题干";
      textHtml[item.value] == "题干";
    } else if (item.value === "answer") {
      text.value[item.value] = "答案";
      textHtml[item.value] == "答案";
    } else if (item.value === "analysis") {
      text.value[item.value] = "解析";
      textHtml[item.value] == "解析";
    } else {
      text.value[item.value] = item.value;
      textHtml[item.value] == item.value;
    }
    dialogVisible.value = false;
    return;
  }
  text.value[item.value] = editInfo.value;
  textHtml[item.value] = editHtmlInfo;
  dialogVisible.value = false;
};
const store = useStore();

const onSubmit = () => {
  //增加
  if (store.state.isAdd) {
    addQuestionAllInfo();
  } else {
    updateQuestionAllInfo(store.state.questionId);
    router.push({ name: "questionAdmin" });
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
let getQuestionAllInfo = async (questionId) => {
  let response = await link(url.question.getQuestionById(questionId));
  if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(response.data.msg);
    return;
  }
  let arr = [];
  arr.push(response.data.data);
  let q = sortQuestion(arr)[0];
  text.value.questionId = q.id;
  text.value.question = q.title;
  text.value.describe = q.describe;
  text.value.score = q.score;
  text.value.level = q.level;
  text.value.type = q.type;
  let responseOne = await link(url.questionOption.get(questionId));
  if (responseOne.data.code !== ErrorCode.NORMAL_SUCCESS) {
    if (responseOne.data.data == null) {
      return;
    }
    console.log("dedao" + responseOne.data.data);
    ElMessage.error(response.data.msg);
    return;
  }
  if (q.type != "简答") {
    text.value.A =
      responseOne.data.data.a == null ? "A" : responseOne.data.data.a;
    text.value.B =
      responseOne.data.data.b == null ? "B" : responseOne.data.data.b;
    text.value.C =
      responseOne.data.data.c == null ? "C" : responseOne.data.data.c;
    text.value.D =
      responseOne.data.data.d == null ? "D" : responseOne.data.data.d;
    text.value.E =
      responseOne.data.data.e == null ? "E" : responseOne.data.data.e;
    text.value.F =
      responseOne.data.data.f == null ? "F" : responseOne.data.data.f;
  }
  let responseTwo = await link(url.questionRightAnswer.getRight(questionId));
  if (responseTwo.data.code !== ErrorCode.NORMAL_SUCCESS) {
    if (responseTwo.data.data == null) {
      return;
    }
    ElMessage.error(response.data.msg);
    return;
  }
  text.value.answer = responseTwo.data.data.rightAnswer;
  text.value.analysis = responseTwo.data.data.analysis;
};

let updateQuestionAllInfo = async (id) => {
  //传递的参数是question
  let question = {};
  question.id = id;
  question.question = textHtml.question;
  console.log(textHtml.question);
  question.describe = text.value.describe;
  question.score = text.value.score;
  question.levelId = sortLevel(text.value.level);
  question.typeId = sortType(text.value.type);
  question.chapterId = chapterId.value;
  question.subjectId = subjectId.value;

  if (!checkScore(question.score)) {
    return;
  }

  let responseOne = await link(url.question.update, "put", question);
  if (responseOne.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(responseOne.data.msg);
    return;
  } else {
    ElMessage.success("更新成功！");
  }

  if (text.value.type != "简答") {
    let questionOption = {};
    questionOption.id = "";
    questionOption.questionId = id;
    questionOption.a = text.value.A == "A" ? null : textHtml.A;
    questionOption.b = text.value.B == "B" ? null : textHtml.B;
    questionOption.c = text.value.C == "C" ? null : textHtml.C;
    questionOption.d = text.value.D == "D" ? null : textHtml.D;
    questionOption.e = text.value.E == "E" ? null : textHtml.E;
    questionOption.f = text.value.F == "F" ? null : textHtml.F;
    let responseTwo = await link(
      url.questionOption.update,
      "put",
      questionOption
    );
    if (responseTwo.data.code === ErrorCode.NORMAL_ERROR) {
      let responseTwoone = await link(
        url.questionOption.add,
        "post",
        questionOption
      );
      if (responseTwoone.data.code !== ErrorCode.NORMAL_SUCCESS) {
        ElMessage.error(responseTwoone.data.msg);
        return;
      }
    }
  }
  let questionRightAnswer = {};
  questionRightAnswer.id = "";
  questionRightAnswer.questionId = id;
  questionRightAnswer.rightAnswer = textHtml.answer;
  questionRightAnswer.analysis = textHtml.analysis;
  let responseThree = await link(
    url.questionRightAnswer.update,
    "put",
    questionRightAnswer
  );
  if (responseThree.data.code === ErrorCode.NORMAL_ERROR) {
    let responseThreeone = await link(
      url.questionRightAnswer.add,
      "post",
      questionRightAnswer
    );
    if (responseThreeone.data.code !== ErrorCode.NORMAL_SUCCESS) {
      ElMessage.error(responseThreeone.data.msg);
      return;
    }
  }
};
let checkScore = (score) => {
  if (score > 20) {
    ElMessage.error("单个题目，成绩不能大于20");
    return false;
  }
  return true;
};
let addQuestionAllInfo = async () => {
  let question = {};
  question.question = textHtml.question;
  question.describe = text.value.describe;
  question.score = text.value.score;
  question.levelId = sortLevel(text.value.level);
  question.typeId = sortType(text.value.type);
  question.chapterId = chapterId.value;
  question.subjectId = subjectId.value;
  if (!checkScore(question.score)) {
    return;
  }
  let responseOne = await link(url.question.add, "post", question);
  if (responseOne.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(responseOne.data.msg);
    return;
  } else {
    ElMessage.success("添加成功！");
  }
  if (text.value.type != "简答") {
    let questionOption = {};
    questionOption.questionId = responseOne.data.data;
    questionOption.a = text.value.A == "A" ? null : textHtml.A;
    questionOption.b = text.value.B == "B" ? null : textHtml.B;
    questionOption.c = text.value.C == "C" ? null : textHtml.C;
    questionOption.d = text.value.D == "D" ? null : textHtml.D;
    questionOption.e = text.value.E == "E" ? null : textHtml.E;
    questionOption.f = text.value.F == "F" ? null : textHtml.F;
    let responseTwo = await link(
      url.questionOption.add,
      "post",
      questionOption
    );
    if (responseTwo.data.code !== ErrorCode.NORMAL_SUCCESS) {
      ElMessage.error(responseTwo.data.msg);
      return;
    } 
  }

  let questionRightAnswer = {};
  questionRightAnswer.questionId = responseOne.data.data;
  questionRightAnswer.rightAnswer = textHtml.answer;
  questionRightAnswer.analysis = textHtml.analysis;
  let responseThree = await link(
    url.questionRightAnswer.add,
    "post",
    questionRightAnswer
  );
  text.value = {};
  text.value = {
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
  };
};

onMounted(() => {
  getChapter();
  if (!store.state.isAdd) {
    getQuestionAllInfo(store.state.questionId);
  }
});
onUnmounted(() => {
  store.commit("setIsAdd", true);
});
</script>
<style scoped>
.box-card {
  width: 890px;
  margin-left: 25%;
}
.editor {
  border: 1px solid rgb(217, 216, 216);
  border-radius: 5px;
}

.el-form-item {
  margin-top: 0px;
}
.option {
  margin-top: 10px;
}
</style>

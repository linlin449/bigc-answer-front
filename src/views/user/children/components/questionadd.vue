<template>
  <el-dialog v-model="dialogVisible" title="Tips" width="800px" @open="open" :before-close="handleClose">
    <md-editor editorId="no" :toolbars="toolbars" v-model="editInfo" @on-upload-img="onUploadImg"
      @onHtmlChanged="saveHtml" />
    <el-button text @click="saveInfo">保存</el-button>
    <el-button text @click="dialogVisible = false">退出</el-button>
  </el-dialog>
  <el-card class="box-card">
    <el-form label-width="120px">
      <el-form-item label="题干" >
        <el-row>
          <el-col :span="24">
            <div class="default-theme" v-html="text.question"
              style="border:1px solid rgb(217, 216, 216);width: 500px;min-height:100px ;"></div>
          </el-col>
          <el-col :span="24">
            <el-button type="primary" class="option" @click="buttonClick('question')">编辑</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="描述" >
        <el-input v-model="text.describe" />
      </el-form-item>
      <el-form-item label="成绩">
        <el-input-number v-model="text.score" :max="20" :min="0" :step="2" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="课程">
            <el-select placeholder="请选择课程" v-model="subjectId" @change="changeSubject(subjectId)">
              <el-option v-for="v in MenuData.data" :key="v.subjectId" :label="v.subjectname" :value="v.subjectId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="章节">
            <el-select placeholder="请选择章节" v-model="chapterId">
              <el-option v-for="v in chapters.data" :key="v.id" :label="v.name" :value="v.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="题型">
            <el-radio-group v-model="text.type">
              <el-radio label="单选" />
              <el-radio label="多选" />
              <el-radio label="简答" />
            </el-radio-group>

          </el-form-item>
        </el-col>
        <el-col :span="12">

          <el-form-item label="难度">
            <el-radio-group v-model="text.level">
              <el-radio label="简单" />
              <el-radio label="中等" />
              <el-radio label="困难" />
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="text.type != '简答'">
        <el-form-item label="A选项">
          <el-row>
            <el-col :span="24">
              <div class="default-theme" v-html="text.A"
                style="border:1px solid rgb(217, 216, 216);width: 500px;min-height:100px ;"></div>
            </el-col>
            <el-col :span="24">
              <el-button class="option" type="primary" @click="buttonClick('A')">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="B选项">
          <el-row>
            <el-col :span="24">
              <div class="default-theme" v-html="text.B"
                style="border:1px solid rgb(217, 216, 216);width: 500px;min-height:100px ;"></div>
            </el-col>
            <el-col :span="24">
              <el-button class="option" type="primary" @click="buttonClick('B')">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="C选项">
          <el-row>
            <el-col :span="24">
              <div class="default-theme" v-html="text.C"
                style="border:1px solid rgb(217, 216, 216);width: 500px;min-height:100px ;"></div>
            </el-col>
            <el-col :span="24">
              <el-button class="option" type="primary" @click="buttonClick('C')">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="D选项">
          <el-row>
            <el-col :span="24">
              <div class="default-theme" v-html="text.D"
                style="border:1px solid rgb(217, 216, 216);width: 500px;min-height:100px ;"></div>
            </el-col>
            <el-col :span="24">
              <el-button class="option" type="primary" @click="buttonClick('D')">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <template v-if="text.type == '多选'">
          <el-form-item label="E选项">
            <el-row>
              <el-col :span="24">
                <div class="default-theme" v-html="text.E"
                  style="border:1px solid rgb(217, 216, 216);width: 500px;min-height:100px ;"></div>
              </el-col>
              <el-col :span="24">
                <el-button class="option" type="primary" @click="buttonClick('E')">编辑</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="F选项">
            <el-row>
              <el-col :span="24">
                <div class="default-theme" v-html="text.F"
                  style="border:1px solid rgb(217, 216, 216);width: 500px;min-height:100px ;"></div>
              </el-col>
              <el-col :span="24">
                <el-button class="option" type="primary" @click="buttonClick('F')">编辑</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
      </template>
      <template v-if="text.type != '简答'">
        <el-form-item label="答案" width="450px">
          <!-- <el-input placeholder="请输入选择题答案大写字母" v-model="text.answer" /> -->
          <el-checkbox-group v-model="checkList" :min="0" :max="text.type=='单选' ? 1 : 6">
            <el-checkbox label="A"/>
            <el-checkbox label="B" v-show="text.B != ''"/>
            <el-checkbox label="C" v-show="text.C != ''"/>
            <el-checkbox label="D" v-show="text.D != ''"/>
            <el-checkbox label="E" v-show="text.E != ''"/>
            <el-checkbox label="F" v-show="text.F != ''"/>
          </el-checkbox-group>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="答案">
          <el-row>
            <el-col :span="24">
              <div class="default-theme" v-html="text.answer"
                style="border:1px solid rgb(217, 216, 216);width: 500px;min-height:100px ;"></div>
            </el-col>
            <el-col :span="24">
              <el-button class="option" type="primary" @click="buttonClick('answer')">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </template>

      <el-form-item label="解析">
        <el-row>
          <el-col :span="24">
            <div class="default-theme" v-html="text.analysis"
              style="border:1px solid rgb(217, 216, 216);width: 500px;min-height:100px ;"></div>
          </el-col>
          <el-col :span="24">
            <el-button class="option" type="primary" @click="buttonClick('analysis')">编辑</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="unSave" v-show="props.add">取消</el-button>
      </el-form-item>
    </el-form>
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
import link from "@/api/link.js";
import url from "@/api/url.js";
import code from "@/api/code.js";
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { useStore } from "vuex";
import sortQuestion from "@/util/sortQuestion.js";
import { processSlotOutlet } from "@vue/compiler-core";
const router = useRouter();
const store = useStore();
const ErrorCode = code;

const props = defineProps({
    add: Boolean,
    qid: Number,
    cardShadow:String
})
//课程和章节
const MenuData = ref({ data: [] });
let chapters = reactive({ data: [] });
let subjectId = ref();
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

const checkList = ref([])

const dialogVisible = ref(false);//编辑框是否出现
//text和form绑定
const text = reactive({
  questionId: "",
  question: "",
  describe: "",
  score: "",
  level: "简单",
  type: "单选",
  chapterId: "",
  subjectId: "",
  A: "",
  B: "",
  C: "",
  D: "",
  E: "",
  F: "",
  answer: "",
  analysis: "",
});
let toolbars = ["revoke", "katex", "next", "image"];//设置编辑框展示按钮
const item = ref("question");


let editInfo = ref("");
//编辑按钮按下后，传入对应的item的name
let buttonClick = (name) => {
  item.value = name;
  dialogVisible.value = true;
};
//编辑框打开时
let open = () => {
  editInfo.value = text[item.value];
};
//编辑时将编辑框中的内容转变为
let editHtmlInfo = "";
let saveHtml = (html) => {
  editHtmlInfo = html;
};
//每次编辑保存时
let saveInfo = () => {
  text[item.value] = editHtmlInfo;
  dialogVisible.value = false;
};


//传入图片的操作
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

//全部编辑完成提交
const onSubmit = () => {
  if (props.add) {
    addQuestionAllInfo();
  } else {
    updateQuestionAllInfo(props.qid)
};
}

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
  subjectId.value=response.data.data.subjectId
  changeSubject(subjectId.value)
  chapterId.value=response.data.data.chapterId
  let arr = [];
  arr.push(response.data.data);
  let q = sortQuestion(arr)[0];
  text.questionId = q.id;
  text.question = q.title;
  text.describe = q.describe;
  text.score = q.score;
  text.level = q.level;
  text.type = q.type;
  let responseOne = await link(url.questionOption.get(questionId));
  if (responseOne.data.code !== ErrorCode.NORMAL_SUCCESS) {
    if (responseOne.data.data == null) {
      return;
    }
    ElMessage.error(response.data.msg);
    return;
  }
  if (q.type != "简答") {
    text.A = responseOne.data.data.a==null?'':responseOne.data.data.a;
    text.B = responseOne.data.data.b==null?'':responseOne.data.data.b;
    text.C = responseOne.data.data.c==null?'':responseOne.data.data.c;
    text.D = responseOne.data.data.d==null?'':responseOne.data.data.d;
    text.E = responseOne.data.data.e==null?'':responseOne.data.data.e;
    text.F = responseOne.data.data.f==null?'':responseOne.data.data.f;
  }
  else{
    text.answer=responseOne.data.data.answer==null?'':responseOne.data.data.answer;
  }
  let responseTwo = await link(url.questionRightAnswer.getRight(questionId));
  if (responseTwo.data.code !== ErrorCode.NORMAL_SUCCESS) {
    if (responseTwo.data.data == null) {
      return;
    }
    ElMessage.error(response.data.msg);
    return;
  }
  checkList.value = responseTwo.data.data.rightAnswer.split('-');
  text.analysis = responseTwo.data.data.analysis==null?'':responseTwo.data.data.analysis;
};

let updateQuestionAllInfo = async (id) => {
  let question = {};
  question.id = id;
  question.question = text.question;
  question.describe = text.describe;
  question.score = text.score;
  question.levelId = sortLevel(text.level);
  question.typeId = sortType(text.type);
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
  if (text.type != "简答") {
    let questionOption = {};
    questionOption.id = "";
    questionOption.questionId = id;
    questionOption.a = text.A;
    questionOption.b = text.B;
    questionOption.c = text.C;
    questionOption.d = text.D;
    questionOption.e = text.E;
    questionOption.f = text.F;
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
  questionRightAnswer.rightAnswer = text.answer;
  questionRightAnswer.analysis = text.analysis;
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
  if (score <0 || score >20) {
    ElMessage.error("单个题目，成绩不能大于20");
    return false;
  }
  return true;
};
let checkAnswer = (type) => {
  if (type === "单选") {
    if(checkList.value.length == 0){
      ElMessage.error("请选择题目的答案");
      return false;
    }else if(checkList.value.length > 1){
      ElMessage.error("单选题应仅有一个正确答案");
      return false;
    }
  }
  if (type === "多选") {
    if(checkList.value.length<2){
      ElMessage.error("多选题应至少有两个正确答案");
      return false;
    }
  }
    return true;
}
let addQuestionAllInfo = async () => {
  let question = {};
  question.question = text.question;
  question.describe = text.describe;
  question.score = text.score;
  question.levelId = sortLevel(text.level);
  question.typeId = sortType(text.type);
  question.chapterId = chapterId.value;
  question.subjectId = subjectId.value;
  for(let i = 0; i < checkList.value.length; i++){
    text.answer = text.answer + checkList.value[i] + '-';
  }
  text.answer = text.answer.substring(0, text.answer.length - 1);
  if (!checkScore(question.score)||!checkAnswer(text.type)) {
    return;
  }

  let responseOne = await link(url.question.add, "post", question);
  if (responseOne.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(responseOne.data.msg);
    return;
  } else {
    ElMessage.success("添加成功！");
  }
  if (text.type != "简答") {
    let questionOption = {};
    questionOption.questionId = responseOne.data.data;
    questionOption.a = text.A;
    questionOption.b = text.B;
    questionOption.c = text.C;
    questionOption.d = text.D;
    questionOption.e = text.E;
    questionOption.f = text.F;
    for(let o in questionOption){
      if(questionOption[o]=='')questionOption[o] = null;
    }
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
  questionRightAnswer.rightAnswer = text.answer;
  questionRightAnswer.analysis = text.analysis;
  let responseThree = await link(
    url.questionRightAnswer.add,
    "post",
    questionRightAnswer
  );
  text = {};
  text = {
    questionId: "",
    question: "",
    describe: "",
    score: "",
    level: "简单",
    type: "单选",
    chapterId: "",
    subjectId: "",
    A: "",
    B: "",
    C: "",
    D: "",
    E: "",
    F: "",
    answer: "",
    analysis: "",
  };
};

onMounted(async() => {
  await getChapter();
  if (!props.add) {
    getQuestionAllInfo(props.qid);
  }
});

</script>
<style scoped>
.box-card {
  width: 710px;
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

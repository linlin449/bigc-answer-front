<template>
  <el-card class="box-card">
    <template #header>
      <span>我的收藏夹</span>
    </template>
    <el-table @row-click="clickRow" :data="favotireQuestion.records" style="width: 100%" border stripe>
      <el-table-column label="问题">
        <template #default="scope">
          <div class="default-theme" style="display: flex; align-items: center" v-html="scope.row.question" />
        </template>
      </el-table-column>
      <el-table-column prop="describe" label="描述" />
      <el-table-column prop="score" label="分数" width="100" />
      <el-table-column prop="level" label="难度">
        <template #default="scope">
          <span style="display: flex; align-items: center">{{ getLevelName(scope.row.levelId) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <span style="display: flex; align-items: center">{{ getTypeName(scope.row.typeId) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" style="margin-top: 10px; margin-left:-5px ;" :total="favotireQuestion.total"
      v-model:currentPage="favotireQuestion.current" :page-size="favotireQuestion.size" />
    <QuestionDetail :qid="questionId" v-model:dialogTableVisible="dialogTableVisible"
      @before-close="dialogTableVisible = false; isEdit = false">
      <span>我的笔记:</span>
      <div class="default-theme" v-html="favotireQuestion.note[clickIndex]"
        style="border:1px solid cornflowerblue;min-height:100px ;" v-show="!isEdit"></div>
      <md-editor @on-upload-img="onUploadImg" @onHtmlChanged="handelHtmlChange" v-model="editorText"
        placeholder="在此输入你的笔记,支持markdown格式" v-show="isEdit">
      </md-editor>
      <el-button type="primary" style="margin-top:10px ;" @click="handelEdit" v-show="!isEdit">编辑</el-button>
      <el-button type="primary" style="margin-top:10px ;" v-show="isEdit" @click="updateNote">保存</el-button>
      <el-button type="info" style="margin-top:10px ;" v-show="isEdit" @click="isEdit = false">取消</el-button>
    </QuestionDetail>
  </el-card>
</template>

<script setup>
import { getQuestionListByIds, getFavoriteList, updateQuestionNote } from '../../../api/api.js'
import { onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import code from '../../../api/code.js';
import { ElMessage } from 'element-plus';
import QuestionDetail from '@/components/QuestionDetail.vue'
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
const store = useStore();

const dialogTableVisible = ref(false);


MdEditor.config({
  editorConfig: {
    renderDelay: 0
  }
});
const favotireQuestion = reactive({
  records: [],
  note: [],
  total: 0,
  size: 10,
  current: 1,
})
watch(
  favotireQuestion.current,
  (val) => {
    getFavoriteQuestion(val)
  }
)
const questionId = ref(1);

const getLevelName = (levelId) => {
  switch (levelId) {
    case 1: return "简单";
    case 2: return "中等";
    case 3: return "困难";
    default: return "未知";
  }
}
const getTypeName = (typeId) => {
  switch (typeId) {
    case 1: return "单选";
    case 2: return "多选";
    case 3: return "简答";
    default: return "未知";
  }
}
const getFavoriteQuestion = async (page) => {
  const response = await getFavoriteList(page, store.state.username);
  let resData = response.data;
  if (resData.code == code.NORMAL_SUCCESS) {
    let ids = [];
    for (let i in resData.data.records) {
      favotireQuestion.note.push(resData.data.records[i].note)
      ids.push(resData.data.records[i].questionId)
    }
    favotireQuestion.total = resData.data.total;
    favotireQuestion.size = resData.data.size;
    favotireQuestion.current = resData.data.current;
    if (ids.length > 0) {
      const res = await getQuestionListByIds(ids)
      resData = res.data;
      if (resData.code == code.NORMAL_SUCCESS) {
        favotireQuestion.records = resData.data
      } else {
        ElMessage.error(resData.msg);
      }
    }
  } else {
    ElMessage.error(resData.msg);
  }
}

const clickIndex = ref(0);

const clickRow = (row) => {
  for (let i in favotireQuestion.records) {
    if (favotireQuestion.records[i].id == row.id) {
      clickIndex.value = i;
      break;
    }
  }
  questionId.value = row.id;
  dialogTableVisible.value = true
}


const isEdit = ref(false)

const editorText = ref('')
const editorHtml = ref('')
const handelHtmlChange = (html) => {
  editorHtml.value = html;
}
const onUploadImg = (files) => {
  for (var i = 0; i < files.length; i++) {
    var reader = new FileReader();
    reader.readAsDataURL(files[i]);
    reader.onload = function (e) {
      const base64Img = e.target.result
      editorText.value = editorText.value + "<img src='" + base64Img + "'/>";
    }
  }
}
const handelEdit = () => {
  isEdit.value = true;
  if (favotireQuestion.note[clickIndex.value] != null) {
    editorText.value = favotireQuestion.note[clickIndex.value]
  }
}
const updateNote = async () => {
  const response = await updateQuestionNote(questionId.value, store.state.username, editorHtml.value)
  if (response.data.code == code.NORMAL_SUCCESS) {
    ElMessage.success(response.data.msg);
    isEdit.value = false;
    favotireQuestion.note[clickIndex.value] = editorHtml.value
  } else {
    ElMessage.error(response.data.msg);
  }
}

onMounted(() => {
  getFavoriteQuestion(1);
})
</script>

<style scoped>
.box-card {
  width: 980px;
  margin: 0 auto;
  margin-top: 20px;
}
</style>

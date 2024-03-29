<template>
  <el-card class="box-card">
    <el-dropdown v-for="v in MenuData.data" class="subject-box" :key="v.subject_id" size="large">
      <el-button type="primary">
        <span class="el-dropdown-link">
          {{ v.subjectname }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="val in v.chapters" :key="val.id" @click="clickChapterMenu(val)">{{ val.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="question-box">
      <el-table @row-click="clickRow" :data="tableData.data.records" border style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column prop="title" label="问题" header-align="center" show-overflow-tooltip>
          <template #default="scope">
            <div class="default-theme" style="display: flex; align-items: center" v-html="scope.row.title" />
          </template>
        </el-table-column>
        <el-table-column prop="describe" label="描述" width="180" header-align="center" />
        <el-table-column prop="score" label="分数" width="80" align="center" header-align="center" sortable>
          <template #default="scope">
            <el-tag type="info" round disable-transitions>{{
                scope.row.score
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="难度" width="80" align="center" :filters="[
          { text: '困难', value: '困难' },
          { text: '简单', value: '简单' },
          { text: '中等', value: '中等' },
        ]" :filter-method="filterTag" filter-placement="bottom-end" header-align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.level === '困难'" type="danger" disable-transitions>{{ scope.row.level }}</el-tag>
            <el-tag v-if="scope.row.level === '简单'" type="success" disable-transitions>{{ scope.row.level }}</el-tag>
            <el-tag v-if="scope.row.level === '中等'" type="warning" disable-transitions>{{ scope.row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="80" align="center" header-align="center"><template
            #default="scope">
            <el-tag v-if="scope.row.type === '单选'" disable-transitions>{{
                scope.row.type
            }}</el-tag>
            <el-tag v-if="scope.row.type === '多选'" type="success" disable-transitions>{{ scope.row.type }}</el-tag>
            <el-tag v-if="scope.row.type === '简答'" type="info" disable-transitions>{{ scope.row.type }}</el-tag>
          </template></el-table-column>
      </el-table>
      <el-pagination background style="margin-top: 10px; margin-left:-5px ;"
        v-model:currentPage="tableData.data.current" layout="prev, pager, next" :total="tableData.data.total"
        @current-change="handleCurrentChange" />
    </div>
  </el-card>
</template>

<script setup>
import { reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import link from "../../../api/link.js";
import url from "../../../api/url.js";
import code from "../../../api/code.js";
import sortQuestion from "../../../util/sortQuestion.js";
import { getQuestionPageByChapterId } from '@/api/api'
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { useStore } from 'vuex';
import "md-editor-v3/lib/style.css";
const ErrorCode = code;
const router = useRouter();
const store = useStore();
let currentChapterId = "";

const filterTag = (value, row) => {
  return row.level === value
}

/**
 * 课程和对应的章节数据
 */
let question = {
  id: "",
  title: "",
  describe: "",
  score: "",
  level: "",
  type: "",
};
const MenuData = reactive({ data: [] }); //章节对应的表
let getChapter = async () => {
  let response = await link(url.allChapter);
  if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
    return ElMessage.error(response.data.msg);
  }
  MenuData.data = response.data.data;
  currentChapterId = MenuData.data[0].chapters[0].id
  if (!store.state.currentChapterId) {
    store.commit('setcurrentChapter', currentChapterId)
  }
};
let clickChapterMenu = (val) => {
  currentChapterId = val.id;
  store.commit('setcurrentChapter', currentChapterId)
  getQuestionByChapterId(val.id, 1); //根据chapterid查询question
};
/**
 * 问题的列表
 */
const tableData = reactive({ data: [] });
const questionMenuData = reactive({});
let getQuestionByChapterId = async (chapterId, currentPage) => {
  let response = await getQuestionPageByChapterId(currentPage, chapterId);
  if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
    return ElMessage.error(response.data.msg);
  } else {
    tableData.data = response.data.data;
    tableData.data.records = sortQuestion(response.data.data.records);
  }
};
const handleCurrentChange = (currentPage) => {
  getQuestionByChapterId(store.state.currentChapterId, currentPage);
}

//TODO 鼠标点击题目事件
let clickRow = (row, column, event) => {
  router.push({
    name: "answerQuestion",
    params: { qid: row.id, cid: currentChapterId },
  });
};

/**
 * 初始化
 */
onMounted(async () => {
  await getChapter();
  await getQuestionByChapterId(store.state.currentChapterId, 1);
});
</script>

<style scoped>
.box-card {
  width: 980px;
  margin: 0 auto;
  margin-top: 20px;
}

.box-card .subject-box {
  margin: 20px;
  margin-top: 10px;
  margin-left: 0px;
  cursor: pointer;
}

.box-card .subject-box .title {
  cursor: pointer;
  margin-top: 10px;
  margin-left: 10px;
  background-color: rgba(228, 238, 41, 0.5);
  text-align: center;
  width: 15%;
  line-height: 40px;
  font-size: 20px;
  color: rgb(13, 13, 13);
  border-radius: 8px;
}

.box-card .subject-box .chapter-menu {
  padding: 0;
}

.box-card .subject-box .chapter-menu {
  padding: 0;
}

.box-card .subject-box .chapter-menu li {
  text-align: center;
  cursor: pointer;
  display: inline-block;
  margin: 10px;
  width: 10%;
  line-height: 40px;
  font-size: 15px;
  color: rgb(62, 60, 60);
  border-radius: 8px;
}

.box-card .subject-box .chapter-menu li:hover {
  background-color: #9ed1f7;
  transition: all 1.5s ease;
}

.box-card .subject-box .chapter-menu .current {
  background-color: #9ed1f7;
}
</style>

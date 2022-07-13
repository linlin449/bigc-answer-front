<template>
  <div id="Answer">
    <div v-for="v in MenuData.data" class="subject-box" :key="v.subject_id">
      <h5 class="title">{{ v.subjectname }}</h5>
      <ul class="chapter-menu">
        <li
          v-for="val in v.chapters"
          :class="{ current: val.current }"
          :key="val.id"
          @click="clickChapterMenu(val)"
        >
          {{ val.name }}
        </li>
      </ul>
    </div>
    <div class="question-box">
      <el-table
        @row-click="clickRow"
        :data="tableData.data"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        border
        stripe
      >
        <el-table-column prop="title" label="问题" width="180" />
        <el-table-column prop="describe" label="描述" width="180" />
        <el-table-column prop="score" label="分数" />
        <el-table-column prop="level" label="难度" />
        <el-table-column prop="type" label="类型" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import link from "../../../api/link.js";
import url from "../../../api/url.js";
import code from "../../../api/code.js";
import sortQuestion from "../../../util/sortQuestion.js";
import { ElMessage } from "element-plus";
const ErrorCode = code;
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
  MenuData.data.forEach((e) => {
    e.chapters.forEach((e1) => {
      e1.current = false;
    });
  });
  MenuData.data[0].chapters[0].current = true;
};
let clickChapterMenu = (val) => {
  MenuData.data.forEach((element) => {
    element.chapters.forEach((e) => {
      e.current = false;
    });
  });
  val.current = true;
  getQuestionByChapterId(val.id); //根据chapterid查询question
};
/**
 * 问题的列表
 */
const tableData = reactive({ data: [] });
const questionMenuData = reactive({});
let getQuestionByChapterId = async (id) => {
  let response = await link(url.question.getQuestionByChapterId(id), "get");
  if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
    return ElMessage.error(response.data.msg);
  }
  tableData.data = sortQuestion(response.data.data);
};
//TODO 鼠标点击题目事件
let clickRow = (row, column, event ) => {
    // let response = await link(url.question.getQuestionById(row.id), "get");
};

//TODO 查询学生答题表细节，根据是否答题和错误答题进行区分
let tableRowClassName = ({ row, rowIndex, event }) => {
  if (rowIndex === 1) {
    return "warning-row";
  } else if (rowIndex === 3) {
    return "success-row";
  }
  return "";
};

/**
 * 初始化
 */
onMounted(() => {
  getChapter();
  getQuestionByChapterId(1);
});
</script>

<style>
#Answer {
  width: 980px;
  margin: 0 auto;
}
#Answer .subject-box {
  margin: 20px;
}
#Answer .subject-box .title {
  cursor: pointer;
  margin-top: 10px;
  margin-left: 10px;
  background-color: rgba(228, 238, 41, 0.5);
  text-align: center;
  width: 15%;
  line-height: 40px;
  font-size: 20px;
  color: rgb(240, 68, 68);
  border-radius: 8px;
}
#Answer .subject-box .chapter-menu {
  padding: 0;
}

#Answer .subject-box .chapter-menu {
  padding: 0;
}
#Answer .subject-box .chapter-menu li {
  text-align: center;
  cursor: pointer;
  display: inline-block;
  margin: 10px;
  width: 10%;
  line-height: 40px;
  font-size: 15px;
  color: rgb(231, 21, 21);
  border-radius: 8px;
}
#Answer .subject-box .chapter-menu li:hover {
  background-color: #9ed1f7;
  transition: all 1.5s ease;
}
#Answer .subject-box .chapter-menu .current {
  background-color: #9ed1f7;
}
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>

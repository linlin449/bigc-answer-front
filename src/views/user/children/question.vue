<template>
  <div id="Answer">
    <el-dropdown
      v-for="v in MenuData.data"
      class="subject-box"
      :key="v.subject_id"
    >
      <span class="el-dropdown-link">
        {{ v.subjectname }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="val in v.chapters"
            :key="val.id"
            @click="clickChapterMenu(val)"
            >{{ val.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="question-box">
      <el-table
        @row-click="clickRow"
        :data="tableData.data"
        border
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          prop="title"
          label="问题"
          header-align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="describe"
          label="描述"
          width="180"
          header-align="center"
        />
        <el-table-column
          prop="score"
          label="分数"
          width="80"
          align="center"
          header-align="center"
          sortable
        >
          <template #default="scope">
            <el-tag type="info" round disable-transitions>{{
              scope.row.score
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          label="难度"
          width="80"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.level === '困难'"
              type="danger"
              disable-transitions
              >{{ scope.row.level }}</el-tag
            >
            <el-tag
              v-if="scope.row.level === '简单'"
              type="success"
              disable-transitions
              >{{ scope.row.level }}</el-tag
            >
            <el-tag
              v-if="scope.row.level === '中等'"
              type="warning"
              disable-transitions
              >{{ scope.row.level }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="80"
          align="center"
          header-align="center"
          ><template #default="scope">
            <el-tag v-if="scope.row.type === '单选'" disable-transitions>{{
              scope.row.type
            }}</el-tag>
            <el-tag
              v-if="scope.row.type === '多选'"
              type="success"
              disable-transitions
              >{{ scope.row.type }}</el-tag
            >
            <el-tag
              v-if="scope.row.type === '简答'"
              type="info"
              disable-transitions
              >{{ scope.row.type }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
    v-model="dialogVisible"
    title="问题详情"
    width="30%"
    :before-close="handleClose"
  >
    <el-form :model="form" label-width="120px">
   
   <el-form-item label="问题">
      <el-input v-model="form.desc" type="textarea" />
    </el-form-item>
    <el-form-item label="问题">
      <el-input v-model="form.desc" type="textarea" />
    </el-form-item>
    <el-form-item label="课程">
      <el-select v-model="form.region" placeholder="please select your zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="章节">
      <el-select v-model="form.region" placeholder="please select your zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="题型">
      <el-radio-group v-model="form.resource">
        <el-radio label="单选" />
        <el-radio label="多选" />
        <el-radio label="简答" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="难度">
      <el-radio-group v-model="form.resource">
        <el-radio label="简单" />
        <el-radio label="中等" />
        <el-radio label="困难" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="选择题答案">
      <el-input   placeholder="A" clearable/>
      <el-input v-model="form.name"  placeholder="B" clearable/>
      <el-input v-model="form.name"  placeholder="C" clearable/>
      <el-input v-model="form.name"  placeholder="D" clearable/>
      <el-input v-model="form.name"  placeholder="D" clearable/>
      <el-input v-model="form.name"  placeholder="D" clearable/>
    </el-form-item>
    <el-form-item label="答案">
      <el-input v-model="form.name"  placeholder="A" clearable/>
    </el-form-item>
  </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确定修改</el-button
        >
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import link from "../../../api/link.js";
import url from "../../../api/url.js";
import code from "../../../api/code.js";
import sortQuestion from "../../../util/sortQuestion.js";
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
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
  if (val.current) return;
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
let clickRow = (row, column, event) => {
  // let response = await link(url.question.getQuestionById(row.id), "get");
};
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})
let dialogVisible = ref(false) //编辑表单是否可见
const handleEdit = (index, row) => {
    console.log(row)
 dialogVisible.value=!dialogVisible.value
};
const handleDelete = (index, row) => {
  console.log(index, row);
};
/**
 * 初始化
 */
onMounted(() => {
  getChapter();
  getQuestionByChapterId(1);
});
</script>

<style scoped>
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
  color: rgb(13, 13, 13);
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
  color: rgb(62, 60, 60);
  border-radius: 8px;
}
#Answer .subject-box .chapter-menu li:hover {
  background-color: #9ed1f7;
  transition: all 1.5s ease;
}
#Answer .subject-box .chapter-menu .current {
  background-color: #9ed1f7;
}
.el-dropdown-link {
  font-weight: bold;
  font-size: larger;
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>

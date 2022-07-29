<template>
  <el-card class="box-card">
    <template #header>
      <span>我的收藏夹</span>
    </template>
    <el-table @row-click="clickRow" :data="favotireQuestion.records" style="width: 100%" border stripe>
      <el-table-column label="问题">
        <template #default="scope">
          <div style="display: flex; align-items: center" v-html="scope.row.question" />
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
    <el-pagination background layout="prev, pager, next" :total="favotireQuestion.total"
      v-model:currentPage="favotireQuestion.current" :page-size="favotireQuestion.size" />
    <QuestionDetail :qid="questionId" v-model:dialogTableVisible="dialogTableVisible"
      @before-close="dialogTableVisible = false" />
  </el-card>
</template>

<script setup>
import { getQuestionListByIds, getFavoriteList } from '../../../api/api.js'
import { onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import code from '../../../api/code.js';
import { ElMessage } from 'element-plus';
import QuestionDetail from '@/components/QuestionDetail.vue'
const store = useStore();

const dialogTableVisible = ref(false);

const favotireQuestion = reactive({
  records: [],
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

const clickRow = (row) => {
  questionId.value = row.id;
  dialogTableVisible.value = true
}
onMounted(() => {
  getFavoriteQuestion(1);

})
</script>

<style scoped>
.box-card {
  margin-top: 20px;
  width: 90%;
  margin-left: 5%;
}
</style>

<template>
  <el-card class="box-card">
    <el-table :data="studentList.data.records">
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button v-show="store.state.role == 3" size="small" @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:currentPage="studentList.data.current" :page-size="studentList.data.size"
      layout="prev, pager, next" :total="studentList.data.total" @current-change="handleCurrentChange" />
  </el-card>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import code from "../../../api/code";
import link from '../../../api/link';
import url from '../../../api/url';

const store = useStore();
const ErrorCode = code;

const studentList = reactive({ data: {} })
const getStudentList = async (page) => {
  let path = url.student.getListByTeacher(store.state.username, page);
  if (store.state.role == 3) path = url.student.getListByPage(page);
  const response = await link(path, "get")
  if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
    return ElMessage.error(response.data.msg);
  }
  studentList.data = response.data.data;
}

//页码被更换
const handleCurrentChange = (val) => {
  getStudentList(val);
}

//删除学生
const handleDelete = (val) => {
  console.log(studentList.data.records[val]);
  if (store.state.role == 2) {
    //老师
    //TODO 断开老师与该学生的联系(TeacherStudent 表)
  } else if (store.state.role == 3) {
    //管理员
    //TODO 删除学生的所有信息(Student TeacherStudent 表)
  }
}

//编辑学生
const handleEdit = (val) => {
  console.log(studentList.data.records[val]);
}

onMounted(() => {
  getStudentList(1);
});
</script>

<style scoped>
.box-card {
  width: 90%;
  margin-left: 5%;
}
</style>

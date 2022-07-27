<template>
  <div>
    <el-card class="box-card">
      <el-table :data="teacherList.data.data" v-loading="loading">
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="small" @click="handleList(scope.$index, scope.row)">
              学生列表
            </el-button>
            <el-button size="small" type="danger" @click="handleTeacherDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="editVisible" title="编辑">
      <el-form :model="editInfo" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="editInfo.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editInfo.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editInfo.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editInfo.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="warning" plain @click="resetPassword">重置密码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateTeacherInfo">修改</el-button>
          <el-button @click="editVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="studentVisible" title="学生列表">
      <el-input placeholder="学生用户名" class="input-username" v-model="studentUsername" />
      <el-button type="primary" @click="handelClick">添加学生</el-button>
      <el-table :data="studentList.data.records">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleStudentDelete(scope.$index, scope.row)">删除关系
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="studentList.data.current" layout="prev, pager, next"
        :total="studentList.data.total" @current-change="handleCurrentChange" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import code from '@/api/code';
import link from '@/api/link';
import url from '@/api/url';

const ErrorCode = code

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
</script>

<style scoped>
.box-card {
  width: 90%;
  margin-left: 5%;
}

.input-username {
  margin-right: 20px;
  margin-bottom: 20px;
  width: 300px;
}
</style>
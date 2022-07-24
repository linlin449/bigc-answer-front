<template>
  <div>
    <el-card class="box-card">
      <template v-if="store.state.role == 2">
        <!-- 仅老师身份可见 -->
        <el-input placeholder="学生用户名" class="input-username" v-model="studentUsername" />
        <el-button type="primary" @click="handelClick">添加学生</el-button>
      </template>
      <el-table :data="studentList.data.records" v-loading="loading">
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column label="操作">
          <template #default="scope">
            <!-- 仅管理员身份可见 -->
            <el-button v-if="store.state.role == 3" size="small" @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="small"
              @click="analysShow = true; analysUsername = studentList.data.records[scope.$index].username">做题分析
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="studentList.data.current" layout="prev, pager, next"
        :total="studentList.data.total" @current-change="handleCurrentChange" />
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
          <el-button type="primary" @click="updateStudentInfo">修改</el-button>
          <el-button @click="editVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <StudentAnalysVue :dialogTableVisible="analysShow" :username="analysUsername" @before-close="analysShow = false" />
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import code from "@/api/code";
import link from '@/api/link';
import url from '@/api/url';
import StudentAnalysVue from '@/components/StudentAnalys.vue';

const store = useStore();
const ErrorCode = code;

const loading = ref(true)

const studentList = reactive({ data: {} })
const getStudentList = async (page) => {
  loading.value = true;
  let path = url.student.getListByTeacher(store.state.username, page);
  if (store.state.role == 3) path = url.student.getListByPage(page);
  const response = await link(path, "get")
  if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
    return ElMessage.error(response.data.msg);
  } else {
    studentList.data = response.data.data;
  }
  loading.value = false;
}

//页码被更换
const handleCurrentChange = (val) => {
  getStudentList(val);
}

const analysShow = ref(false);
const analysUsername = ref('')
//删除学生

//仅将TeacherStudent表中数据删除
const delTeacherStudent = async (teacherUsername, studentId) => {
  const response = await link(url.student.deleteTeacherStudent(teacherUsername, studentId))
  if (response.data.code == ErrorCode.NORMAL_SUCCESS) {
    ElMessage.success(response.data.msg);
    getStudentList(1);
  } else {
    ElMessage.error(response.data.msg);
  }
}

//删除学生所有信息
const deleteStudent = async (username) => {
  const response = await link(url.student.deleteStudent(username), "get");
  if (response.data.code == ErrorCode.NORMAL_SUCCESS) {
    ElMessage.success(response.data.msg);
    getStudentList(1);
  } else {
    ElMessage.error(response.data.msg);
  }
}
const handleDelete = (val) => {
  if (store.state.role == 2) {
    //老师
    ElMessageBox.confirm
      (
        '确认删除该学生? 此操作将会把该学生从您的学生列表中删除,并非删除学生的信息', '警告',
        { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning', }
      ).then(() => {
        //确认删除
        delTeacherStudent(store.state.username, studentList.data.records[val].id)
      })
      .catch(() => {
        //取消删除
      })
  } else if (store.state.role == 3) {
    //管理员
    //删除学生的所有信息(Student TeacherStudent 表)
    ElMessageBox.confirm
      (
        '确认删除该学生? 此操作将删除该学生的所有信息,且不可恢复', '警告',
        { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning', }
      ).then(() => {
        //确认删除
        deleteStudent(studentList.data.records[val].username)
      })
      .catch(() => {
        //取消删除
      })
  }
}

//编辑学生
const editInfo = reactive({
  email: '',
  name: '',
  username: '',
  phone: '',
  id: 0,
  index: 0,
})
const editVisible = ref(false)
const handleEdit = (index) => {
  editVisible.value = true
  const info = studentList.data.records[index];
  editInfo.email = info.email;
  editInfo.name = info.name;
  editInfo.username = info.username;
  editInfo.phone = info.phone;
  editInfo.id = info.id
  editInfo.index = index;
}

//修改学生个人信息
const updateStudentInfo = () => {
  const info = studentList.data.records[editInfo.index];
  if (editInfo.name == info.name && editInfo.email == info.email && editInfo.username == info.username) {
    ElMessage({
      message: '没有信息被修改',
      type: 'warning',
    })
  } else {
    const data = {
      id: info.id,
      name: editInfo.name,
      username: editInfo.username,
      email: editInfo.email,
      phone: editInfo.phone,
    }
    updateStudent(data);
  }
  editVisible.value = false;

}
const updateStudent = async (data) => {
  const response = await link(url.student.update, 'put', data);
  if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(response.data.msg);
  } else {
    ElMessage.success(response.data.msg);
    getStudentList(1);
  }
}

//重置学生密码
const resetStudentPassword = async (studentid) => {
  const response = await link(url.student.resetPassword(studentid), "get");
  if (response.data.code == ErrorCode.NORMAL_SUCCESS) {
    ElNotification({
      title: '重置成功',
      message: `已将该学生密码重置为 <strong><i>${response.data.data}</i></strong>`,
      duration: 0,
      dangerouslyUseHTMLString: true,
    })
  } else {
    ElMessage.error(response.data.msg);
  }
}
const resetPassword = () => {
  const info = studentList.data.records[editInfo.index];
  ElMessageBox.confirm
    (
      '确认重置该学生的密码?', '警告',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning', }
    ).then(() => {
      //确认
      resetStudentPassword(info.id)
    })
    .catch(() => {
      //取消
    })
}

onMounted(() => {
  getStudentList(1);
});

//添加学生
const studentUsername = ref("")
const addStudentForTeacher = async (teacherUsername, studentUsername) => {
  const response = await link(url.student.addTeacherStudentByUsername(teacherUsername, studentUsername), "get");
  if (response.data.code == ErrorCode.NORMAL_SUCCESS) {
    ElMessage.success(response.data.msg);
    getStudentList(1);
  } else {
    ElMessage.error(response.data.msg);
  }
}
const handelClick = () => {
  if (studentUsername.value.length > 0) {
    addStudentForTeacher(store.state.username, studentUsername.value)
  } else {
    ElMessage.error("请输入用户名");
  }
}
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

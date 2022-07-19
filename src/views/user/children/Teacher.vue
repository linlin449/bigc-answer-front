<template>
  <div>
    <el-card class="box-card">
      <el-table :data="teacherList.data.data">
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import code from '../../../api/code';
import link from '../../../api/link';
import url from '../../../api/url';

const ErrorCode = code

//获取老师列表
const teacherList = reactive({ data: {} })
const getTeacherList = async () => {
  const response = await link(url.teacher.getList, "get")
  if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(response.data.msg);
  }
  else {
    teacherList.data = response.data
  }
}
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
  const info = teacherList.data.data[index];
  editInfo.email = info.email;
  editInfo.name = info.name;
  editInfo.username = info.username;
  editInfo.phone = info.phone;
  editInfo.id = info.id
  editInfo.index = index;
}

//修改老师个人信息
const updateTeacherInfo = () => {
  const info = teacherList.data.data[editInfo.index];
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
    updateTeacher(data);
  }
  editVisible.value = false;

}
const updateTeacher = async (data) => {
  const response = await link(url.teacher.update, 'put', data);
  if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(response.data.msg);
  } else {
    ElMessage.success(response.data.msg);
    getTeacherList();
  }
}

//删除老师
const delTeacher = async (tid) => {
  const response = await link(url.teacher.deleteTeacher(tid), "get");
  if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(response.data.msg);
  } else {
    ElMessage.error(response.data.msg);
    getTeacherList();
  }
}
const handleTeacherDelete = (index) => {
  const info = teacherList.data.data[index];
  ElMessageBox.confirm
    (
      '确认删除该老师? 此操作将会把该老师的所有信息删除,且不可恢复', '警告',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning', }
    ).then(() => {
      //确认删除
      delTeacher(info.id)
    })
    .catch(() => {
      //取消删除
    })
}


//学生列表
const studentVisible = ref(false)
const teacherUsername = ref('');
const handleList = (index) => {
  teacherUsername.value = teacherList.data.data[index].username
  getStudentList(teacherUsername.value, 1);
  studentVisible.value = true
}
const handleCurrentChange = (val) => {
  getStudentList(teacherUsername.value, val);
}

//获取老师的学生列表
const studentList = reactive({ data: {} })
const getStudentList = async (teacherUsername, page) => {
  let path = url.student.getListByTeacher(teacherUsername, page);
  const response = await link(path, "get")
  if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
    return ElMessage.error(response.data.msg);
  } else {
    studentList.data = response.data.data;
  }
}
//仅将TeacherStudent表中数据删除
const delTeacherStudent = async (teacherUsername, studentId) => {
  const response = await link(url.student.deleteTeacherStudent(teacherUsername, studentId))
  if (response.data.code == ErrorCode.NORMAL_SUCCESS) {
    ElMessage.success(response.data.msg);
    getStudentList(teacherUsername, 1);
  } else {
    ElMessage.error(response.data.msg);
  }
}
const handleStudentDelete = (val) => {
  ElMessageBox.confirm
    (
      '确认删除该学生? 此操作将会把该学生从您的学生列表中删除,并非删除学生的信息', '警告',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning', }
    ).then(() => {
      //确认删除
      delTeacherStudent(teacherUsername.value, studentList.data.records[val].id)
    })
    .catch(() => {
      //取消删除
    })
}

//添加老师的学生
const studentUsername = ref("")
const addStudentForTeacher = async (teacherUsername, studentUsername) => {
  const response = await link(url.student.addTeacherStudentByUsername(teacherUsername, studentUsername), "get");
  if (response.data.code == ErrorCode.NORMAL_SUCCESS) {
    ElMessage.success(response.data.msg);
    getStudentList(teacherUsername, 1);
  } else {
    ElMessage.error(response.data.msg);
  }
}
const handelClick = () => {
  if (studentUsername.value.length > 0) {
    addStudentForTeacher(teacherUsername.value, studentUsername.value)
  } else {
    ElMessage.error("请输入用户名");
  }
}
onMounted(() => {
  getTeacherList()
})
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
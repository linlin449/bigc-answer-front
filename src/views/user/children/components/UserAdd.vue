<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span v-if="props.userRole == 1">添加学生</span>
                <span v-if="props.userRole == 2">添加老师</span>
            </div>
        </template>
        <el-form :model="userInfo" label-width="150px" :rules="rules" ref="formRef">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="userInfo.name" />
            </el-form-item>
            <el-form-item label="用户名(工号/学号)" prop="username">
                <el-input v-model="userInfo.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-col :span="11">
                    <el-input v-model="userInfo.password" />
                </el-col>
                <el-col :span="2" class="text-center">
                    <span></span>
                </el-col>
                <el-col :span="11">
                    <el-button type="primary" plain @click="createPassword">生成随机密码</el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="userInfo.email" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="userInfo.phone" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handelAdd(formRef)">添加</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import code from "@/api/code";
import link from "@/api/link";
import url from "@/api/url";

const router = useRouter();

const props = defineProps({
    /**
     * 用户角色,1 = 学生; 2 = 老师
     */
    userRole: Number,
})



const formRef = ref();
const rules = {
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 1, max: 20, message: '长度应为 1 - 20', trigger: 'blur' },
    ],
    username: [
        { required: true, message: '请输入用户名(工号/学号)', trigger: 'blur' },
        { min: 7, max: 13, message: '长度应为 7 - 13', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度应为 6 - 16', trigger: 'blur' },
    ],
    email: [
        { min: 6, max: 16, message: '长度应为 6 - 16', trigger: 'blur' },
    ],
    phone: [
        { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
    ],
}
const userInfo = reactive({
    name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
})

const createPassword = () => {
    let seed = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'Q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '2', '3', '4', '5', '6', '7', '8', '9'];// 密码源数组
    let n = '';
    for (let i = 0; i < 12; i++) {
        let t = Math.round(Math.random() * (seed.length - 1));
        n += seed[t];
    }
    userInfo.password = n;
}

//添加用户
const addUser = async (data) => {
    let path = url.teacher.addTeacher;
    if (props.userRole == 1) path = url.student.addStudent;
    const response = await link(path, "post", data)
    if (response.data.code == code.NORMAL_SUCCESS) {
        ElMessage.success(response.data.msg);
        userInfo.name = "";
        userInfo.username = "";
        userInfo.password = "";
        userInfo.email = "";
        userInfo.phone = "";
        if (props.userRole == 1) {
            router.push({ name: "studentAdmin" })
        } else {
            router.push({ name: "teacherAdmin" })
        }
    } else {
        ElMessage.error(response.data.msg);
    }
}

const handelAdd = (formRef) => {
    if (!formRef) return
    formRef.validate((valid) => {
        if (valid) {
            addUser(userInfo)
        }
    })
}
</script>
<style scoped>
.box-card {
    width: 50%;
    margin-left: 25%;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
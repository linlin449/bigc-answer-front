<template>

    <div class="main">
        <div class="login-content">
            <span class="loginHeader animate__animated animate__bounceIn">北京印刷学院物理答题系统</span>
            <el-card class="box-card animate__animated animate__fadeInUp">
                <template #header>
                    <el-avatar :size="80" style="background-color: #06f;margin-left: 40%;">
                        <el-icon :size="50">
                            <UserFilled />
                        </el-icon>
                    </el-avatar>
                </template>
                <el-tabs v-model="loginRole" @tab-change="resetFrom">
                    <el-tab-pane label="学生登陆" :name="1"></el-tab-pane>
                    <el-tab-pane label="老师登陆" :name="2"></el-tab-pane>
                    <el-tab-pane label="管理员登陆" :name="3"></el-tab-pane>
                    <el-form :model="formData" ref="formRef" :rules="rules">
                        <el-form-item prop="username">
                            <el-input placeholder="用户名(学号)" v-model="formData.username" />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" show-password placeholder="密码" v-model="formData.password" />
                        </el-form-item>
                        <el-form-item prop="vercode">
                            <el-row :gutter="20">
                                <el-col :span="20">
                                    <el-input placeholder="验证码" v-model="formData.vercode" />
                                </el-col>
                                <el-col :span="4">
                                    <el-image v-loading="codeLoading" style="width: 130px; height: 48px"
                                        :src="captchaBase64" @click="createCaptcha" />
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="login-button" v-loading="loginLoading" color="#06f" auto-insert-space
                                @click="handelLogin(formRef)">登陆
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>
<script setup>
import { ElMessage } from 'element-plus';
import { UserFilled } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue';
import { studentLogin, teacherLogin, adminLogin, getCaptcha } from '../api/api'
import code from '../api/code.js';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router';
import 'animate.css';
const router = useRouter();
const store = useStore();

const loginRole = ref(1);

const codeLoading = ref(true);

const loginLoading = ref(false);

const captchaBase64 = ref('');

const formRef = ref();
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 9, message: '请输入正确的用户名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '密码长度为6-16', trigger: 'blur' },
    ],
    vercode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
})
/**
 * 提交数据
 */
const formData = reactive({
    username: '',
    password: '',
    vercode: '',
    verkey: '',
})

const resetFrom = () => {
    formData.username = '';
    formData.password = '';
    formData.vercode = '';
}
const createCaptcha = async () => {
    const response = await getCaptcha();
    if (response.data.code == code.NORMAL_SUCCESS) {
        captchaBase64.value = response.data.data.image;
        formData.verkey = response.data.data.key
    } else {
        ElMessage.error(`验证码获取失败:${response.data.msg}`)
    }
    codeLoading.value = false;
}

const login = async () => {
    loginLoading.value = true;
    store.commit("setUsername", formData.username);
    let response = '';
    switch (loginRole.value) {
        case 1:
            store.commit("setRole", 1);
            response = await studentLogin(formData.username, formData.password, formData.vercode, formData.verkey);
            if (response.data.code == code.NORMAL_SUCCESS) {
                store.commit("setToken", response.data.data.token);
                router.push({ name: "student" });
            } else {
                ElMessage.error(`登陆失败失败:${response.data.msg}`)
                createCaptcha();
            }
            break;
        case 2:
            store.commit("setRole", 2);
            response = await teacherLogin(formData.username, formData.password, formData.vercode, formData.verkey);
            if (response.data.code == code.NORMAL_SUCCESS) {
                store.commit("setToken", response.data.data.token);
                router.push({ name: "user" });
            } else {
                ElMessage.error(`登陆失败失败:${response.data.msg}`)
                createCaptcha();
            }
            break;
        case 3:
            store.commit("setRole", 3);
            response = await adminLogin(formData.username, formData.password, formData.vercode, formData.verkey);
            if (response.data.code == code.NORMAL_SUCCESS) {
                store.commit("setToken", response.data.data.token);
                router.push({ name: "user" });
            } else {
                ElMessage.error(`登陆失败失败:${response.data.msg}`);
                createCaptcha();
            }
            break;
        default:
            break;
    }
    loginLoading.value = false;
}

const handelLogin = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            login();
        }
    })
}

onMounted(() => {
    createCaptcha();
})
</script>
<style scoped>
.main {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-repeat: no-repeat;
    background-image: url("../assets/background.jpg");
}

.login-content {
    margin: 0 auto;
}

.loginHeader {
    display: block;
    font-size: 32px;
    letter-spacing: 31px;
    color: white;
    text-align: center;
    margin-top: 200px;
    font-weight: bold;
}

.box-card {
    margin: 30px auto;
    width: 500px;
}

.login-button {
    margin-left: 5%;
    width: 90%;
}
</style>
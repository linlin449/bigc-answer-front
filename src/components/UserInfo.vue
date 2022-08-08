<template>
    <el-dialog width="30%"  :modelValue="props.dialogTableVisible" title="修改密码" @closed="emit('before-close')">
        <el-form :model="formData" label-width="100px" :rules="rules" ref="formRef">
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="formData.oldPassword" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="formData.newPassword" />
            </el-form-item>
            <el-form-item label="重复新密码" prop="reNewPassword">
                <el-input v-model="formData.reNewPassword" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handelExit(formRef)">修改</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script setup>
import { ElMessage,ElMessageBox } from "element-plus";
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import code from "@/api/code";
import { changePassword } from "@/api/api";
import { map } from "lodash";
const router = useRouter();
const store = useStore();
const props = defineProps({
    dialogTableVisible: Boolean,
})
const emit = defineEmits([
    "before-close"
])
const formData = reactive({
    oldPassword: "",
    newPassword: "",
    reNewPassword: "",
})
const formRef = ref();
const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== formData.newPassword) {
        callback(new Error("两次输入密码不同"))
    } else {
        callback()
    }
}
const rules = {
    oldPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度应为 6 - 16', trigger: 'blur' },
    ],
    newPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度应为 6 - 16', trigger: 'blur' },
    ],
    reNewPassword: [
        { validator: validatePass, trigger: 'blur' },
        { required: true,min: 6, max: 16, message: '长度应为 6 - 16', trigger: 'blur' },

    ],
}
const postPass = async (user) => {
    let response = await changePassword(user,formData.newPassword,formData.oldPassword,formData.reNewPassword)
    if (response.data.code == code.NORMAL_SUCCESS) {
        ElMessage.success('修改成功!请重新登录')
        router.push({ name: "login" });
    } else {
        ElMessage.error(`修改失败:${response.data.msg}`)
    }
}
const ExitPass = () => {
    switch (store.state.role) {
        case 1:
            postPass('student')
            break;
        case 2:
            postPass('teacher')
            break;
        case 3:
            postPass('admin')
            break;
    }

}
const handelExit = (formRef) => {
    ElMessageBox.confirm
        (
            '确定要修改密码?', '警告',
            { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning', }
        ).then(async () => {
            if (!formRef) return
            formRef.validate((valid) => {
                if (valid) {
                    ExitPass()
                }
            })
        })
        .catch(() => {
        })
}
</script>
<style scoped>
</style>
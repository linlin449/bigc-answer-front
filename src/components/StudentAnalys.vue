<template>
    <el-dialog :modelValue="props.dialogTableVisible" title="做题分析" @open="handelOpen" @closed="emit('before-close')">
        <el-descriptions :title="studentInfo.data.name" v-loading="loading">
            <el-descriptions-item label="学号">{{ studentInfo.data.username }}</el-descriptions-item>
            <el-descriptions-item label="已做题">{{ questionInfo.data.answered }}</el-descriptions-item>
            <el-descriptions-item label="未做题">{{ questionInfo.data.unanswered }}</el-descriptions-item>
            <el-descriptions-item label="答对题">{{ questionInfo.data.answerright }}</el-descriptions-item>
            <el-descriptions-item label="正确率">
                <el-tag type="success">{{ correctRate }}</el-tag>
            </el-descriptions-item>
        </el-descriptions>
    </el-dialog>
</template>
<script setup>
import { computed, defineProps, reactive, ref } from 'vue';
import link from '../api/link';
import url from '../api/url';
const props = defineProps({
    dialogTableVisible: Boolean,
    username: String,
})
const emit = defineEmits([
    "before-close"
])
const loading = ref(false)


const studentInfo = reactive({ data: {} })
const getStudentInfo = async () => {
    const response = await link(url.student.getInfo(props.username), "get")
    studentInfo.data = response.data.data.student;
}

const questionInfo = reactive({ data: {} })
const getStudentQuestionInfo = async () => {
    const response = await link(url.question.getStudentQuestionInfo(props.username), "get")
    questionInfo.data = response.data.data;
}

const correctRate = computed(() => {
    return Math.round(questionInfo.data.answerright / questionInfo.data.answered * 10000) / 100.00 + "%"
})

const handelOpen = () => {
    loading.value = true
    getStudentInfo();
    getStudentQuestionInfo();
    loading.value = false
}
</script>
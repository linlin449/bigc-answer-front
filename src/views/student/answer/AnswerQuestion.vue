<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>答题</span>
            </div>
        </template>
        <el-container>
            <el-container>
                <el-aside width="200px">
                    <el-space direction="vertical" alignment="flex-start" class="box-left">
                        <span>用户名:{{ store.state.username }}</span>
                        <span>难度:{{ questionLevel }}</span>
                        <span>分值:{{ questionInfo.data.score }}</span>
                        <span>题型:<span style="color: red;">{{ questionType }}</span></span>
                    </el-space>
                    <div class="divider" />
                </el-aside>
                <el-main>
                    <div v-html="questionInfo.data.question" class="question-title" />
                    <!-- 选项 -->
                    <div v-for="(_, key) in selectInfo" class="question-option" v-show="questionInfo.data.typeId != 3">
                        <el-checkbox v-model="selectInfo[key]" size="large"
                            v-show="optionInfo.data[key.toLowerCase()] != null" @change="handelSelect(key)"
                            style="width:100% ;">
                            <span>{{ key }}.</span><span v-html="optionInfo.data[key.toLowerCase()]"></span>
                        </el-checkbox>
                    </div>
                    <!-- 简答 -->
                    <md-editor @on-upload-img="onUploadImg" @onHtmlChanged="handelHtmlChange" v-model="editorText"
                        placeholder="在此输入你的答案,支持markdown格式" v-show="questionInfo.data.typeId == 3">
                    </md-editor>

                </el-main>
            </el-container>
            <el-divider />
            <el-footer>
                <el-container>
                    <el-aside width="200px">
                        <div style="color:gray ;">
                            试题描述:{{ questionInfo.data.describe }}
                        </div>
                    </el-aside>
                    <el-main>
                        <el-row>
                            <el-col :span="12">
                                <div class="grid-content ep-bg-purple"></div>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="info" @click="questionPrev">上一题</el-button>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="primary" @click="questionNext">下一题</el-button>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="success" auto-insert-space @click="questionAnswer">提交</el-button>
                            </el-col>
                        </el-row>
                    </el-main>
                </el-container>
            </el-footer>
        </el-container>
    </el-card>
</template>
<script setup>
import { ElMessage } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import code from '@/api/code';
import link from '@/api/link';
import url from '@/api/url';
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
    qid: Number,
    cid: Number,
})
const questionId = ref(0);
const chapterId = ref(0);
/**
 * 答题类型
 * 0 - 跳过已作答的题目
 * 1 - 不跳过已作答的题目
 */
const answerType = ref(1);
/**
 * 题目详细信息
 */
const questionInfo = reactive({ data: {} })

/**
 * 根据levelId获取题目难度
 */
const questionLevel = computed(() => {
    switch (questionInfo.data.levelId) {
        case 1: return "简单";
        case 2: return "中等";
        case 3: return "困难";
        default: return "未知";
    }
})
/**
 * 根据typeId获取题目类型
 */
const questionType = computed(() => {
    switch (questionInfo.data.typeId) {
        case 1: return "单选";
        case 2: return "多选";
        case 3: return "简答";
        default: return "未知";
    }
})
/**
 * 获取问题详细信息
 * @param qid 问题ID
 */
const getQuestionInfo = async (qid) => {
    const response = await link(url.question.getQuestionById(qid), "get");
    if (response.data.code == code.NORMAL_SUCCESS) {
        questionInfo.data = response.data.data
    } else {
        ElMessage.error(response.data.msg);
    }
}
/**
 * 问题的选项
 */
const optionInfo = reactive({ data: {} })
/**
 * 获取问题选项详细信息
 * @param qid 问题ID
 */
const getOptionInfo = async (qid) => {
    if (questionInfo.data.typeId == 3) return;
    const response = await link(url.questionOption.get(qid), "get");
    if (response.data.code == code.NORMAL_SUCCESS) {
        optionInfo.data = response.data.data
    } else {
        // ElMessage.error(response.data.msg);
    }
}

const selectInfo = reactive({
    A: false,
    B: false,
    C: false,
    D: false,
    E: false,
    F: false,
})

const handelSelect = (key) => {
    if (questionInfo.data.typeId == 1) {
        for (let val in selectInfo) {
            if (val != key) selectInfo[val] = false
        }
    }
}
/**
 * 检查某题答题状态
 * @param {Number} qid 问题ID
 */
const isQuestionAnswered = async (qid) => {
    const response = await link(url.question.checkQuestionStatus(qid, store.state.username), "get");
    if (response.data.code == code.NORMAL_SUCCESS) {
        if (response.data.data.answerRight != null) {
            return true;
        }
        return false;
    } else {
        ElMessage.error(response.data.msg);
        return false;
    }
}
const questionList = reactive({ data: [] })
const getQuestionList = async (cid) => {
    const response = await link(url.question.getQuestionByChapterId(cid), "get");
    if (response.data.code == code.NORMAL_SUCCESS) {
        questionList.data = response.data.data;
    } else {
        ElMessage.error(response.data.msg);
    }
}
/**
 * 上一题
 */
const questionPrev = async () => {
    let index = 0;
    for (let i = 0; i < questionList.data.length; i++) {
        if (questionList.data[i].id == questionId.value) {
            if (i == 0) {
                ElMessage.info("当前已经是第一道题")
                return;
            } else {
                index = i - 1;
                break;
            }
        }
    }
    let status = await isQuestionAnswered(questionList.data[index].id);
    if (answerType.value == 0) {
        while (status == true) {
            if (index - 1 < 0) {
                ElMessage.info("前面的题目已经都做过了");
                return;
            }
            index--;
            status = await isQuestionAnswered(questionList.data[index].id);
        }
    }
    questionInfo.data = questionList.data[index]
    questionId.value = questionList.data[index].id
    getOptionInfo(questionId.value)
    if (status == true) {
        //TODO 获取解析以及正确答案

    }
}
/**
 * 下一题
 */
const questionNext = async () => {
    let index = 0;
    for (let i = 0; i < questionList.data.length; i++) {
        if (questionList.data[i].id == questionId.value) {
            if (i == questionList.data.length - 1) {
                ElMessage.info("当前已经是最后一题")
                return;
            } else {
                index = i + 1;
                break;
            }
        }
    }
    let status = await isQuestionAnswered(questionList.data[index].id);
    if (answerType.value == 0) {
        while (status == true) {
            if (index + 1 == questionList.data.length) {
                ElMessage.info("后的题目已经都做过了");
                return;
            }
            index++;
            status = await isQuestionAnswered(questionList.data[index].id);
        }
    }

    questionInfo.data = questionList.data[index]
    questionId.value = questionList.data[index].id
    getOptionInfo(questionId.value)
    if (status == true) {
        //TODO 获取解析以及正确答案

    }
}
/**
 * md-editor绑定内容
 */
const editorText = ref('');
/**
 * md-editor的html
 */
const editorHtml = ref('');
const handelHtmlChange = (html) => {
    editorHtml.value = html;
    console.log('html', html);
}
const onUploadImg = (files) => {
    for (var i = 0; i < files.length; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = function (e) {
            const base64Img = e.target.result
            editorText.value = editorText.value + "<img src='" + base64Img + "'/>";
        }
    }
}
/**
 * 答题
 */
const answerQuestion = () => {

}
onMounted(() => {
    questionId.value = props.qid;
    chapterId.value = props.cid;
    getQuestionList(chapterId.value);
    getQuestionInfo(questionId.value);
    getOptionInfo(questionId.value);
})
</script>
<style scoped>
.box-card {
    margin-top: 10px;
    width: 90%;
    margin-left: 5%;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.box-left {
    margin-top: 40%;
}

.divider {
    margin-left: 50px;
    width: 0;
    height: 90%;
    border-right: solid 1px rgb(169, 169, 169);
    display: inline-block;
}

.question-title {
    font-size: 25px;
    margin-bottom: 10px;
}

.question-option {
    border: 1px solid transparent;
    border-radius: 10px;
    font-size: 25px;
    width: 80%;
    padding-left: 20px;
    transition: 0.5s;
    transition-property: color, background-color, border-color;
}

.question-option:hover {
    border: 1px solid skyblue;
    background-color: rgba(166, 223, 246, 0.5);
}

.question-option span {
    margin-right: 15px;
}
</style>
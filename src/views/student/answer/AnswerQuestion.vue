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
                        <el-checkbox v-model="skipAnswered">跳过已做题</el-checkbox>
                    </el-space>
                    <div class="divider" />
                </el-aside>
                <el-main>
                    <div v-html="questionInfo.data.question" class="question-title" />
                    <!-- 选项 -->
                    <div v-for="(_, key) in selectInfo" class="question-option" v-show="questionInfo.data.typeId != 3">
                        <el-checkbox v-model="selectInfo[key]" size="large"
                            v-show="optionInfo.data[key.toLowerCase()] != null" @change="handelSelect(key)"
                            style="width:100% ;height: auto;">
                            <span>{{ key }}.</span><span v-html="optionInfo.data[key.toLowerCase()]"></span>
                        </el-checkbox>
                    </div>
                    <!-- 简答 -->
                    <md-editor @on-upload-img="onUploadImg" @onHtmlChanged="handelHtmlChange" v-model="editorText"
                        placeholder="在此输入你的答案,支持markdown格式" v-show="questionInfo.data.typeId == 3">
                    </md-editor>
                    <div v-show="answerVisible">
                        <div>
                            <span style="color:red ;margin-right: 10px;">正确答案</span>
                            <span v-html="rightAnswer.data.rightAnswer" />
                        </div>
                        <div>
                            <span style="color:green ;margin-right: 10px;">我的答案</span>
                            <span v-html="rightAnswer.data.answerText" />
                        </div>
                        <div>
                            <span style="color:red ;margin-right: 10px;">解析</span>
                            <span v-html="rightAnswer.data.analysis" />
                        </div>
                    </div>
                </el-main>
            </el-container>
            <el-divider />
            <el-footer>
                <el-container>
                    <el-aside width="200px">
                        <div style="color:gray ;">
                            试题描述:{{ questionInfo.data.describe }}

                        </div>
                        <el-button v-if="!isFavorite" type="warning" :icon="Star" circle @click="addFavorite" />
                        <el-button v-if="isFavorite" type="warning" :icon="StarFilled" circle @click="delFavorite" />
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
                                <el-button type="success" auto-insert-space @click="answerQuestion">提交</el-button>
                            </el-col>
                        </el-row>
                    </el-main>
                </el-container>
            </el-footer>
        </el-container>
    </el-card>
</template>
<script setup>
import {
    Star,
    StarFilled
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import code from '@/api/code';
import link from '@/api/link';
import url from '@/api/url';
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useStore } from 'vuex';
import { isQuestionFavorite, addFavoriteQuestion, deleteFavoriteQuestion } from '../../../api/api';

const store = useStore();

MdEditor.config({
    editorConfig: {
        renderDelay: 0
    }
});

const props = defineProps({
    qid: Number,
    cid: Number,
})
const questionId = ref(0);
const chapterId = ref(0);
/**
 * 跳过已作答题目
 */
const skipAnswered = ref(true);
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
const getQuestionInfo = async (qid, callback) => {
    const response = await link(url.question.getQuestionById(qid), "get");
    if (response.data.code == code.NORMAL_SUCCESS) {
        questionInfo.data = response.data.data
        callback(questionInfo.data);
        return
    } else {
        ElMessage.error(response.data.msg);
        callback('');
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
    const response = await link(url.questionOption.get(qid), "get");
    if (response.data.code == code.NORMAL_SUCCESS) {
        optionInfo.data = response.data.data
    } else {
        ElMessage.error(response.data.msg);
        optionInfo.data = {};
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
const isFavorite = ref(false);
watch(
    questionId,
    async (val) => {
        for (let o in selectInfo) {
            selectInfo[o] = false;
        }
        if (questionInfo.data.typeId != 3) {
            getOptionInfo(val)
        }

        const response = await isQuestionFavorite(val, store.state.username);
        if (response.data.code == code.NORMAL_SUCCESS) {
            isFavorite.value = response.data.data;
        }
    }
)
const addFavorite = () => {
    ElMessageBox.confirm(
        '确认添加到收藏夹?',
        '收藏题目',
        { confirmButtonText: '确认', cancelButtonText: '取消', type: 'success', }
    ).then(async () => {
        const response = await addFavoriteQuestion(questionId.value, store.state.username);
        if (response.data.code == code.NORMAL_SUCCESS) {
            ElMessage.success(response.data.msg);
            isFavorite.value = true;
        } else {
            ElMessage.error(response.data.msg);
        }
    }).catch(() => { })
}
const delFavorite = () => {
    ElMessageBox.confirm(
        '确认将该题从收藏夹删除?',
        '收藏题目',
        { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning', }
    ).then(async () => {
        const response = await deleteFavoriteQuestion(questionId.value, store.state.username);
        if (response.data.code == code.NORMAL_SUCCESS) {
            ElMessage.success(response.data.msg);
            isFavorite.value = false;
        } else {
            ElMessage.error(response.data.msg);
        }
    }).catch(() => { })
}
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
 * 正确答案是否可见
 */
const answerVisible = ref(false);
/**
 * 问题正确答案
 */
const rightAnswer = reactive({ data: {} })
/**
 * 获取题目正确答案以及答题详细
 * @param {Number} qid 
 */
const getAnswerDetail = async (qid, questionType = 1) => {
    const response = await link(url.questionRightAnswer.get(qid), "get");
    if (response.data.code == code.NORMAL_SUCCESS) {
        rightAnswer.data = response.data.data
        console.log(questionInfo.typeId);
        if (questionType != 3) {
            let ans = response.data.data.rightAnswer;
            for (let o in selectInfo) {
                selectInfo[o] = false;
            }
            ans = ans.split("-")
            for (let o in ans) {
                selectInfo[ans[o]] = true;
            }
        } else {
            editorText.value = rightAnswer.data.answerText;
        }
    }
    else {
        ElMessage.error(response.data.msg);
    }
}

/**
 * 上一题
 */
const questionPrev = async () => {
    answerVisible.value = false;
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
    if (skipAnswered.value == true) {
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
    if (status == true) {
        getAnswerDetail(questionId.value, questionInfo.data.typeId);
        answerVisible.value = true;
    }
}
/**
 * 下一题
 */
const questionNext = async () => {
    answerVisible.value = false;
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
    if (skipAnswered.value == true) {
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
    if (status == true) {
        getAnswerDetail(questionId.value, questionInfo.data.typeId);
        answerVisible.value = true;
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
 * 提交问题答案
 * @param {*} data 答案数据 
 * @param {Number} qid 问题ID
 */
const submitAnswer = async (data, qid) => {
    const ans = {
        answer: data,
        questionID: qid
    }
    const response = await link(url.question.answer, "post", ans);
    if (response.data.code == code.NORMAL_SUCCESS) {
        getAnswerDetail(qid, questionInfo.data.typeId);
        answerVisible.value = true;
    }
    else {
        ElMessage.error(response.data.msg);
    }
}
/**
 * 答题
 */
const answerQuestion = () => {
    let ans = '';
    if (questionInfo.data.typeId != 3) {
        for (let o in selectInfo) {
            if (selectInfo[o] == true) {
                ans = ans + o + '-';
            }
        }
        ans = ans.substring(0, ans.length - 1);
    } else {
        ans = editorHtml.value;
    }
    if (ans.length == 0) {
        ElMessage.error("答案不能为空");
        return;
    }
    submitAnswer(ans, questionId.value);
}
onMounted(async () => {
    questionId.value = props.qid;
    chapterId.value = props.cid;
    getQuestionList(props.cid);
    getQuestionInfo(props.qid, async (data) => {
        const answered = await isQuestionAnswered(questionId.value);
        answerVisible.value = answered;
        if (answered) getAnswerDetail(questionId.value, data.typeId);
    });

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
    display: inline-block;
    margin-right: 15px;
}
</style>
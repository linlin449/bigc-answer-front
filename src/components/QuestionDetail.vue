<template>
    <el-dialog :model-value="props.dialogTableVisible" width="70%" top="20px" title="题目详细" @open="handelOpen"
        @closed="emit('before-close')">
        <el-container>
            <el-container>
                <el-aside width="200px">
                    <el-space direction="vertical" alignment="flex-start" class="box-left">
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
                        <el-checkbox disabled v-model="selectInfo[key]" size="large"
                            v-show="optionInfo.data[key.toLowerCase()] != null" @change="handelSelect(key)"
                            style="width:100% ;height: auto;">
                            <span>{{ key }}.</span><span v-html="optionInfo.data[key.toLowerCase()]"></span>
                        </el-checkbox>
                    </div>
                    <!-- 简答 -->
                    <div v-html="editorText" v-show="questionInfo.data.typeId == 3" class="answer-text" />
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
                </el-container>
            </el-footer>
        </el-container>
    </el-dialog>
</template>
<script setup>
import {
    Star,
    StarFilled
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, reactive, ref, watch } from 'vue';
import code from '@/api/code';
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useStore } from 'vuex';
import {
    isQuestionFavorite,
    addFavoriteQuestion,
    deleteFavoriteQuestion,
    getQuestionById,
    getOptionById,
    checkQuestionStatus,
    getRightAnswerById
} from '../api/api';

const store = useStore();

MdEditor.config({
    editorConfig: {
        renderDelay: 0
    }
});

const props = defineProps({
    dialogTableVisible: Boolean,
    qid: Number
})

const emit = defineEmits([
    "before-close"
])
const questionId = ref(0);

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
    const response = await getQuestionById(qid);
    if (response.data.code == code.NORMAL_SUCCESS) {
        questionInfo.data = response.data.data
        callback(questionInfo.data)
    } else {
        ElMessage.error(response.data.msg);
        callback('')
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
    const response = await getOptionById(qid)
    if (response.data.code == code.NORMAL_SUCCESS) {
        optionInfo.data = response.data.data
    } else {
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
/**
 * 检查某题答题状态
 * @param {Number} qid 问题ID
 */
const isQuestionAnswered = async (qid) => {
    const response = await checkQuestionStatus(qid, store.state.username);
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
const getAnswerDetail = async (qid, typeId = 1) => {
    const response = await getRightAnswerById(qid)
    if (response.data.code == code.NORMAL_SUCCESS) {
        rightAnswer.data = response.data.data
        if (typeId != 3) {
            let ans = response.data.data.rightAnswer;
            for (let o in selectInfo) {
                selectInfo[o] = false;
            }
            ans = ans.split("-")
            for (let o in ans) {
                selectInfo[ans[o]] = true;
            }
        } else {
            editorText.value = response.data.data.answerText;
        }
    }
    else {
        ElMessage.error(response.data.msg);
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

const handelOpen = async () => {
    questionId.value = props.qid;
    getQuestionInfo(props.qid, async (data) => {
        const answered = await isQuestionAnswered(questionId.value);
        answerVisible.value = answered;
        if (answered) getAnswerDetail(questionId.value, data.typeId);
    });


}
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

.answer-text {
    min-height: 100px;
    margin-top: 20px;
    border: 1px solid;
    padding-top: 10px;
    padding-left: 10px;
}
</style>
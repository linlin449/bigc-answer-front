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
                    <div v-for="(_, key) in selectInfo" class="question-option">
                        <el-checkbox v-model="selectInfo[key]" size="large"
                            v-show="optionInfo.data[key.toLowerCase()] != NULL" @change="handelSelect(key)"
                            style="width:100% ;">
                            <span>{{ key }}.</span><span v-html="optionInfo.data[key.toLowerCase()]"></span>
                        </el-checkbox>
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
import { computed, onMounted, reactive } from 'vue';
import code from '@/api/code';
import link from '@/api/link';
import url from '@/api/url';
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps({
    qid: Number,
    sid: Number,
})

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
    const response = await link(url.questionOption.get(qid), "get");
    if (response.data.code == code.NORMAL_SUCCESS) {
        optionInfo.data = response.data.data
    } else {
        ElMessage.error(response.data.msg);
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
 * 上一题
 */
const questionPrev = () => {

}
/**
 * 下一题
 */
const questionNext = () => {

}
/**
 * 答题
 */
const questionAnswer = () => {

}
onMounted(() => {
    getQuestionInfo(props.qid);
    getOptionInfo(props.qid)
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
}

.question-option {
    border: 1px solid transparent;
    border-radius: 10px;
    font-size: 25px;
    margin-top: 10px;
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
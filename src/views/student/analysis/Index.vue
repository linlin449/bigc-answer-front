<template>

    <div class="question-box">
         <el-button type="primary" @click="TotalInfo" style="margin-bottom: 10px;">总体情况</el-button>
        <el-table @row-click="clickRow" :data="wrongQuestionPage.data.records" border style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column prop="title" label="问题" header-align="center" show-overflow-tooltip>
                <template #default="scope">
                    <div style="display: flex; align-items: center" v-html="scope.row.title" />
                </template>
            </el-table-column>
            <el-table-column prop="describe" label="描述" width="180" header-align="center" />
            <el-table-column prop="score" label="分数" width="80" align="center" header-align="center" sortable>
                <template #default="scope">
                    <el-tag type="info" round disable-transitions>{{
                            scope.row.score
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="level" label="难度" width="80" align="center" header-align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.level === '困难'" type="danger" disable-transitions>{{ scope.row.level }}
                    </el-tag>
                    <el-tag v-if="scope.row.level === '简单'" type="success" disable-transitions>{{ scope.row.level }}
                    </el-tag>
                    <el-tag v-if="scope.row.level === '中等'" type="warning" disable-transitions>{{ scope.row.level }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="80" align="center" header-align="center"><template
                    #default="scope">
                    <el-tag v-if="scope.row.type === '单选'" disable-transitions>{{
                            scope.row.type
                    }}</el-tag>
                    <el-tag v-if="scope.row.type === '多选'" type="success" disable-transitions>{{ scope.row.type }}
                    </el-tag>
                    <el-tag v-if="scope.row.type === '简答'" type="info" disable-transitions>{{ scope.row.type }}</el-tag>
                </template></el-table-column>
        </el-table>
         <el-pagination style="margin-top: 10px; margin-left:-5px ;" v-model:currentPage="wrongQuestionPage.data.current" layout="prev, pager, next"
        :total="wrongQuestionPage.data.total" @current-change="handleCurrentChange" />
    </div>
    <StudentAnalysVue :dialogTableVisible="analysShow" :username="store.state.username" @before-close="analysShow = false" />
     <QuestionDetail :qid="questionId" v-model:dialogTableVisible="dialogTableVisible"
      @before-close="dialogTableVisible = false; isEdit = false">
    </QuestionDetail>
</template>

<script setup>
import { useCookies } from 'vue3-cookies'
import { reactive, watch, onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import link from "@/api/link.js";
import url from "@/api/url.js";
import code from "@/api/code.js";
import sortQuestion from "@/util/sortQuestion.js";
import * as check from "@/util/verfifcation.js";
import { ElMessage } from "element-plus";
import { useStore } from 'vuex';
import StudentAnalysVue from '@/components/StudentAnalys.vue';
import QuestionDetail from '@/components/QuestionDetail.vue'
const store = useStore();
const { cookies } = useCookies()
const dialogTableVisible = ref(false);
let questionId=ref('')
// 鼠标点击题目事件
let clickRow = (row, column, event) => {
    dialogTableVisible.value=true
    questionId.value=row.id
};

let analysShow=ref(false)
let TotalInfo=()=>{
    analysShow.value=true
}

let ErrorCode=code
let router = useRouter();
const currentUsername=store.state.username;
//得到当前页的错题
let wrongQuestionPage=reactive({data:{}})
let getCurrentPageWrongQuestion = async (currentPage, username) => {
    let path = url.wrongQuestion.get(currentPage, username)
    const response = await link(path)
    if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
        return ElMessage.error(response.data.msg);
    } else {
        wrongQuestionPage.data = response.data.data;
        wrongQuestionPage.data.records=sortQuestion(response.data.data.records);
    }
}
const handleCurrentChange = (currentPage) => {
  getCurrentPageWrongQuestion(currentPage, currentUsername);
}



onMounted(() => {
  getCurrentPageWrongQuestion(1,currentUsername)
})
</script>


<style scoped>
.question-box{
    width: 980px;
    margin: 0 auto;
    margin-top: 20px;
}
</style>
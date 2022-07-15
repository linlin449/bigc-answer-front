<template>
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
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { onMounted, reactive } from 'vue';
import code from '../../../api/code';
import link from '../../../api/link';
import url from '../../../api/url';

const ErrorCode = code

const teacherList = reactive({ data: {} })
const getTeacherList = async () => {
    const response = await link(url.teacher.getList, "get")
    if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
        ElMessage.error(response.data.msg);
    }
    teacherList.data = response.data
}
onMounted(() => {
    getTeacherList()
})
</script>

<style>
</style>
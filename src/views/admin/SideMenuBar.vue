<template>
    <el-menu :default-active="activeMenu" class="side-menu" unique-opened @select="handelSelect">
        <el-sub-menu index="questionManage">
            <template #title>
                <el-icon>
                    <Notebook />
                </el-icon>
                <span>考题管理</span>
            </template>
            <el-menu-item index="questionAdmin">
                <el-icon>
                    <Reading />
                </el-icon>
                <span>查看考题</span>
            </el-menu-item>
            <el-menu-item index="questionAdminAdd">
                <el-icon>
                    <Plus />
                </el-icon>
                <span>新增考题</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="examManage">
            <template #title>
                <el-icon>
                    <Document />
                </el-icon>
                <span>考试管理</span>
            </template>
            <el-menu-item index="examAdmin">
                <el-icon>
                    <DocumentChecked />
                </el-icon>
                <span>查看考试</span>
            </el-menu-item>
            <el-menu-item index="examAdminAdd">
                <el-icon>
                    <DocumentAdd />
                </el-icon>
                <span>新增考试</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="studentManage">
            <template #title>
                <el-icon>
                    <User />
                </el-icon>
                <span>学生管理</span>
            </template>
            <el-menu-item index="studentAdmin">
                <el-icon>
                    <View />
                </el-icon>
                <span>查看学生</span>
            </el-menu-item>
            <el-menu-item index="studentAdminAdd">
                <el-icon>
                    <Plus />
                </el-icon>
                <span>添加学生</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="teacherManage">
            <template #title>
                <el-icon>
                    <User />
                </el-icon>
                <span>老师管理</span>
            </template>
            <el-menu-item index="teacherAdmin">
                <el-icon>
                    <View />
                </el-icon>
                <span>查看老师</span>
            </el-menu-item>
            <el-menu-item index="teacherAdminAdd">
                <el-icon>
                    <Plus />
                </el-icon>
                <span>添加老师</span>
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>
<script setup>
import { Notebook, Reading, Plus, Document, DocumentChecked, DocumentAdd, User, View } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

// 菜单默认激活项
const activeMenu = ref('')
// 菜单子项被点击
const handelSelect = (index) => {
    // 路由跳转
    router.push({ name: index })
}
onMounted(() => {
    // 从路由获取并设置默认激活页面
    activeMenu.value = router.currentRoute.value.name
})


</script>
<style>
</style>
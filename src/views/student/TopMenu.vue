<template>
  <el-menu
    :default-active="activeMenu"
    class="el-menu-demo"
    mode="horizontal"
    unique-opened
    @select="handleSelect"
  >
    <el-menu-item index="0">LOGO</el-menu-item>
    <el-menu-item index="1">关于</el-menu-item>
    <el-menu-item index="answerStudent">答题</el-menu-item>
    <el-menu-item index="examStudent">考试</el-menu-item>
    <el-menu-item index="favoriteStudent">记录</el-menu-item>
    <el-menu-item index="2">个人信息</el-menu-item>
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
const handleSelect = (index) => {
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

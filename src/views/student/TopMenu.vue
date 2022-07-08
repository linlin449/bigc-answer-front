<template>
  <div class="body">
    <el-menu
      :default-active="about"
      class="el-menu"
      mode="horizontal"
      unique-opened
      color=""
      @select="handleSelect"
    >
      <el-menu-item index="about" class="index"
        ><el-icon :size="50">
          <House />
        </el-icon>
        <span>主页</span></el-menu-item
      >
      <el-menu-item index="answerStudent" class="answer">
        <el-icon :size="50"><EditPen /></el-icon>
        <span>答题</span>
      </el-menu-item>
      <el-menu-item index="examStudent"
        ><el-icon :size="50"><DocumentChecked /></el-icon><span>考试</span></el-menu-item
      >
      <el-menu-item index="favoriteStudent">
        <el-icon :size="50"><DataAnalysis /></el-icon>
        <span>记录</span></el-menu-item
      >
      <div class="one"></div>
      <el-menu-item index="2" class="user">
        <el-icon :size="50"><User /></el-icon><span>个人信息</span></el-menu-item
      >
    </el-menu>
  </div>
</template>

<script setup>
import {
  House,
  EditPen,
  DataAnalysis,
  Document,
  DocumentChecked,
  DocumentAdd,
  User,
  View,
} from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

// 菜单默认激活项
const activeMenu = ref("");
// 菜单子项被点击
const handleSelect = (index) => {
  // 路由跳转
  router.push({ name: index });
};
onMounted(() => {
  // 从路由获取并设置默认激活页面
  activeMenu.value = router.currentRoute.value.name;
});
</script>

<style lang="scss" scoped>
.body{
  width: 80%;
  display: inline-block;
  height: 80px;
  box-shadow: 0 6px 12px 0 rgba(138, 153, 150, 0.15);
  .el-menu{
    width: 100%;
    height: 100%;
    border: 0px;
    .icon{
      width: 30px;
      height: 50px;
    }
    .el-menu-item{
      margin-left: 10%;
      width: 10%;
      font-size: 25px;
    }
    .index{
      margin-left: 0%;
    }
    .answer{
      margin-left:15%;
    }
    .user{
      margin-left: 14%;
    }
  }
  
}

</style>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <!-- 左侧菜单栏 -->
        <SideMenuBarVue />
      </el-aside>
      <el-container>
        <el-header>
          <!-- 顶部 -->
          Header
        </el-header>
        <el-main>
          <!-- 主内容区域 -->
          <router-view></router-view>
        </el-main>
        <el-footer>
          <!-- 底部 -->
          Footer
        </el-footer>
      </el-container>
    </el-container>
  </div>

</template>

<script setup>
import { onMounted } from 'vue';
import SideMenuBarVue from './SideMenuBar.vue';



onMounted(() => {
  //TODO 判断登陆状态,未登录跳转登录页
})
</script>

<style>
</style>
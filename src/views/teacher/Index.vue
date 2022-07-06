<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <!-- 左侧菜单栏 -->
        <MenuBarVue />
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>

</template>

<script setup>
import MenuBarVue from './MenuBar.vue';
</script>

<style>
</style>
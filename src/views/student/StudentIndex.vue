<template>
<div class="body-index">
    <el-container >
      <el-header class="header">
        <TopMenu />
      </el-header>
      <el-main class="main">
        <div></div>
        <router-view></router-view>
      </el-main>
    </el-container>
</div>
</template>

<script setup>
import TopMenu from "./TopMenu.vue";
</script>

<style lang="scss">
.body-index {
  height: 100%;
  width: 100%;
  background-image: url("../../assets/background.jpg");
  background-size: cover;
  .header {
    text-align: center;
    padding: 0px;
    width:1678px;
  }
  .main {
    text-align: center;
    padding: 0px;
    padding-top: 30px;
    height: 100%;
    width:1678px;
  }
}
</style>

<template>
   <div class="common-layout">
    <el-container>
      <el-header>
        <TopMenu/>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import TopMenu from "./TopMenu.vue"
</script>

<style>

</style>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <TopMenu />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <LeftMenu />
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import LeftMenu from "../../components/LeftMenu.vue";
import TopMenu from "../../components/TopMenu.vue";
</script>

<style>
.el-main{
background-color: rgb(217, 216, 216);
}
.common-layout{
background-color: rgb(255, 255, 255);
}

</style>

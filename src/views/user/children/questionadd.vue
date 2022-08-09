<template>
    <el-card class="box-card">
        <questionAdd :add="true"></questionAdd>
    </el-card>
</template>
<script setup>
import questionAdd from './components/questionadd.vue';
</script>
<style>
.box-card {
    width: 710px;
    margin-left: 25%;
}
</style>
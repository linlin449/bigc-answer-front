<template>
  <el-menu :default-active="activeMenu" class="side-menu" unique-opened @select="handelSelect">
    <template v-for="item in MenuData" :key="item.id">
      <el-sub-menu :index="item.index" v-if="item.children" :disabled="item.disabled">
        <template #title>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item :index="e.index" v-for="e in item.children" :key="e.id" :disabled="e.disabled">
          <el-icon>
            <component :is="e.icon"></component>
          </el-icon>
          <span>{{ e.name }}</span>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item :index="item.index" v-else>
        <template #title>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script setup>
import {
  Notebook,
  Plus,
  DocumentChecked,
  DocumentAdd,
  User,
  View,
} from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
const MenuData = [
  {
    id: 1,
    name: "考题管理",
    index: "question",
    icon: Notebook,
    disabled:false,
    children:  [
      { id: 1, index: "questionAdmin", name: "查看考题", icon: DocumentChecked, disabled:false },
      { id: 2, index: "questionAdminAdd", name: "新增考题", icon: DocumentAdd, disabled:false },
      { id: 3, index: "subjectAdminAdd", name: "查看章节", icon:  DocumentChecked, disabled:false  },
    ],
  },
  {
    id: 3,
    name: "学生管理",
    index: "studentManage",
    icon: User,
    disabled:false,
    children: [
      { id: 1, index: "studentAdmin", name: "查看学生", icon: View, disabled:false},
      { id: 2, index: "studentAdminAdd", name: "新增学生", icon: Plus, disabled: store.state.role != 3 },
    ],
  },
  {
    id: 4,
    name: "老师管理",
    index: "teacherManage",
    icon: User,
    disabled: store.state.role != 3,
    children: [
      { id: 1, index: "teacherAdmin", name: "查看老师", icon: View, disabled:false },
      { id: 2, index: "teacherAdminAdd", name: "新增老师", icon: Plus, disabled:false },
    ],
  },
  sdfsdf
];
// 菜单默认激活项
const activeMenu = ref("");
// 菜单子项被点击
const handelSelect = (index) => {
  // 路由跳转
  router.push({ name: index });
};
onMounted(() => {
  // 从路由获取并设置默认激活页面
  activeMenu.value = router.currentRoute.value.name;
  handelSelect('questionAdmin')
});
</script>

<style>
.common-layout,
.el-container,
.el-aside,
body,
#app,
html {
  height: 100%;
}
.side-menu{
  height: 1000px;
}
</style>

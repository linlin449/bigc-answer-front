<!--学生考试首页-->
<template>
  <div id="student">
    <el-row class="padding-50">
      <el-col :span="24">
        <ul class="list">
          <li class="logo"><span>Bigc-Answer</span></li>
          <li @click="handelSelect('answerStudent')">答题</li>
          <li @click="handelSelect('examStudent')">考试</li>
          <li @click="handelSelect('analysisStudent')">分析</li>
          <li @click="handelSelect('favoriteStudent')">收藏</li>
          <li class="right" @mouseenter="flag = !flag" @mouseleave="flag = !flag">
            <span>{{ studentInfo.data.name }}</span>
            <div class="msg" v-if="flag">
              <p @click="manage()">个人信息</p>
              <p class="exit" @click="exit()">退出</p>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>
    <!--路由区域-->
    <div class="main">
      <router-view></router-view>
    </div>
    <myfooter></myfooter>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue"
import { useRouter } from 'vue-router';
import { useStore } from "vuex";
import code from "../../api/code";
import link from "../../api/link";
import url from "../../api/url";
import myfooter from "../../components/myFooter.vue"

const ErrorCode = code;
const store = useStore()
const router = useRouter()
let flag = ref(false)
let handelSelect = (index) => {
  router.push({ name: index })
}
let manage = () => {

}
let exit = () => {

}
// 学生信息
const studentInfo = reactive({ data: {} })
const getStudentInfo = async () => {
  let response = await link(url.student.getInfo(store.state.username), "get")
  if (response.data.code === ErrorCode.NORMAL_SUCCESS) {
    studentInfo.data = response.data.data.student
  }
}
onMounted(() => {
  getStudentInfo()
})
</script>

<style lang="scss" scoped>
.right {
  margin-right: 6px;

}

.icon {
  display: inline-block;
  margin-right: 10px;
}

.name {
  display: inline-block;
}

#student .padding-50 {
  margin: 0 auto;
  padding: 0 50px;
  box-shadow: 0 0 10px 4px rgba(1, 149, 255, 0.1);
  background-color: #fff;
}

.list a {
  text-decoration: none;
  color: #334046;
}

li {
  list-style: none;
  height: 60px;
  line-height: 60px;
}

#student .list {
  display: flex;
}

#student .list li {
  padding: 0 20px;
  cursor: pointer;
}

#student .list li:hover {
  background-color: #0195ff;
  transition: all 1.5s ease;
}

#student .list li:hover a {
  color: #fff;
}

#student .list .right {
  margin-left: auto;
  position: relative;
}

#student .list li.right :hover a {
  color: #000;
}

#student .list .logo {
  display: flex;
  font-weight: bold;
  color: #2f6c9f;
}

#student .list .logo i {
  font-size: 50px;
}

.right .msg {
  text-align: center;
  position: absolute;
  top: 60px;
  left: 0px;
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  border-bottom: 3px solid #0195ff;
  background-color: #fff;
}

.right .msg p {
  height: 40px;
  line-height: 40px;
  width: 105px;
}

.right .msg p:hover {
  background-color: #0195ff;
}
</style>

<template>
  <div id="Answer">
    <div v-for="v in MenuData" class="subject-box" :key="v.subject_id">
      <h5 class="title">{{ v.subject_name }}</h5>
      <ul class="chapter-menu">
        <li
          v-for="val in v.children"
          :class="{ current: val.current }"
          :key="val.chapter_id"
          @click="clickChapterMenu(val)"
        >
          {{ val.chapter_name }}
        </li>
      </ul>
    </div>
    <div class="question-box">
      <ul class="question-menu">
        <li
          class="question-li"
          v-for="val in questionMenuData"
          :key="val.question_id"
          @click="clickQuestionMenu(val)"
        >
         {{val.question_name}}{{val.question_diff}}  
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import link from "../../../api/link.js";
import url from "../../../api/url.js";
import code from "../../../api/code.js";
/**
 * 课程和对应的章节数据
 */
const MenuData = reactive([
  {
    subject_name: "力学",
    subject_id: "1",
    children: [
      { chapter_name: "第一章", chapter_id: "1", current: true },
      { chapter_name: "第二章", chapter_id: "2", current: false },
    ],
  },
  {
    subject_name: "电学",
    subject_id: "2",
    children: [
      { chapter_name: "第一章", chapter_id: "1", current: false },
      { chapter_name: "第二章", chapter_id: "2", current: false },
    ],
  },
]);
let getChapter=async()=>{
  let response=await link(url.allChapter);
  MenuData=response.data.data;
}
let clickChapterMenu = (val) => {
  MenuData.forEach((element) => {
    element.children.forEach((e) => {
      e.current = false;
    });
  });
  val.current = true;
  getAllQuestion(val.chapter_id)//根据chapterid查询question
};
let getAllQuestion=async(id)=>{
  let response=await link(url.question.getAllQuestion,"get",id)
  questionMenuData=response.data.data;
}
/**
 * 问题的列表
 */
const questionMenuData = reactive([
  {
   question_name:"one",
   question_id:"1",
   question_discript:"重要题目",
   question_diff:"难"
  },
  {
   question_name:"one",
   question_id:"2",
   question_discript:"重要题目",
   question_diff:"难"
  },
  {
   question_name:"one",
   question_id:"3",
   question_discript:"重要题目",
   question_diff:"难"
  },
]);
let clickQuestionMenu = (val) => {
  MenuData.forEach((element) => {
    element.children.forEach((e) => {
      e.current = false;
    });
  });
  val.current = true;
  //TODO 根据questionid查询问题细节，进入答题界面
  //传送过去的是一整个questionMenuData
};
/**
 * 初始化
 */
onMounted(()=>{
  
})

</script>

<style lang="scss" scoped>
#Answer {
  width: 980px;
  margin: 0 auto;
  .subject-box {
    margin: 20px;
    .title {
      cursor: pointer;
      float: left;
      margin: auto;
      background-color: rgba(228, 238, 41, 0.5);
      text-align: center;
      width: 15%;
      line-height: 50px;
      font-size: 20px;
      color: rgb(231, 21, 21);
      border-radius: 8px;
    }
    .chapter-menu {
      padding: 0;

      padding-top: 10px;
      padding-bottom: 10px;
      li {
        text-align: center;
        cursor: pointer;
        display: inline-block; //行内块
        margin: auto;
        width: 15%;
        line-height: 50px;
        font-size: 20px;
        color: rgb(231, 21, 21);
        border-radius: 8px;
      }
      li:hover {
        background-color: #9ed1f7;
        transition: all 1.5s ease;
      }
      .current {
        background-color: #9ed1f7;
      }
    }
  }
  .question-box {
    background-color: #fff;
    .question-menu {
      li{
        cursor: pointer;
        margin-top: 10px;
      }
       li:hover {
        background-color: #9ed1f7;
        transition: all 1.5s ease;
      }
    }
  }
}
</style>

import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/userLogin",
    name: "userLogin",
    component: () => import("../views/userLogin.vue"),
  },
  // 学生界面
  {
    path: "/student",
    name: "student",
    component: () => import("../views/student/StudentIndex.vue"),
    children: [
      {
        path: "analysis",
        name: "analysisStudent",
        component: () => import("../views/student/analysis/Index.vue"),
      },
      {
        path: "answer",
        name: "answerStudent",
        component: () => import("../views/student/answer/StudentAnswer.vue"),
      },
      {
        path: "exam",
        name: "examStudent",
        component: () => import("../views/student/exam/StudentExam.vue"),
      },
      {
        path: "favorite",
        name: "favoriteStudent",
        component: () => import("../views/student/favorite/favoriteStudent.vue"),
      },
      {
        path: "/ans/:cid/:qid",
        name: "answerQuestion",
        component: () => import("../views/student/answer/AnswerQuestion.vue"),
        props: true,
      },
    ],
  },
  {
    path: "/user",
    name: "user",
    component: () => import("../views/user/Index.vue"),
    children: [
      {
        path: "student",
        name: "studentAdmin",
        component: () => import("../views/user/children/Student.vue"),
      },
      {
        path: "studentAdminAdd",
        name: "studentAdminAdd",
        component: () => import("../views/user/children/StudentAdd.vue"),
      },
      {
        path: "question",
        name: "questionAdmin",
        component: () => import("../views/user/children/question.vue"),
      },
      {
        path: "question",
        name: "questionAdminAdd",
        component: () => import("../views/user/children/questionadd.vue"),
      },
      {
        path: "teacher",
        name: "teacherAdmin",
        component: () => import("../views/user/children/Teacher.vue"),
      },
      {
        path: "teacheradd",
        name: "teacherAdminAdd",
        component: () => import("../views/user/children/TeacherAdd.vue"),
      },
    ]
  }
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(),
  routes,
});
export default router;

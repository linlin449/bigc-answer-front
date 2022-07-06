import { createRouter, createWebHistory } from "vue-router";

const routes = [
  // 主页,即登录页
  {
    path: "/",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  // 管理员界面
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/admin/Index.vue"),
    children: [
      {
        path: "/exam",
        name: "exam",
        component: () => import("../views/admin/exam/Index.vue"),
      },
      {
        path: "/question",
        name: "question",
        component: () => import("../views/admin/question/Index.vue"),
      },
      {
        path: "/student",
        name: "student",
        component: () => import("../views/admin/student/Index.vue"),
      },
      {
        path: "/teacher",
        name: "teacher",
        component: () => import("../views/admin/teacher/Index.vue"),
      },
    ],
  },
  // 学生界面
  {
    path: "/student",
    name: "student",
    component: () => import("../views/student/Index.vue"),
    children: [
      {
        path: "/analysis",
        name: "analysis",
        component: () => import("../views/student/analysis/Index.vue"),
      },
      {
        path: "/answer",
        name: "answer",
        component: () => import("../views/student/answer/Index.vue"),
      },
      {
        path: "/exam",
        name: "exam",
        component: () => import("../views/student/exam/Index.vue"),
      },
      {
        path: "/favorite",
        name: "favorite",
        component: () => import("../views/student/false/Index.vue"),
      },
    ],
  },
  // 老师界面
  {
    path: "/teacher",
    name: "teacher",
    component: () => import("../views/teacher/Index.vue"),
    children: [
      {
        path: "/analysis",
        name: "analysis",
        component: () => import("../views/teacher/analysis/Index.vue"),
      },
      {
        path: "/exam",
        name: "exam",
        component: () => import("../views/teacher/exam/Index.vue"),
      },
      {
        path: "/question",
        name: "question",
        component: () => import("../views/teacher/question/Index.vue"),
      },
      {
        path: "/student",
        name: "student",
        component: () => import("../views/teacher/student/Index.vue"),
      },
    ],
  },


];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(),
  routes,
});
export default router;

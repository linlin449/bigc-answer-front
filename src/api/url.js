let url = {
  login: {
    student: "/api/student/login",
    admin: "/api/admin/login",
    teacher: "/api/teacher/login",
  },
  getcaptcha: "/api/captcha/getcaptcha",
  register: "/api/student/register",
  student: {
    getInfo: (username) => {
      return "/api/student/info/" + username;
    },
  },
  allChapter: "/api/chapter/", //得到全部的课程信息，返回数据格式是StudentAnswer的MenuData
  question: {
    // getQuestionByChapterId:"/api/question/chapter/1",
    getQuestionByChapterId: (id) => {
      return "/api/question/chapter/" + id;
    },
    getQuestionById: (question_id) => {
      return "/api/question/" + question_id;
    },
  },
};

export default url;

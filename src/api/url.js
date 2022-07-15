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
    getListByPage: (page) => {
      return "/api/student/list/" + page
    },
    getListByTeacher: (username, page) => {
      return "/api/teacher/students/" + username + "/list/" + page;
    },
    deleteTeacherStudent: (teacherUsername, studentId) => {
      return "/api/teacher/" + teacherUsername + "/deletestudent/" + studentId;
    },
    addTeacherStudent: (teacherUsername, studentId) => {
      return "/api/teacher/" + teacherUsername + "/addstudent/" + studentId;
    }
  },
  teacher: {
    getInfo: (username) => {
      return "/api/teacher/info/" + username;
    },
  },
  admin: {
    getInfo: (username) => {
      return "/api/admin/info/" + username;
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
    getStudentQuestionInfo: (username) => {
      return "/api/question/info/student/" + username;
    },
    update:"/api/question/update",
    add:""
  },
  questionOption:{
    add:"/api/option/add",
    get:(questionId)=>{
      return "/api/option/question/"+questionId;
    },
    update:"/api/option/update"
  },
  questionRightAnswer:{
    add:"/api/rightanswer/add",
    get:(questionId)=>{
      return "/api/rightanswer/question/"+questionId;
    },
    update:"/api/rightanswer/update"
  }
};

export default url;

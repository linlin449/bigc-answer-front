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
      return "/api/student/info/" + username
    }
  },
  allChapter:"/api/getChapter",//得到全部的课程信息，返回数据格式是StudentAnswer的MenuData
  question:{
    getAllQuestion:(chapter_id)=>{
      return "/api/getAllQuestion/"+chapter_id//根据章节id得到对应的全部问题
    },
    getQuestionById:(question_id)=>{
      return "/api/getQuestion/"+question_id
    }
  }
};
export default url;

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
  }
};
export default url;

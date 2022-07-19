import code from "../api/code";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies()

function clearUser() {
    cookies.remove("token")
    const vuex = JSON.parse(localStorage.getItem("vuex"))
    if (vuex == null || vuex.role == 1) {
        window.location.href = "/"
    } else {
        window.location.href = "/userlogin"
    }
    localStorage.clear()
}
const catchError = {
    catch: function (response) {
        if (response != undefined && response.data != undefined) {
            const errorUrl = response.config.url
            switch (response.data.code) {
                case code.NORMAL_SUCCESS, code.NORMAL_ERROR:
                    //常规成功和错误
                    break;
                case code.NOTLOGIN_ERROR:
                    //未登录错误
                    console.log("未登录", errorUrl);
                    clearUser();
                    break;
                case code.INTERNAL_SERVER_ERROR:
                    console.log("服务器内部错误", errorUrl);
                    //服务器内部错误
                    break;
                case code.UNAUTHORIZED_ERROR:
                    //未授权错误
                    console.log("未授权", errorUrl);
                    //用户试图越权访问
                    clearUser();
                    break;
                case code.PARAMETER_ERROR:
                    //参数错误
                    console.log("参数错误", errorUrl);
                    break;
            }
        }
    }
}
export default catchError
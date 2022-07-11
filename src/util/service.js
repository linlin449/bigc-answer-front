import axios from "axios"
import catchError from './catchError'
let axiosurl = ""
import store from '../store'

const service = axios.create(
  {
    baseURL: axiosurl
  }
)

//请求拦截和响应拦截
// Add a request interceptor
service.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers["X-Token"] = store.state.token
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


// Add a response interceptor
service.interceptors.response.use(function (response) {
  // Do something with response data
  catchError.catch(response)
  return response;
}, function (error) {
  console.log("请求异常", error.config.url);
  switch (error.response.status) {
    case 404:
      //前端请求路径错误
      console.log("请求路径出错", error.config.url);
      break;
    default:
      //发送后端请求失败(后端服务器宕机,未启动服务等)
      // alert("未知错误")
      break;
  }
  // Do something with response error
  return Promise.reject(error);
});


export default service
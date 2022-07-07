import axios from "axios"
let axiosurl="http://localhost:8080"

const service=axios.create(
    {
        baseURL:axiosurl
    }
)

//请求拦截和响应拦截
// Add a request interceptor
service.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });


// Add a response interceptor
service.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    switch(error.response.status){
        case 404:
            alert("当前路径错误")
            break;
        default:
            alert("未知错误")
            break;
    }
    // Do something with response error
    return Promise.reject(error);
  });


export default service
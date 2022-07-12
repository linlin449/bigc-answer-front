//TODO 设置路由守卫
import router from './index'
import store from '../store'

const whiteList = ['/login']//白名单
router.beforeEach((to, from, next) => {
  if (store.state.token!="") {//判断是否登录，如果登录直接放行
    if (to.path === '/login') {
      next('/student')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {//在白名单里面直接放行
      next()
    } else {
      next('/login')
    }
  }
})

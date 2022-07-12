import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueCookies from 'vue3-cookies'
import './router/permission.js'
import SvgIcon from './components/SvgIcon/index.vue'// svg组件
const app = createApp(App)
app.component('svg-icon', SvgIcon)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(VueCookies)
app.mount('#app')

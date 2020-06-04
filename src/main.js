import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全体样式表
import './assets/css/global.css'

//导入axios
import axios from 'axios'
//配置基础地址
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

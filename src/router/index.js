import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Login from "../components/Login";

Vue.use(VueRouter)

const routes = [
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach(((to, from, next) => {
//to 将要访问的路劲
//from  代表从哪个路径来
//next 是一个函数  表示放行
//next():直接放行  next('/xxx'):强行转入某一个页面
  if (to.path === "/login") {
    next();
  } else {
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) {
      next("/login");
    } else {
      next();
    }
  }
}))

export default router

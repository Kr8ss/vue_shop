import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Login from "../components/Login";
import Welcome from "../components/Welcome";
import Users from "../components/user/Users";
import RolesList from "../components/rights/RolesList";
import RightsList from "../components/rights/RightsList"
import GoodsList from "../components/goods/GoodsList";
import AddGoods from "../components/goods/AddGoods";
import GoodsCate from "../components/goods/GoodsCate";

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: Users,
      },
      {
        path: '/roles',
        component: RolesList,
      },
      {
        path: '/rights',
        component: RightsList
      },
      {
        path: '/goods',
        component: GoodsList,
      },
      {
        path: '/goods/add',
        component: AddGoods,
      },
      {
        path: '/categories',
        component: GoodsCate,
      }
    ]
  },
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

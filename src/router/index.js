import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'

import { Message } from 'element-ui';

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login', },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
  
]

const router = new VueRouter({
  routes
})
// 路由守卫钩子
router.beforeEach((to, from, next) => {
  // 如果前往登录，直接放行
  if(to.path === '/login') return next();
  // 如果不是，则获取token,验证当前是否已经登录, 没登录就去登录
  if(!window.sessionStorage.getItem('token')) {
    Message.error('请登录');
    return next('/login');
  }
  next();
})

export default router

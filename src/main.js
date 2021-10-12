import Vue from 'vue';
import { Button, Select, Radio, Form, Input, FormItem, Message } from 'element-ui';
import App from './App.vue'
import router from './router'

import './assets/fonts/iconfont.css'//阿里字体图标
import './assets/css/global.css'//全局样式

import axios from 'axios'//axios请求库
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
Vue.prototype.$http = axios//将axios配置到Vue原型
// 结论： 通过this.$http调用，一开始会先在当前组件的__proto__找$http，如果没有则去父组件的__proto__
// 直到找到根组件vm的__proto__的$http，再进行调用，Vue会帮助我们去找，用户只需要在Vue.prototype上添加自己需要的属性即可

// 配置消息弹框
Vue.prototype.$message = Message;

Vue.config.productionTip = false

Vue.use(Button);
Vue.use(Select);
Vue.use(Radio);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);


let vm = new Vue({
  router,//导入路由
  render: h => h(App)//挂载App组件作为根组件进行渲染
}).$mount('#app')
console.log("根组件",vm);

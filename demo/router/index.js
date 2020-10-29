import Vue from 'vue'
import VueRouter from 'vue-router'
import hljs from 'highlight.js'
// 路由数据
import routes from './routes';

import ViewUI from 'view-design';
Vue.use(ViewUI);

Vue.use(VueRouter)
// 导出路由 在 main.js 里使用
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start();
  next()
})
router.afterEach(() => {
  ViewUI.LoadingBar.finish();
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)')
    Array.prototype.forEach.call(blocks, hljs.highlightBlock)
  })
})

export default router

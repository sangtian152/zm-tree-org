// ES6 API兼容处理
import "@/utils/polyfill"
// 核心插件
import corePlugin from './plugin/core'
// 组件
import ZmTreeOrg from './components/tree-org'
// 拖拽缩放组件
import VueDraggableResizable from "vue-draggable-resizable";
// optionally import default styles
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import "@/styles/index.scss"
const components = [
  ZmTreeOrg,
  VueDraggableResizable
]

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })

  Vue.use(corePlugin)
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install, ZmTreeOrg
}

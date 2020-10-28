import config from '../../../package.json'
// 功能插件
import log from '../../utils/log'

export default {
  async install (Vue) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示 
    Vue.config.productionTip = false

    Vue.prototype.$log = log
    // 打印UI官网
    log.pretty('[' + config.name + '] ' + config.version, 'success')
  }
}

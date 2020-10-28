// import "core-js/stable";
// import "regenerator-runtime/runtime";
import Vue from "vue";
import test from "./test";
//导入通用样式
import "@/styles/index.scss";
import BinTreeOrg from "@/index";
Vue.use(BinTreeOrg)

// if(process.env.NODE_ENV == )
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  render: (h) => h(test),
});

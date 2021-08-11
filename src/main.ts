/*
 * @Author: chenyixin
 * @Date: 2021-08-10 15:10:34
 * @LastEditors: chenyixin
 * @LastEditTime: 2021-08-11 11:21:45
 */
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
createApp(App).use(ElementPlus).use(store).use(router).mount("#app");

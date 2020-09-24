import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
interface Person {
    [propName: string]: any;
}

const vueApp: Person = createApp(App)
console.log(vueApp, 'vueApp')
vueApp.use(store).use(router).mount('#app')

import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";
// import * as auth from './utils/auth'
import Message from './utils/message.js';

import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

const appInstance = createApp(App);


//这个方法需要放在new Vue之前，不然按F5刷新页面不会调用这个方法
router.beforeEach(function (to, from, next) {
    const token = localStorage.getItem('token');
    if (to.matched.some(record => record.meta.needLogin) && !token) {
        next('/login');
    } else {
        next();
    }
    // if (to.meta.needLogin) {
    //     if (auth.getAdminInfo()) {
    //         console.log(auth.getAdminInfo())
    //         next();
    //     }else {
    //         next({
    //             path:'/login'
    //         });
    //     }
    // }else{
    //     next();
    // }
})


appInstance.use(VxeUI).use(VxeUITable);
appInstance.use(Message);
appInstance.use(store);
appInstance.use(router);
appInstance.use(ArgonDashboard);



appInstance.mount("#app");

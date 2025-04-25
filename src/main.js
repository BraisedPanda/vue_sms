import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";
import Message from './utils/message.js';
import { isTokenExpired, getToken, removeToken } from './utils/auth';

import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxeUIPluginExportXLSX from '@vxe-ui/plugin-export-xlsx'
import ExcelJS from 'exceljs'

VxeUI.use(VxeUIPluginExportXLSX, {
    ExcelJS
})
const appInstance = createApp(App);

router.beforeEach((to, from, next) => {
    const token = getToken();
    const needLogin = to.matched.some(record => record.meta.needLogin);
    console.log("needLogin :" +needLogin);
    console.log("!token :" +!token);
    console.log("isTokenExpired(token) :" + isTokenExpired(token));
    if (needLogin) {
        if (!token || isTokenExpired(token)) {
            removeToken();
            next({
                path: '/login',
            });
        } else {
            next();
        }
    } else {
        next();
    }
});


appInstance.use(VxeUI).use(VxeUITable);
appInstance.use(Message);
appInstance.use(store);
appInstance.use(router);
appInstance.use(ArgonDashboard);



appInstance.mount("#app");

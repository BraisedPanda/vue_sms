// 引入 axios
import axios from "axios"; // 使用前要先安装依赖：npm install axios
import {VxeUI} from 'vxe-pc-ui';

// 创建axios实例
const request = axios.create({
    // 这里可以放一下公用属性等。
    // 用于配置请求接口公用部分，请求时会自动拼接在你定义的url前面。
    //设置axios请求的地址默认是'/api',这样根据第一步中配置的会将/api替换为'192.128.0.0/'
    baseURL: "/api", // 使用环境变量
    withCredentials: true, // 跨域请求时是否需要访问凭证
    timeout: 5000, // 请求超时时间
    headers: {
        // 可以放一下公用的请求头信息
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

//请求拦截器
request.interceptors.request.use(
    (config) => {
        // 在这里可以进行请求加密等操作，比如添加 token、cookie，修改数据传输格式等。
        // 设置请求头
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json";
        // 获取 token 并设置 Authorization 头部
        let token =
            window.localStorage.getItem("token") ||
            window.sessionStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        // 可根据需要添加其他自定义头部
        // config.headers["custom-header"] = "xxxx";
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
// request.interceptors.response.use(
//     (response) => {
//         // 对响应数据做处理
//         return response;
//     },
//     (error) => {
//         VxeUI.modal.message({content: "error0000000000000:" + error.toString());
//         // 请求失败进行的操作
//         if (error.response && error.response.status) {
//             switch (error.response.status) {
//                 case 401:
//                     VxeUI.modal.message({content: "尚未登录，请登录22222！");
//                     this.$router.replace("/login");
//                     break;
//                 case 403:
//                     VxeUI.modal.message({content: "权限不足22222！");
//                     break;
//                 case 404:
//                     VxeUI.modal.message({content: "请求资源不存在22222！");
//                     break;
//                 case 500:
//                     VxeUI.modal.message({content: "服务器错误22222！");
//                     break;
//                 default:
//                     VxeUI.modal.message({content: `请求错误2222: ${error.response.status} - ${error.response.data.message}`);
//             }
//         } else {
//             VxeUI.modal.message({content: "网络错误或请求超时2222！");
//         }
//         return Promise.reject(error);
//     }
// );


// 响应拦截器
request.interceptors.response.use(
    response => {
        // 对响应数据做些什么
        return response;
    },
    error => {
        // 对响应错误做些什么
        if (error.response) {
            // 请求已发出，服务器响应了状态码，但状态码在 2xx 之外
            const status = error.response.data.code;
            const message = error.response.data.message;

            // 根据状态码显示不同的错误信息
            switch (status) {
                case 400:
                    VxeUI.modal.message({content: `请求错误: ${message}`, status: 'warning'});
                    break;
                case 401:
                    VxeUI.modal.message({content: `未授权: ${message}`, status: 'warning'});
                    break;
                case 403:
                    VxeUI.modal.message({content: `禁止访问: ${message}`, status: 'warning'});
                    break;
                case 404:
                    VxeUI.modal.message({content: `未找到: ${message}`, status: 'warning'});
                    break;
                case 500:
                    VxeUI.modal.message({content: `提示: ${message}`, status: 'warning'});
                    break;
                default:
                    VxeUI.modal.message({content: `${message}`, status: 'warning'});
            }
        } else if (error.request) {
            // 请求已发出，但没有收到响应
            VxeUI.modal.message({content: '请求错误: 没有收到响应', status: 'warning'});
        } else {
            // 其他错误
            VxeUI.modal.message({content: `错误信息: ${error.message}`, status: 'warning'});
        }
        return Promise.reject(error);
    }
);

export default request;

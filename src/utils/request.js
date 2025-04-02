// 引入 axios
import axios from "axios"; // 使用前要先安装依赖：npm install axios

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
        console.log(error);
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        // 对响应数据做处理
        return response;
    },
    // (error) => {
    //     // 请求失败进行的操作
    //     if (error.response && error.response.status) {
    //         switch (error.response.status) {
    //             case 401:
    //                 ElMessage.warning("尚未登录，请登录！");
    //                 router.push("/login");
    //                 break;
    //             case 403:
    //                 ElMessage.error("权限不足！");
    //                 break;
    //             case 404:
    //                 ElMessage.error("请求资源不存在！");
    //                 break;
    //             case 500:
    //                 ElMessage.error("服务器错误！");
    //                 break;
    //             default:
    //                 ElMessage.error(`请求错误: ${error.response.status} - ${error.response.data.message}`);
    //         }
    //     } else {
    //         ElMessage.error("网络错误或请求超时！");
    //     }
    //     return Promise.reject(error);
    // }
);

export default request;

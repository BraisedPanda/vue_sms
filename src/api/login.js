import request from '@/utils/request'
import http from "@/utils/http";

// 用户登录
export function loginService (user) {
    return request({
        url: '/login',
        method: 'post',
        data: user
    })
}

export function loginIn(params) {
    return http.post("/login", params);
}

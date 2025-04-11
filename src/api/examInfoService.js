import http from "@/utils/http";

export function createExamInfo(params) {
    return http.post("/examInfo/create", params);
}


export function queryExamInfo(params) {
    return http.post("/examInfo/getExamInfoList", params);
}

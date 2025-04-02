import http from "@/utils/http";


export function getGradeList(params) {
    return http.get("/getGradeList", params);
}

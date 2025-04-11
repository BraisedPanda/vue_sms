import http from "@/utils/http";


export function getGradeList(params) {
    return http.post("/gradeInfo/getGradeList", params);
}

export function update(params) {
    return http.post("/gradeInfo/update", params);
}

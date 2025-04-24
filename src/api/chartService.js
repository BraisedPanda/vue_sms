import http from "@/utils/http";


export function getStudentChart1Data(params) {
    return http.post("/chart/getStudentChart1Data", params);
}

export function getStudentChart2Data(params) {
    return http.post("/chart/getStudentChart2Data", params);
}



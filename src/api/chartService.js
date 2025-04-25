import http from "@/utils/http";


export function getStudentChart1Data(params) {
    return http.post("/chart/getStudentChart1Data", params);
}

export function getStudentChart2Data(params) {
    return http.post("/chart/getStudentChart2Data", params);
}

export function getClassChart1Data(params) {
    return http.post("/chart/getClassChart1Data", params);
}

export function getClassChart2Data(params) {
    return http.post("/chart/getClassChart2Data", params);
}

export function getClassChart3Data(params) {
    return http.post("/chart/getClassChart3Data", params);
}



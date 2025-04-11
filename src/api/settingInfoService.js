import http from "@/utils/http";


export function getTeacherYearList() {
    return http.get("/settingInfo/getTeacherYearList");
}

export function getTeacherClassListByCondition(params) {
    return http.post("/settingInfo/getTeacherClassListByCondition", params);
}

export function getTeacherSemesterListByCondition(params) {
    return http.post("/settingInfo/getTeacherSemesterListByCondition", params);
}

export function getTeacherSubjectListByCondition(params) {
    return http.post("/settingInfo/getTeacherSubjectListByCondition", params);
}

export function getTeacherExamListByCondition(params) {
    return http.post("/settingInfo/getTeacherExamListByCondition", params);
}







export function getGradeSetting(params) {
    return http.get("/settingInfo/getGradeSetting", params);
}
export function getSubjectSetting(params) {
    return http.get("/settingInfo/getSubjectSetting", params);
}
export function getUnitySetting(params) {
    return http.get("/settingInfo/getUnitySetting", params);
}

export function getTeacherClassList() {
    return http.get("/settingInfo/getTeacherClassList");
}


export function getTeacherSemesterList() {
    return http.get("/settingInfo/getTeacherSemesterList");
}

export function getTeacherSemesterListByYear(params) {
    return http.post("/settingInfo/getTeacherSemesterListByYear", params);
}

export function getTeacherSubjectList() {
    return http.get("/settingInfo/getTeacherSubjectList");
}

export function getTeacherExamList() {
    return http.get("/settingInfo/getTeacherExamList");
}

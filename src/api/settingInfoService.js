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

export function getTeacherSubjectListByOptionalCondition(params) {
    return http.post("/settingInfo/getTeacherSubjectListByOptionalCondition", params);
}

export function getTeacherExamListByCondition(params) {
    return http.post("/settingInfo/getTeacherExamListByCondition", params);
}

export function getTeacherStudentListByCondition(params) {
    return http.post("/settingInfo/getTeacherStudentListByCondition", params);
}

export function getExamMessage(params) {
    return http.post("/settingInfo/getExamMessage", params);
}


export function getTeacherClassRelationListByCondition(params) {
    return http.post("/settingInfo/getTeacherClassRelationListByCondition", params);
}

export function getAllClassInfo() {
    return http.get("/settingInfo/getAllClassInfo");
}

export function getAllSubjectInfo() {
    return http.get("/settingInfo/getAllSubjectInfo");
}

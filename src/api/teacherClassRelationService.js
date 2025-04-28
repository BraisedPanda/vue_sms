import http from "@/utils/http";


export function createTeacherClassRelation(params) {
    return http.post("/teacherClassRelation/create", params);
}




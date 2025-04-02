import http from "@/utils/http";

export function fetchList(params = {}, headers = {}, config = {}) {
    return http.get("/test/1", params, headers, config);
}

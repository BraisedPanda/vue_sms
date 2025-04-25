export function isTokenExpired(token) {
    if (!token) {
        return true;
    }
    try {
        const parsedToken = parseJwt(token);
        const exp = parsedToken ? parsedToken.exp : 0;
        const isTokenExpired = exp * 1000 < Date.now();
        return isTokenExpired;
    } catch (error) {
        console.log("error： " + error.toString())
        return true;
    }
}

export function getToken() {
    return localStorage.getItem('token');
}

export function setToken(token) {
    localStorage.setItem('token', token);
}

export function removeToken() {
    localStorage.removeItem('token');
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

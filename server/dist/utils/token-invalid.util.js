"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// an empty token returns null as a string when used sessionStorage.getItem(...) function
function isTokenValid(accessToken, refreshToken) {
    if (accessToken === "null" || accessToken === null)
        return true;
    if (accessToken === "undefined" || accessToken === undefined)
        return true;
    if (refreshToken === "null" || refreshToken === null)
        return true;
    if (refreshToken === "undefined" || refreshToken === undefined)
        return true;
    return false;
}
exports.default = isTokenValid;

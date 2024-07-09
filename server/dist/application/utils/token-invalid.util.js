"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// an empty token returns null as a string when used sessionStorage.getItem(...) function
function isTokenValid(token) {
    if (token === "null" || token === null)
        return true;
    if (token === "undefined" || token === undefined)
        return true;
    return false;
}
exports.default = isTokenValid;

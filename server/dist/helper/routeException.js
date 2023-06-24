"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routeException = (path) => {
    if (path === "/api/v1/register")
        return true;
    if (path === "/api/v1/login")
        return true;
    if (path === "/api/v1/logout")
        return true;
    return false;
};
exports.default = routeException;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routeException = (path) => {
    const paths = [
        "/api/v1/auth/register",
        "/api/v1/auth/login",
        "/api/v1/auth/forgot-password",
        "/api/v1/auth/logout",
    ];
    return paths.includes(path);
};
exports.default = routeException;

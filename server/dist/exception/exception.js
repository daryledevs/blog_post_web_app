"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Exception {
    message;
    status;
    constructor(message, status) {
        this.message = message;
        this.status = status;
        this.status = status;
        this.message = message;
    }
    ;
    static badRequest(message) {
        return new Exception(message, 400);
    }
    ;
    static unauthorized(message) {
        return new Exception(message, 401);
    }
    ;
    static notFound(message) {
        return new Exception(message, 404);
    }
    ;
    static conflict(message) {
        return new Exception(message, 409);
    }
    ;
    static internal(message) {
        return new Exception(message, 500);
    }
    ;
}
;
exports.default = Exception;

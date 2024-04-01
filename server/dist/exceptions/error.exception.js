"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorException {
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
        return new ErrorException(message, 400);
    }
    ;
    static unauthorized(message) {
        return new ErrorException(message, 401);
    }
    ;
    static notFound(message) {
        return new ErrorException(message, 404);
    }
    ;
    static conflict(message) {
        return new ErrorException(message, 409);
    }
    ;
    static internal(message) {
        return new ErrorException(message, 500);
    }
    ;
}
;
exports.default = ErrorException;

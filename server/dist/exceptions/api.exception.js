"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_error_exception_1 = __importStar(require("./base-error.exception"));
class ApiErrorException extends base_error_exception_1.default {
    status;
    message;
    httpCode;
    isOperational;
    constructor(name, httpCode, description, isOperational) {
        super(name, httpCode, description, isOperational);
        this.status = httpCode;
        this.message = description;
        this.httpCode = httpCode;
        this.isOperational = isOperational;
    }
    ;
    static HTTP401Error = (message) => {
        return new ApiErrorException("UNAUTHORIZED", base_error_exception_1.HttpStatusCode.UNAUTHORIZED, message, true);
    };
    static HTTP400Error = (message) => {
        return new ApiErrorException("BAD REQUEST", base_error_exception_1.HttpStatusCode.BAD_REQUEST, message, true);
    };
    static HTTP404Error = (message) => {
        return new ApiErrorException("NOT FOUND", base_error_exception_1.HttpStatusCode.NOT_FOUND, message, true);
    };
    static HTTP403Error = (message) => {
        return new ApiErrorException("FORBIDDEN", base_error_exception_1.HttpStatusCode.FORBIDDEN, message, true);
    };
    static HTTP409Error = (message) => {
        return new ApiErrorException("CONFLICT", base_error_exception_1.HttpStatusCode.CONFLICT, message, true);
    };
    static HTTP500Error = (message) => {
        return new ApiErrorException("INTERNAL SERVER ERROR", base_error_exception_1.HttpStatusCode.INTERNAL_SERVER, message, false);
    };
}
;
exports.default = ApiErrorException;

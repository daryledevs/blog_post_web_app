"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
const database_exception_1 = __importDefault(require("@/exceptions/database.exception"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof database_exception_1.default) {
        return res.status(500).send(err);
    }
    ;
    if (err instanceof api_exception_1.default) {
        const { name, httpCode, message, isOperational, error } = err;
        return res
            .status(httpCode)
            .send({ name, isOperational, message, stack: error?.stack });
    }
    ;
};
exports.default = errorHandler;

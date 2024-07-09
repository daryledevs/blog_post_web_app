"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const database_exception_1 = __importDefault(require("@/application/exceptions/database.exception"));
const validation_exception_1 = __importDefault(require("@/application/exceptions/validation.exception"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof validation_exception_1.default) {
        const { name, httpCode, message, isOperational, error } = err;
        return res
            .status(httpCode)
            .send({ httpCode, name, isOperational, message, errors: error });
    }
    if (err instanceof database_exception_1.default) {
        return res.status(500).send(err);
    }
    if (err instanceof api_exception_1.default) {
        const { name, httpCode, message, isOperational, error } = err;
        return res
            .status(httpCode)
            .send({ httpCode, name, isOperational, message, stack: error?.stack });
    }
    // Default error handling
    return res.status(500).send({
        name: 'InternalServerError',
        isOperational: false,
        message: 'An unexpected error occurred',
        error: err.message || 'Unknown error'
    });
};
exports.default = errorHandler;

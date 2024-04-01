"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
const database_exception_1 = __importDefault(require("@/exceptions/database.exception"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof database_exception_1.default) {
        return res.status(500).send(err);
    }
    if (err instanceof error_exception_1.default) {
        const { status, message } = err;
        return res.status(status).send({ message });
    }
    res.status(500).send({ message: "Something went wrong", error: err.message });
};
exports.default = errorHandler;

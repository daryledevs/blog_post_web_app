"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
const database_exception_1 = __importDefault(require("@/exceptions/database.exception"));
class AsyncWrapper {
    apiWrap = (cb) => {
        return (req, res, next) => cb(req, res, next).catch((error) => {
            if (error instanceof database_exception_1.default ||
                error instanceof api_exception_1.default)
                return next(error);
            next(api_exception_1.default.HTTP500Error("An unexpected error occurred", error));
        });
    };
    serviceWrap = (fn) => {
        return (...args) => {
            return fn.apply(this, args).catch((error) => {
                throw error;
            });
        };
    };
    repoWrap = (fn) => {
        return (...args) => {
            return fn.apply(this, args).catch((error) => {
                throw database_exception_1.default.error(error);
            });
        };
    };
}
;
exports.default = AsyncWrapper;

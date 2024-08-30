"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const database_exception_1 = __importDefault(require("@/application/exceptions/database.exception"));
class AsyncWrapper {
    asyncErrorHandler = (cb) => {
        return (req, res, next) => Promise.resolve(cb(req, res, next)).catch((error) => {
            // if the error is a database error, throw a database exception
            if (error.code) {
                return next(database_exception_1.default.error(error));
            }
            // if the error is an API error, throw an API exception
            if (error instanceof api_exception_1.default) {
                return next(error);
            }
            // if the error is a general error, throw a internal server error exception
            next(api_exception_1.default.HTTP500Error("An unexpected error occurred", error));
        });
    };
}
;
exports.default = AsyncWrapper;

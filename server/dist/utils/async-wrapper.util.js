"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
const database_exception_1 = __importDefault(require("@/exceptions/database.exception"));
class AsyncWrapper {
    apiWrap = (cb) => {
        return (req, res, next) => cb(req, res, next).catch(next(api_exception_1.default.HTTP500Error("Something went wrong")));
    };
    asyncWrap = (fn) => {
        return (...args) => {
            return fn.apply(null, args).catch((error) => {
                if (!(error instanceof database_exception_1.default))
                    throw error;
                throw database_exception_1.default.error(error);
            });
        };
    };
}
;
exports.default = AsyncWrapper;

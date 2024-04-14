"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class AsyncWrapper {
    apiWrap = (cb) => {
        return (req, res, next) => cb(req, res, next).catch(next(api_exception_1.default.HTTP500Error("Something went wrong")));
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
                throw error;
            });
        };
    };
}
;
exports.default = AsyncWrapper;

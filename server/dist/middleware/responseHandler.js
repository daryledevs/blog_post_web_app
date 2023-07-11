"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function responseHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const originalSend = res.send;
        let isConverted = false;
        res.send = function (body) {
            const noAccessToken = typeof body === "object" && !(body === null || body === void 0 ? void 0 : body.accessToken);
            const isSuccessStatus = res.statusCode >= 200 && res.statusCode <= 299;
            if (!isConverted && noAccessToken && isSuccessStatus) {
                isConverted = true;
                const dataKeys = Object.keys(body);
                const converted = destructureObject(body, dataKeys);
                return originalSend.call(res, converted);
            }
            else {
                return originalSend.call(res, body);
            }
        };
        next();
    });
}
function destructureObject(data, dataKeys) {
    let instance = {};
    for (const index in dataKeys) {
        const key = dataKeys[index];
        const value = data[key];
        if (data.hasOwnProperty(key) && typeof value === "object" && value) {
            const result = destructureObject(value, dataKeys);
            const converted = convert(result);
            instance = Object.assign(Object.assign({}, instance), { [key]: converted });
        }
        else {
            instance = Object.assign(Object.assign({}, instance), data);
        }
        ;
    }
    ;
    return instance;
}
;
function convert(data) {
    let modified = {};
    Object.keys(data).forEach((key, index) => {
        const lowerCaseKey = key.toLowerCase();
        modified = Object.assign(Object.assign({}, modified), { [lowerCaseKey]: data[`${key}`] });
    });
    return modified;
}
;
exports.default = responseHandler;

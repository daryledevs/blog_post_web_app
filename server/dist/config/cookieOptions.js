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
const cookieOptions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { secure, sameSite } = (function () {
        return `${process.env.NODE_ENV}`.trim() === "development"
            ? { secure: false, sameSite: "lax" }
            : { secure: true, sameSite: "none" };
    })();
    const domain = (_c = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.host) === null || _b === void 0 ? void 0 : _b.split(":")[0]) !== null && _c !== void 0 ? _c : "";
    req.body.cookieOptions = {
        httpOnly: true,
        secure: secure,
        sameSite: sameSite,
        domain: domain,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week (days, hours, mins, milliseconds)
    };
    next();
});
exports.default = cookieOptions;

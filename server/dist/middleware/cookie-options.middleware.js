"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookieOptions = async (req, res, next) => {
    const { secure, sameSite } = (function () {
        return `${process.env.NODE_ENV}`.trim() === "development"
            ? { secure: false, sameSite: "lax" }
            : { secure: true, sameSite: "none" };
    })();
    const domain = req.headers?.host?.split(":")[0] ?? "";
    req.body.cookieOptions = {
        httpOnly: true,
        secure: secure,
        sameSite: sameSite,
        domain: domain,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week (days, hours, mins, milliseconds)
    };
    next();
};
exports.default = cookieOptions;

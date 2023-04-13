"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const ErrorHandler = (err, req, res, next) => {
    if (err.name === "UnauthorizedError")
        return res.status(401).send({ error: err, message: "Token is not valid" });
    if (err.name === "TokenExpiredError")
        return res.status(401).send({ error: err, message: "Token is expired" });
    if (err.name === "JsonWebTokenError")
        return res.status(401).send({ error: err, message: "Token is unknown" });
    return res.status(500).json({ message: err });
};
exports.ErrorHandler = ErrorHandler;

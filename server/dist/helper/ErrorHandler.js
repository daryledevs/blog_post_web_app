"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.ErrorHandler = void 0;
const ErrorHandler = (err, req, res, next) => {
    if (err.name === "UnauthorizedError")
        return res.status(401).send({ error: err, message: "Token is not valid" });
    return res.status(500).json({ message: err });
};
exports.ErrorHandler = ErrorHandler;
// If the client able to receive it, then the token from cookie is valid
// Otherwise, the user will receive the response from above
const checkToken = (req, res) => {
    res.status(200).send({ message: "Token is valid" });
};
exports.checkToken = checkToken;

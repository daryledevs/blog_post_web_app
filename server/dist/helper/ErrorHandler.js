"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.ErrorHandler = void 0;
const database_1 = __importDefault(require("../database"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler = (err, req, res, next) => {
    if (err.name === "UnauthorizedError")
        return res.status(401).send({ error: err, message: "Token is not valid" });
    return res.status(500).json({ message: err });
};
exports.ErrorHandler = ErrorHandler;
// If the client able to receive it, then the token from cookie is valid
// Otherwise, the user will receive the response from above
const checkToken = (req, res) => {
    const token = req.cookies.authorization_key;
    const { user_id, roles } = jsonwebtoken_1.default.decode(token, { json: true });
    const sql = "SELECT * FROM users WHERE user_id = ?";
    database_1.default.query(sql, [user_id], (error, data) => {
        if (error)
            return res.status(500).send(error);
        if (!data.length)
            return res.status(404).send({ message: "User not found" });
        let [userDetails] = data;
        const { password } = userDetails, rest = __rest(userDetails, ["password"]);
        res.status(200).send({ message: "Token is valid", user_data: rest });
    });
};
exports.checkToken = checkToken;

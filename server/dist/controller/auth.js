"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const cookieOptions_1 = __importDefault(require("../config/cookieOptions"));
dotenv.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, first_name, last_name } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
    database_1.default.query(sql, [email, username], (err, data) => {
        if (err)
            return res.status(500).send(err);
        if (data.length)
            return res.status(409).send({ message: "User is already exists" });
        const sql = "INSERT INTO users(`username`, `email`, `password`, `first_name`, `last_name`) VALUES (?)";
        const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
        const values = [username, email, hashPassword, first_name, last_name];
        database_1.default.query(sql, [values], (error, data) => {
            if (error)
                return res.status(500).send(error);
            return res.status(200).send({ message: "Registration is successful" });
        });
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? OR email = ?";
    database_1.default.query(sql, [username, email], (error, data) => {
        if (error)
            return res.status(500).send(error);
        if (!data.length)
            return res.status(404).send({ message: "User not found" });
        let userDetails;
        // '!' non-null assertion operator 
        const ACCESS_SECRET = process.env.ACCESS_TKN_SECRET;
        const REFRESH_SECRET = process.env.REFRESH_TKN_SECRET;
        [userDetails] = data;
        if (bcrypt_1.default.compareSync(password, userDetails.password)) {
            const ACCESS_TOKEN = jsonwebtoken_1.default.sign({ user_id: userDetails.user_id, roles: userDetails.roles }, ACCESS_SECRET, { expiresIn: "15m" });
            const REFRESH_TKN = jsonwebtoken_1.default.sign({ user_id: userDetails.user_id, username: userDetails.username }, REFRESH_SECRET, { expiresIn: "7d" });
            res
                .cookie("REFRESH_TOKEN", REFRESH_TKN, cookieOptions_1.default)
                .status(200)
                .send({ message: "Login successfully", token: ACCESS_TOKEN });
            return;
        }
        else {
            return res.status(404).send({ message: "Password is incorrect" });
        }
    });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .clearCookie("REFRESH_TOKEN", {
        sameSite: "none",
        secure: cookieOptions_1.default.secure,
        httpOnly: true,
    })
        .status(200)
        .send({ message: "Logout successfully" });
});
exports.logout = logout;

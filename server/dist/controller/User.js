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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = exports.Login = exports.Register = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, first_name, last_name } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
    database_1.default.query(sql, [email, username], (err, data) => {
        if (err)
            return res.status(500).send(err);
        if (data.length)
            return res.status(409).send({ message: 'User is already exists' });
        const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
        const values = [
            username,
            email,
            hashPassword,
            first_name,
            last_name
        ];
        const sql = "INSERT INTO users(`username`, `email`, `password`, `first_name`, `last_name`) VALUES (?)";
        database_1.default.query(sql, [values], (error, data) => {
            if (error)
                return res.status(500).send(error);
            return res.status(200).send({ message: "Registration is successful" });
        });
    });
});
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? OR email = ?";
    database_1.default.query(sql, [username, email], (error, data) => {
        if (error)
            return res.status(500).send(error);
        if (!data.length)
            return res.status(404).send({ message: "User not found" });
        let userDetails;
        // '!' non-null assertion operator 
        const secret = process.env.JWT_SECRET;
        [userDetails] = data;
        if (bcrypt_1.default.compareSync(password, userDetails.password)) {
            const token = jsonwebtoken_1.default.sign({ user_id: userDetails.user_id, roles: userDetails.roles }, secret, { expiresIn: "1d" });
            res
                .cookie("authorization_key", token, { httpOnly: true })
                .status(200)
                .send({ message: "Login successfully" });
            return;
        }
        else {
            return res.status(404).send({ message: "Password is incorrect" });
        }
    });
});
exports.Login = Login;
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("authorization_key", {
        sameSite: "none",
        secure: true
    }).status(200).send({ message: "Logout successfully" });
});
exports.Logout = Logout;

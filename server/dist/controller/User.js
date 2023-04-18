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
exports.getFollowers = exports.followUser = exports.userData = exports.register = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
const userData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.body;
    const sql = "SELECT * FROM users WHERE user_id = (?);";
    database_1.default.query(sql, [user_id], (error, data) => {
        if (error)
            return res.status(500).send({ message: error });
        if (!data.length)
            return res.status(404).send({ message: "User not found" });
        const [user] = data;
        const { password } = user, rest = __rest(user, ["password"]);
        res.status(200).send({ user: rest });
    });
});
exports.userData = userData;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { followed_id, follower_id } = req.params;
    const values = [parseInt(followed_id), parseInt(follower_id)];
    const sql_get = "SELECT * FROM followers WHERE followed_id = (?) AND follower_id = (?);";
    const sql_delete = "DELETE FROM followers WHERE followed_id = (?) AND follower_id = (?);";
    const sql_create = "INSERT INTO followers (\`followed_id\`, \`follower_id\`) VALUES(?, ?);";
    // Get all the data from the database to see if it is already there
    database_1.default.query(sql_get, [...values], (error, data) => {
        if (error)
            return res.status(500).send({ message: error });
        // If it already exists, delete the data from the database
        if (data.length) {
            database_1.default.query(sql_delete, [...values], (error, data) => {
                if (error)
                    return res.status(500).send({ message: "Unfollowed failed", error });
                return res.status(200).send({ message: "Unfollowed user" });
            });
            return;
        }
        // if there is no data on database then, create one
        database_1.default.query(sql_create, [...values], (error, data) => {
            if (error)
                return res.status(500).send({ message: "Unfollow failed", error });
            res.status(200).send({ message: "Followed user" });
        });
    });
});
exports.followUser = followUser;
const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const sql = `
                SELECT 
                    f.*, u.user_id, u.username, u.first_name, u.last_name
                FROM
                    followers f
                INNER JOIN
                    users u ON f.follower_id = u.user_id
                WHERE
                    f.followed_id = (?);

              SELECT 
                  f.*, u.user_id, u.username, u.first_name, u.last_name
              FROM
                  followers f
              INNER JOIN
                  users u ON f.followed_id = u.user_id
              WHERE
                  f.follower_id = (?);
              `;
    database_1.default.query(sql, [user_id, user_id], (error, data) => {
        console.log("TEST");
        if (error)
            return res.status(500).send({ error });
        res
            .status(200)
            .send({
            followers: data[0].length ? data[0] : 0,
            following: data[1].length ? data[1] : 0,
        });
    });
});
exports.getFollowers = getFollowers;

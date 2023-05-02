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
exports.getTotalFeed = exports.getUserFeed = exports.findUser = exports.userData = exports.register = void 0;
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
const getUserFeed = (req, res) => {
    const { post_ids, user_id } = req.body;
    const values = post_ids.length ? post_ids : 0;
    const sql = `
              SELECT 
                  f.followed_id, 
                  f.follower_id, 
                  p.*, 
                  (SELECT 
                    COUNT(*)
                  FROM
                    likes l
                  WHERE
                    p.post_id = l.post_id
                  ) AS "count"
              FROM
                  followers f
              INNER JOIN
                  posts p ON p.user_id = f.followed_id
              WHERE
                  f.follower_id = (?) AND 
                  p.post_date > DATE_SUB(CURDATE(), INTERVAL 3 DAY) AND
                  post_id NOT IN (?) 
              ORDER BY RAND() LIMIT 3;
          `;
    database_1.default.query(sql, [user_id, values], (error, data) => {
        if (error)
            return res.status(500).send({ error });
        res.status(200).send({ feed: data });
    });
};
exports.getUserFeed = getUserFeed;
const getTotalFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.body;
    const sql = `
              SELECT 
                  COUNT(*)
              FROM
                  posts
              WHERE
                  post_date > DATE_SUB(CURDATE(), INTERVAL 3 DAY)
              ORDER BY RAND() LIMIT 3;
              `;
    database_1.default.query(sql, [user_id], (error, data) => {
        if (error)
            return res.status(500).send({ error });
        res.status(200).send({ count: data[0]["COUNT(*)"] });
    });
});
exports.getTotalFeed = getTotalFeed;
const findUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchText } = req.body;
    const sql = `
              SELECT 
                user_id,
                username,
                first_name,
                last_name
              FROM
                  users
              WHERE
                  username LIKE (?) OR 
                  first_name LIKE (?) OR 
                  CONCAT(first_name, ' ', last_name) LIKE (?);
              `;
    database_1.default.query(sql, [
        searchText + "%",
        searchText + "%",
        "%" + searchText + "%"
    ], (error, data) => {
        if (error)
            return res.status(500).send({ error });
        if (!data.length)
            return res.status(401).send("No results found.");
        res.status(200).send({ list: data });
    });
});
exports.findUser = findUser;

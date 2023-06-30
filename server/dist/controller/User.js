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
exports.findUsername = exports.getTotalFeed = exports.getUserFeed = exports.findUser = exports.userData = void 0;
const query_1 = __importDefault(require("../database/query"));
const isObjEmpty_1 = __importDefault(require("../util/isObjEmpty"));
const getUserData = (data) => {
    const { password } = data, rest = __rest(data, ["password"]);
    return rest;
};
const userData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.body;
        const sql = "SELECT * FROM USERS WHERE USER_ID = (?);";
        const [data] = yield (0, query_1.default)(sql, [user_id]);
        if ((0, isObjEmpty_1.default)(data))
            return res.status(404).send({ message: "User not found" });
        const rest = getUserData(data);
        res.status(200).send({ user: rest });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.userData = userData;
const getUserFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_ids, user_id } = req.body;
        const values = post_ids.length ? post_ids : 0;
        const sql = `
      SELECT 
          F.FOLLOWED_ID, 
          F.FOLLOWER_ID, 
          P.*, 
          (SELECT 
            COUNT(*)
          FROM
            LIKES L
          WHERE
            P.POST_ID = L.POST_ID
          ) AS "COUNT"
      FROM
          FOLLOWERS F
      INNER JOIN
          POSTS P ON P.USER_ID = F.FOLLOWED_ID
      WHERE
          F.FOLLOWER_ID = (?) AND 
          P.POST_DATE > DATE_SUB(CURDATE(), INTERVAL 3 DAY) AND
          POST_ID NOT IN (?) 
      ORDER BY RAND() LIMIT 3;
   `;
        const data = yield (0, query_1.default)(sql, [user_id, values]);
        res.status(200).send({ feed: data });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.getUserFeed = getUserFeed;
const getTotalFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.body;
        const sql = `
      SELECT 
          COUNT(*)
      FROM
          POSTS
      WHERE
          POST_DATE > DATE_SUB(CURDATE(), INTERVAL 3 DAY)
      ORDER BY RAND() LIMIT 3;
    `;
        const [data] = yield (0, query_1.default)(sql, [user_id]);
        res.status(200).send({ count: data["COUNT(*)"] });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.getTotalFeed = getTotalFeed;
const findUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchText } = req.body;
        const sql = `
      SELECT 
        USER_ID,
        USERNAME,
        FIRST_NAME,
        LAST_NAME
      FROM
          USERS
      WHERE
          USERNAME LIKE (?) OR 
          FIRST_NAME LIKE (?) OR 
          CONCAT(FIRST_NAME, ' ', LAST_NAME) LIKE (?);
    `;
        const data = yield (0, query_1.default)(sql, [
            searchText + "%",
            searchText + "%",
            "%" + searchText + "%",
        ]);
        if ((0, isObjEmpty_1.default)(data))
            return res.status(401).send("No results found.");
        res.status(200).send({ list: data });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.findUser = findUser;
const findUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const sql = "SELECT * FROM USERS WHERE USERNAME = (?);";
        const [data] = yield (0, query_1.default)(sql, [username]);
        if ((0, isObjEmpty_1.default)(data))
            return res.status(404).send({ message: "The user doesn't exist" });
        const rest = getUserData(data);
        res.status(200).send({ user: rest });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.findUsername = findUsername;

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
exports.toggleFollow = exports.getFollowerFollowingLists = exports.getFollowStats = exports.getUserData = void 0;
const query_1 = __importDefault(require("../database/query"));
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.body;
        const { person } = req.query;
        const sqlSelectWithId = "SELECT * FROM USERS WHERE USER_ID = (?);";
        const sqlSelectPerson = `
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
        const sql = person ? sqlSelectPerson : sqlSelectWithId;
        const personArray = Array.from({ length: 3 }, () => person + "%");
        const params = person ? personArray : [user_id];
        const [data] = yield (0, query_1.default)(sql, params);
        if (!data)
            return res.status(404).send({ message: "User not found" });
        const { password } = data, rest = __rest(data, ["password"]);
        res.status(200).send({ user: rest });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.getUserData = getUserData;
const getFollowStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const sql = `
      SELECT 
        COUNT(F.FOLLOWED_ID) AS \`COUNT\`
      FROM
        FOLLOWERS F
      INNER JOIN
        USERS U ON F.FOLLOWER_ID = U.USER_ID
      WHERE
        F.FOLLOWED_ID = (?)
      GROUP BY F.FOLLOWED_ID;

      SELECT 
        COUNT(F.FOLLOWED_ID) AS \`COUNT\`
      FROM
        FOLLOWERS F
      INNER JOIN
        USERS U ON F.FOLLOWED_ID = U.USER_ID
      WHERE
        F.FOLLOWER_ID = (?)
      GROUP BY F.FOLLOWER_ID;
    `;
        const data = yield (0, query_1.default)(sql, [user_id, user_id]);
        const { COUNT: followers } = data[0][0];
        const { COUNT: following } = data[1][0];
        res.status(200).send({ followers, following });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "An error occurred", error: error.message });
    }
});
exports.getFollowStats = getFollowStats;
const getFollowerFollowingLists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const { listsId } = req.body;
        const { fetch } = req.query;
        const lists = listsId.length ? listsId : 0;
        const sqlSelectFollowedId = `
      SELECT 
        F.*, 
        U.USER_ID, 
        U.USERNAME, 
        U.FIRST_NAME, 
        U.LAST_NAME,  
        U.AVATAR_URL
      FROM
        FOLLOWERS F
      INNER JOIN
        USERS U ON F.FOLLOWED_ID = U.USER_ID
      WHERE
        F.FOLLOWER_ID = (?) AND F.FOLLOWED_ID NOT IN (?)
      LIMIT 3;
    `;
        const sqlSelectFollowerId = `
      SELECT 
        F.*, 
        U.USER_ID, 
        U.USERNAME, 
        U.FIRST_NAME, 
        U.LAST_NAME, 
        U.AVATAR_URL
      FROM
        FOLLOWERS F
      INNER JOIN
        USERS U ON F.FOLLOWER_ID = U.USER_ID
      WHERE
        F.FOLLOWED_ID = (?) AND F.FOLLOWER_ID NOT IN (?)
      LIMIT 3;
    `;
        const sql = fetch === "followers" ? sqlSelectFollowerId : sqlSelectFollowedId;
        const data = yield (0, query_1.default)(sql, [user_id, lists]);
        res.status(200).send({ lists: data });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "An error occurred", error: error.message });
    }
});
exports.getFollowerFollowingLists = getFollowerFollowingLists;
const toggleFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { user_id, followed_id } = req.params;
        const values = [parseInt(user_id), parseInt(followed_id)];
        const sqlCreate = `
      INSERT INTO FOLLOWERS 
      (FOLLOWER_ID, FOLLOWED_ID) VALUES (?, ?);
    `;
        const sqlGet = `
      SELECT * 
      FROM FOLLOWERS 
      WHERE FOLLOWER_ID = (?) AND FOLLOWED_ID = (?);
    `;
        const sqlDelete = `
      DELETE FROM FOLLOWERS 
      WHERE FOLLOWER_ID = (?) AND FOLLOWED_ID = (?);
    `;
        // Get all the data from the database to see if it is already there
        const [data] = yield (0, query_1.default)(sqlGet, [...values]);
        // If it already exists, delete the data from the database
        if (data) {
            yield (0, query_1.default)(sqlDelete, [...values]);
            res.status(200).send({ message: "Unfollowed user" });
        }
        else {
            // if there is no data in the database, create one
            yield (0, query_1.default)(sqlCreate, [...values]);
            res.status(200).send({ message: "Followed user" });
        }
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});
exports.toggleFollow = toggleFollow;

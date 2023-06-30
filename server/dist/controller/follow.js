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
exports.followUser = exports.getFollowers = exports.totalFollow = void 0;
const query_1 = __importDefault(require("../database/query"));
const totalFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const [data] = yield (0, query_1.default)(sql, [user_id, user_id]);
        const [followers] = data[0];
        const [following] = data[1];
        res.status(200).send({
            followers: (followers === null || followers === void 0 ? void 0 : followers.count) ? followers.count : 0,
            following: (following === null || following === void 0 ? void 0 : following.count) ? following.count : 0,
        });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});
exports.totalFollow = totalFollow;
const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const { follower_ids, following_ids } = req.body;
        const isItEmpty = (arr) => (arr.length ? arr : 0);
        const followers = isItEmpty(follower_ids);
        const following = isItEmpty(following_ids);
        const sql = `
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
        const [followersData, followingData] = yield (0, query_1.default)(sql, [
            user_id, followers, user_id, following,
        ]);
        res.status(200).send({ followers: followersData, following: followingData });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});
exports.getFollowers = getFollowers;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { followed_id, follower_id } = req.params;
        const values = [parseInt(followed_id), parseInt(follower_id)];
        const sqlCreate = `
      INSERT INTO FOLLOWERS 
      (FOLLOWED_ID, FOLLOWER_ID) VALUES (?, ?);
    `;
        const sqlGet = `
      SELECT * 
      FROM FOLLOWERS 
      WHERE FOLLOWED_ID = (?) AND FOLLOWER_ID = (?);
    `;
        const sqlDelete = `
      DELETE FROM FOLLOWERS 
      WHERE FOLLOWED_ID = (?) AND FOLLOWER_ID = (?);
    `;
        // Get all the data from the database to see if it is already there
        const [data] = yield (0, query_1.default)(sqlGet, [...values]);
        // If it already exists, delete the data from the database
        if (data.length) {
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
exports.followUser = followUser;

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
exports.getFollowers = exports.followUser = exports.totalFollow = void 0;
const database_1 = __importDefault(require("../database/database"));
const totalFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const sql = `
              SELECT 
                COUNT(f.followed_id) AS \`count\`
              FROM
                followers f
              INNER JOIN
                users u ON f.follower_id = u.user_id
              WHERE
                f.followed_id = (?) GROUP BY f.followed_id;

              SELECT 
                COUNT(f.followed_id) AS \`count\`
              FROM
                followers f
              INNER JOIN
                users u ON f.followed_id = u.user_id
              WHERE
                f.follower_id = (?) GROUP BY f.follower_id;
            `;
    database_1.default.query(sql, [user_id, user_id], (error, data) => {
        if (error)
            return res.status(500).send({ error });
        const [followers] = data[0];
        const [following] = data[1];
        res.status(200).send({
            followers: (followers === null || followers === void 0 ? void 0 : followers.count) ? followers.count : 0,
            following: (following === null || following === void 0 ? void 0 : following.count) ? following.count : 0,
        });
    });
});
exports.totalFollow = totalFollow;
const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const { follower_ids, following_ids } = req.body;
    const isEmpty = (arr) => (arr.length ? arr : 0);
    const followers = isEmpty(follower_ids);
    const following = isEmpty(following_ids);
    const sql = `
              SELECT 
                  f.*, 
                  u.user_id, 
                  u.username, 
                  u.first_name, 
                  u.last_name, 
                  u.avatar_url
              FROM
                followers f
              INNER JOIN
                users u ON f.follower_id = u.user_id
              WHERE
                f.followed_id = (?) AND f.follower_id NOT IN (?)
              LIMIT 3;

              SELECT 
                  f.*, 
                  u.user_id, 
                  u.username, 
                  u.first_name, 
                  u.last_name,  
                  u.avatar_url
              FROM
                  followers f
              INNER JOIN
                  users u ON f.followed_id = u.user_id
              WHERE
                  f.follower_id = (?) AND f.followed_id NOT IN (?)
              LIMIT 3;
            `;
    database_1.default.query(sql, [
        user_id, followers,
        user_id, following
    ], (error, data) => {
        if (error)
            return res.status(500).send({ error });
        res.status(200).send({
            followers: data[0],
            following: data[1],
        });
    });
});
exports.getFollowers = getFollowers;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { followed_id, follower_id } = req.params;
    const values = [parseInt(followed_id), parseInt(follower_id)];
    const sql_get = "SELECT * FROM followers WHERE followed_id = (?) AND follower_id = (?);";
    const sql_delete = "DELETE FROM followers WHERE followed_id = (?) AND follower_id = (?);";
    const sql_create = "INSERT INTO followers (`followed_id`, `follower_id`) VALUES(?, ?);";
    // Get all the data from the database to see if it is already there
    database_1.default.query(sql_get, [...values], (error, data) => {
        if (error)
            return res.status(500).send({ message: error });
        // If it already exists, delete the data from the database
        if (data.length) {
            return database_1.default.query(sql_delete, [...values], (error, data) => {
                if (error)
                    return res.status(500).send({ message: "Unfollowed failed", error });
                res.status(200).send({ message: "Unfollowed user" });
            });
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

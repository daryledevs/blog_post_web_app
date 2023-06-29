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
exports.likeStatus = exports.postAllLikes = exports.likePost = void 0;
const query_1 = __importDefault(require("../database/query"));
const postAllLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_id } = req.params;
        const sql = `
      SELECT 
        COUNT(*) AS COUNT
      FROM
        LIKES
      WHERE
        POST_ID = ?
    `;
        const [data] = yield (0, query_1.default)(sql, [post_id]);
        res.status(200).send({ count: data.COUNT });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error });
    }
});
exports.postAllLikes = postAllLikes;
const likeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_id, user_id } = req.params;
        const sql = `
      SELECT * 
      FROM LIKES 
      WHERE POST_ID = ? AND USER_ID = ?
    `;
        const [data] = yield (0, query_1.default)(sql, [post_id, user_id]);
        if (!data.length)
            return res.status(200).send({ status: false });
        res.status(200).send({ status: true });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error });
    }
});
exports.likeStatus = likeStatus;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_id, user_id } = req.params;
        const sql_get = `
      SELECT * 
      FROM LIKES 
      WHERE POST_ID = ? AND USER_ID = ?;
    `;
        const sql_delete = `
      DELETE FROM LIKES 
      WHERE POST_ID = ? AND USER_ID = ?;
    `;
        const sql_create = `
      INSERT INTO LIKES (POST_ID, USER_ID) 
      VALUES (?, ?);
    `;
        // check to see if the user already likes the post
        const [data] = yield (0, query_1.default)(sql_get, [post_id, user_id]);
        if (data.length) {
            // if the user has already liked the post, then delete or remove
            yield (0, query_1.default)(sql_delete, [post_id, user_id]);
            return res.status(200).send("Removed like from a post");
        }
        else {
            // if the user hasn't liked the post yet, then create or insert
            yield (0, query_1.default)(sql_create, [post_id, user_id]);
            return res.status(200).send("Liked post");
        }
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error });
    }
});
exports.likePost = likePost;

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
exports.toggleUserLikeForPost = exports.checkUserLikeStatusForPost = exports.getLikesCountForPost = exports.deletePost = exports.editPost = exports.getUserTotalPosts = exports.getUserPost = exports.newPost = void 0;
const dotenv = __importStar(require("dotenv"));
const query_1 = __importDefault(require("../database/query"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
dotenv.config();
const getUserPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.query;
        const sql = `
      SELECT 
        P.*,
        (
          SELECT 
            COUNT(*)
          FROM
            LIKES L
          WHERE
            P.POST_ID = L.POST_ID
        ) AS "LIKES"
      FROM
          POSTS P
      WHERE
          P.USER_ID = (?);
    `;
        const data = yield (0, query_1.default)(sql, [user_id]);
        res.status(200).send({ post: data });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});
exports.getUserPost = getUserPost;
const getUserTotalPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.query;
        const sql = `
      SELECT 
        COUNT(*)
      FROM
          POSTS P
      WHERE
          P.USER_ID = (?);
    `;
        const [data] = yield (0, query_1.default)(sql, [user_id]);
        res.status(200).send({ totalPost: data["COUNT(*)"] });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "An error occurred", error: error.message });
    }
});
exports.getUserTotalPosts = getUserTotalPosts;
const newPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, caption } = req.body;
        const { img } = req.files;
        const path = img[0].destination + "\\" + img[0].filename;
        const { image_id, image_url } = yield (0, cloudinary_1.default)(path);
        const values = [user_id, caption, image_id, image_url];
        const sql = `
      INSERT INTO POSTS 
      (USER_ID, CAPTION, IMAGE_ID, IMAGE_URL) VALUES (?);
    `;
        yield (0, query_1.default)(sql, [values]);
        res.status(200).send({ message: "Post has been posted" });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});
exports.newPost = newPost;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_id } = req.params;
        const body = req.body;
        if (body === null || body === void 0 ? void 0 : body.user_id)
            return res.status(406).send({ message: "The following data cannot be changed" });
        // Get all the keys and values that are going to be changed.
        let query = ``;
        Object.keys(body).forEach(function (key, index) {
            query = `${key} = "${body[`${key}`]}"`;
        });
        const sql = `UPDATE POSTS SET ${query} WHERE POST_ID = (?);`;
        yield (0, query_1.default)(sql, [parseInt(post_id)]);
        res.status(200).send({ message: "Edit post successfully" });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});
exports.editPost = editPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_id } = req.params;
        const sql = "DELETE FROM POSTS WHERE POST_ID = (?);";
        yield (0, query_1.default)(sql, [parseInt(post_id)]);
        res.status(200).send("Delete post successfully");
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});
exports.deletePost = deletePost;
const getLikesCountForPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});
exports.getLikesCountForPost = getLikesCountForPost;
const checkUserLikeStatusForPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_id, user_id } = req.params;
        const sql = `
      SELECT * 
      FROM LIKES 
      WHERE POST_ID = ? AND USER_ID = ?
    `;
        const [data] = yield (0, query_1.default)(sql, [post_id, user_id]);
        res.status(200).send({ status: data ? true : false });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});
exports.checkUserLikeStatusForPost = checkUserLikeStatusForPost;
const toggleUserLikeForPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Check to see if the user already likes the post.
        const [data] = yield (0, query_1.default)(sql_get, [post_id, user_id]);
        if (data) {
            // If the user has already liked the post, then delete or remove.
            yield (0, query_1.default)(sql_delete, [post_id, user_id]);
            return res.status(200).send("Removed like from a post");
        }
        else {
            // If the user hasn't liked the post yet, then create or insert.
            yield (0, query_1.default)(sql_create, [post_id, user_id]);
            return res.status(200).send("Liked post");
        }
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});
exports.toggleUserLikeForPost = toggleUserLikeForPost;
// Another way of getting data from a database
// const getTotalLikes = async (post_ids: any, payload: any, sql: any) => {
//   const selectLikes = async (values: any) => {
//     return new Promise((resolve, reject) => {
//       database.query(sql, values, (error, data) => {
//         if (error) reject(error);
//         const [value] = values;
//         payload.push({ post_id: value, count: data[0]["COUNT(*)"] });
//         resolve(payload);
//       });
//     });
//   };
//   for (let i = 0; i < post_ids.length; i++) await selectLikes([post_ids[i]]);
// };

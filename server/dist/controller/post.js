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
exports.deletePost = exports.editPost = exports.likePost = exports.getUserPost = exports.newPost = void 0;
const database_1 = __importDefault(require("../database"));
const moment_1 = __importDefault(require("moment"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
dotenv.config();
cloudinary_1.default.v2.config({
    cloud_name: process.env.STORAGE_NAME,
    api_key: process.env.STORAGE_API_KEY,
    api_secret: process.env.STORAGE_API_SECRET,
    secure: true,
});
function uploadAndDeleteLocal(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield cloudinary_1.default.v2.uploader.upload(path, { unique_filename: true });
        fs.unlink(path, (err) => {
            if (err)
                throw err;
            console.log("Delete File successfully.");
        });
        return { image_id: result.public_id, image_url: result.url };
    });
}
;
const getUserPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const sql = "SELECT * FROM posts WHERE user_id = (?);";
    database_1.default.query(sql, [user_id], (error, data) => {
        if (error)
            return res.status(500).send({ error });
        if (!data.length)
            return res.status(404).send({ message: "No posts yet" });
        res.status(200).send({ post: data });
    });
});
exports.getUserPost = getUserPost;
const newPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = "INSERT INTO posts (`user_id`, `caption`, `image_id`, `image_url`, `post_date`) VALUES (?);";
    const { img } = req.files;
    const { user_id, caption } = req.body;
    const path = img[0].destination + "\\" + img[0].filename;
    const { image_id, image_url } = yield uploadAndDeleteLocal(path);
    const post_date = (0, moment_1.default)(new Date(), "YYYY-MM-DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss");
    const values = [user_id, caption, image_id, image_url, post_date];
    database_1.default.query(sql, [values], (error, data) => {
        if (error)
            return res.status(500).send({ message: "Post failed", error });
        res.status(200).send({ message: "Post has been posted" });
    });
});
exports.newPost = newPost;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id } = req.params;
    const body = req.body;
    let query = ``;
    if (body.post_id || body.user_id)
        return res.status(406).send({ message: "The following data cannot be change" });
    Object.keys(body).forEach(function (key, index) {
        query = `${key} = "${body[`${key}`]}"`;
    });
    const sql = `UPDATE posts SET ${query} WHERE post_id = (?);`;
    database_1.default.query(sql, [parseInt(post_id)], (error, data) => {
        if (error)
            return res.status(500).send({ error });
        res.status(200).send({ message: "Edit post successfully" });
    });
});
exports.editPost = editPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id } = req.params;
    const sql = "DELETE FROM posts WHERE post_id = (?);";
    database_1.default.query(sql, [parseInt(post_id)], (error, data) => {
        if (error)
            return res.status(500).send({ error });
        res.status(200).send("Delete post successfully");
    });
});
exports.deletePost = deletePost;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id, user_id } = req.params;
    const sql_get = "SELECT * FROM likes WHERE post_id = (?) AND user_id = (?);";
    const sql_delete = "DELETE FROM likes WHERE post_id = (?) AND user_id = (?);";
    const sql_create = "INSERT INTO likes (`post_id`, `user_id`) VALUES (?, ?);";
    // check to see if the user is already like the post
    database_1.default.query(sql_get, [post_id, user_id], (error, data) => {
        if (error)
            return res.status(500).send({ error });
        // if the user has already liked the post, then delete or remove
        if (data.length) {
            database_1.default.query(sql_delete, [post_id, user_id], (error, data) => {
                if (error)
                    return res.status(500).send({ message: "Delete row from likes table failed", error });
                return res.status(200).send("Remove like from a post");
            });
            return;
        }
        // if the user hasn't like the post yet, then create or insert 
        database_1.default.query(sql_create, [post_id, user_id], (error, data) => {
            if (error)
                return res.status(500).send({ message: "Like post failed", error });
            res.status(200).send("Liked post");
        });
    });
});
exports.likePost = likePost;

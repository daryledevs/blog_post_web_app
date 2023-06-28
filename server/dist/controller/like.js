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
const database_1 = __importDefault(require("../database/database"));
const postAllLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id } = req.params;
    const sql = "SELECT COUNT(*) FROM likes WHERE post_id = (?);";
    database_1.default.query(sql, [post_id], (error, data) => {
        if (error)
            return res.status(500).send({ error });
        res.status(200).send({ count: data[0]["COUNT(*)"] });
    });
});
exports.postAllLikes = postAllLikes;
const likeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id, user_id } = req.params;
    const sql = "SELECT * FROM likes WHERE post_id = (?) AND user_id = (?);";
    database_1.default.query(sql, [post_id, user_id], (error, data) => {
        if (error)
            return res.status(500).send({ error });
        if (!data.length)
            return res.status(200).send({ status: false });
        res.status(200).send({ status: true });
    });
});
exports.likeStatus = likeStatus;
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
            return database_1.default.query(sql_delete, [post_id, user_id], (error, data) => {
                if (error)
                    return res.status(500).send({ message: "Delete row from likes table failed", error });
                return res.status(200).send("Remove like from a post");
            });
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

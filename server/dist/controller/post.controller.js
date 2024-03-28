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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class PostsController {
    postsService;
    constructor(postsService) {
        this.postsService = postsService;
    }
    ;
    getUserPost = async (req, res, next) => {
        try {
            const { user_id } = req.query;
            const data = await this.postsService.getUserPosts(user_id);
            res.status(200).send({ post: data });
        }
        catch (error) {
            next(error);
        }
        ;
    };
    getUserTotalPosts = async (req, res, next) => {
        try {
            const { user_id } = req.query;
            const data = await this.postsService.getUserTotalPosts(user_id);
            res.status(200).send({ totalPost: data });
        }
        catch (error) {
            next(error);
        }
        ;
    };
    newPost = async (req, res, next) => {
        try {
            const { cookieOptions, ...rest } = req.body;
            const files = req.files?.img || null;
            const data = await this.postsService.newPost(files[0], rest);
            res.status(200).send({ message: data });
        }
        catch (error) {
            next(error);
        }
        ;
    };
    editPost = async (req, res, next) => {
        try {
            const post_id = req.params;
            const { user_id, roles, cookieOptions, ...rest } = req.body;
            const data = await this.postsService.editPost(post_id, rest);
            res.status(200).send({ message: data });
        }
        catch (error) {
            next(error);
        }
        ;
    };
    deletePost = async (req, res, next) => {
        try {
            const post_id = req.params;
            const data = await this.postsService.deletePost(post_id);
            res.status(200).send({ message: data });
        }
        catch (error) {
            next(error);
        }
        ;
    };
    getLikesCountForPost = async (req, res, next) => {
        try {
            const post_id = req.params;
            const data = await this.postsService.getLikesCountForPost(post_id);
            res.status(200).send({ count: data });
        }
        catch (error) {
            next(error);
        }
        ;
    };
    checkUserLikeStatusForPost = async (req, res, next) => {
        try {
            const args = req.params;
            const data = await this.postsService.checkUserLikeStatusForPost(args);
            res.status(200).send({ status: data ? true : false });
        }
        catch (error) {
            next(error);
        }
        ;
    };
    toggleUserLikeForPost = async (req, res, next) => {
        try {
            const args = req.params;
            const data = await this.postsService.toggleUserLikeForPost(args);
            return res.status(200).send({ message: data });
        }
        catch (error) {
            next(error);
        }
        ;
    };
}
;
exports.default = PostsController;

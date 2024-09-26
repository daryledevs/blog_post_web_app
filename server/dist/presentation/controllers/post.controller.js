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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_dto_1 = __importDefault(require("@/domain/dto/post.dto"));
const dotenv = __importStar(require("dotenv"));
const class_transformer_1 = require("class-transformer");
dotenv.config();
class PostsController {
    postService;
    likeService;
    constructor(postService, likeService) {
        this.postService = postService;
        this.likeService = likeService;
    }
    getPostByUuid = async (req, res) => {
        const uuid = req.params?.uuid;
        const post = await this.postService.getPostByUuid(uuid);
        res.status(200).send({ post: post?.getPosts() });
    };
    getUserPosts = async (req, res) => {
        const user_uuid = req.params?.user_uuid;
        const posts = await this.postService.getAllPostsByUsersUuid(user_uuid);
        const postLists = posts.map((post) => post.getPosts());
        res.status(200).send({ posts: postLists });
    };
    getUserTotalPosts = async (req, res) => {
        const user_uuid = req.params?.user_uuid;
        const data = await this.postService.geTotalPostsByUsersUuid(user_uuid);
        res.status(200).send({ totalPost: data });
    };
    newPost = async (req, res) => {
        const reqBody = req.body;
        const files = req.files
            ?.imgs || null;
        const obj = { ...reqBody, files };
        const postDto = (0, class_transformer_1.plainToInstance)(post_dto_1.default, obj);
        const data = await this.postService.createNewPost(postDto);
        res.status(200).send({ message: data });
    };
    editPost = async (req, res) => {
        const reqBody = req.body;
        const postDto = (0, class_transformer_1.plainToInstance)(post_dto_1.default, reqBody);
        const data = await this.postService.updatePostByUuid(postDto);
        res.status(200).send({ message: data });
    };
    deletePost = async (req, res) => {
        const uuid = req.params?.uuid;
        const data = await this.postService.deletePostByUuid(uuid);
        res.status(200).send({ message: data });
    };
    getLikesCountForPost = async (req, res) => {
        const uuid = req.params?.uuid;
        const data = await this.likeService.getPostLikesCountByUuid(uuid);
        res.status(200).send({ count: data });
    };
    checkUserLikeStatusForPost = async (req, res) => {
        const user_uuid = req.params?.user_uuid;
        const post_uuid = req.params?.uuid;
        const like = await this.likeService.getUserLikeStatusForPostByUuid(user_uuid, post_uuid);
        res.status(200).send({ status: like?.getId() ? true : false });
    };
    toggleUserLikeForPost = async (req, res) => {
        const user_uuid = req.params?.user_uuid;
        const post_uuid = req.params?.uuid;
        const data = await this.likeService.toggleUserLikeForPost(user_uuid, post_uuid);
        return res.status(200).send({ message: data });
    };
}
;
exports.default = PostsController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const like_dto_1 = __importDefault(require("@/domain/dto/like.dto"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const class_transformer_1 = require("class-transformer");
class LikeService {
    likeRepository;
    postRepository;
    userRepository;
    constructor(likeRepository, postRepository, userRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }
    getPostLikesCountByUuid = async (uuid) => {
        // check if the post_id is provided
        const post = await this.postRepository.findPostsByPostId(uuid);
        if (!post)
            throw api_exception_1.default.HTTP404Error("Post not found");
        // get the total likes for the post
        return await this.likeRepository.findPostsLikeCount(post.getId());
    };
    getUserLikeStatusForPostByUuid = async (user_uuid, post_uuid) => {
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(user_uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // If the post is not found, return an error
        const post = await this.postRepository.findPostsByPostId(post_uuid);
        if (!post)
            throw api_exception_1.default.HTTP404Error("Post not found");
        // If the post is not found, return an error
        const likes = await this.likeRepository.isUserLikePost(user.getId(), post.getId());
        return (0, class_transformer_1.plainToInstance)(like_dto_1.default, likes, {
            excludeExtraneousValues: true,
        });
    };
    toggleUserLikeForPost = async (user_uuid, post_uuid) => {
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(user_uuid);
        if (!user) {
            throw api_exception_1.default.HTTP404Error("User not found");
        }
        // If the post is not found, return an error
        const post = await this.postRepository.findPostsByPostId(post_uuid);
        if (!post) {
            throw api_exception_1.default.HTTP404Error("Post not found");
        }
        // Check to see if the user already likes the post.
        const like = await this.likeRepository.isUserLikePost(user.getId(), post.getId());
        // If the user hasn't liked the post yet, then create or insert.
        if (!like) {
            const data = { user_id: user.getId(), post_id: post.getId() };
            await this.likeRepository.likeUsersPostById(data);
            return "Like added successfully";
        }
        // If the user has already liked the post, then delete or remove.
        await this.likeRepository.dislikeUsersPostById(like.getId());
        return "Like removed successfully";
    };
}
exports.default = LikeService;

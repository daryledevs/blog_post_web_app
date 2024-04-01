"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
const cloudinary_config_1 = __importDefault(require("@/config/cloudinary.config"));
class PostService {
    postRepository;
    userRepository;
    constructor(postRepository, userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }
    ;
    async findPostsByPostId(post_id) {
        try {
            if (!post_id)
                throw error_exception_1.default.badRequest("Missing post's id");
            const data = await this.postRepository.findPostsByPostId(post_id);
            if (!data)
                throw error_exception_1.default.notFound("Post doesn't exist");
            return data;
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getUserPosts(user_id) {
        try {
            if (!user_id)
                throw error_exception_1.default.badRequest("Missing user's id");
            const isUserExist = await this.userRepository.findUserById(user_id);
            if (!isUserExist)
                throw error_exception_1.default.notFound("User doesn't exist");
            return await this.postRepository.getUserPosts(user_id);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getUserTotalPosts(user_id) {
        try {
            if (!user_id)
                throw error_exception_1.default.badRequest("Missing user's id");
            const isUserExist = await this.userRepository.findUserById(user_id);
            if (!isUserExist)
                throw error_exception_1.default.notFound("User doesn't exist");
            return await this.postRepository.getUserTotalPosts(user_id);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async newPost(file, post) {
        try {
            if (!file)
                throw error_exception_1.default.badRequest("No image uploaded");
            if (!post.user_id)
                throw error_exception_1.default.badRequest("Missing user's id");
            const isUserExist = await this.userRepository.findUserById(post.user_id);
            if (!isUserExist)
                throw error_exception_1.default.notFound("User doesn't exist");
            const path = (0, path_1.join)(file.destination, file.filename);
            const { image_id, image_url } = await (0, cloudinary_config_1.default)(path);
            return await this.postRepository.newPost({ ...post, image_id, image_url });
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async editPost(post_id, post) {
        try {
            if (post.image_url)
                throw error_exception_1.default.badRequest("Image url is not allowed to be changed");
            if (!post_id)
                throw error_exception_1.default.badRequest("Missing post's id");
            const data = await this.postRepository.findPostsByPostId(post_id);
            if (!data)
                throw error_exception_1.default.notFound("Post not found");
            return this.postRepository.editPost(post_id, post);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async deletePost(post_id) {
        try {
            if (!post_id)
                throw error_exception_1.default.badRequest("Missing post's id");
            const data = await this.postRepository.findPostsByPostId(post_id);
            if (!data)
                throw error_exception_1.default.notFound("Post not found");
            return await this.postRepository.deletePost(post_id);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getLikesCountForPost(post_id) {
        try {
            const data = await this.postRepository.findPostsByPostId(post_id);
            if (!data)
                throw error_exception_1.default.notFound("Post not found");
            return await this.postRepository.getLikesCountForPost(post_id);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async checkUserLikeStatusForPost(like) {
        try {
            if (like.post_id || like.user_id)
                throw error_exception_1.default.badRequest("Missing required fields");
            return await this.postRepository.isUserLikePost(like);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async toggleUserLikeForPost(like) {
        try {
            if (like.post_id || like.user_id)
                throw error_exception_1.default.badRequest("Missing required fields");
            // check if the post exists
            await this.postRepository.findPostsByPostId(like.post_id);
            // Check to see if the user already likes the post.
            const data = await this.postRepository.isUserLikePost(like);
            // If the user hasn't liked the post yet, then create or insert.
            if (!data)
                return await this.postRepository.toggleUserLikeForPost(like);
            // If the user has already liked the post, then delete or remove.
            return await this.postRepository.removeUserLikeForPost(like);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
}
;
exports.default = PostService;

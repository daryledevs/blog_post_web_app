"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class PostService {
    postRepository;
    userRepository;
    cloudinary;
    wrap = new async_wrapper_util_1.default();
    constructor(postRepository, userRepository, cloudinary) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.cloudinary = cloudinary;
    }
    ;
    findPostsByPostId = this.wrap.serviceWrap(async (post_id) => {
        // Check if the post_id is provided
        if (!post_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the post is not found, return an error
        const data = await this.postRepository.findPostsByPostId(post_id);
        if (!data)
            throw api_exception_1.default.HTTP404Error("Post not found");
        // Return the post
        return data;
    });
    getUserPosts = this.wrap.serviceWrap(async (user_id) => {
        // Check if the user_id is provided
        if (!user_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const isUserExist = await this.userRepository.findUserById(user_id);
        if (!isUserExist)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Get the posts for the user
        return await this.postRepository.getUserPosts(user_id);
    });
    getUserTotalPosts = this.wrap.serviceWrap(async (user_id) => {
        // Check if the user_id is provided
        if (!user_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const isUserExist = await this.userRepository.findUserById(user_id);
        if (!isUserExist)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Get the total posts for the user
        return await this.postRepository.getUserTotalPosts(user_id);
    });
    newPost = this.wrap.serviceWrap(async (file, post) => {
        // Check if the image is uploaded
        if (!file)
            throw api_exception_1.default.HTTP400Error("No image uploaded");
        if (!post?.user_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const isUserExist = await this.userRepository.findUserById(post.user_id);
        if (!isUserExist)
            throw api_exception_1.default.HTTP404Error("User not found");
        const path = (0, path_1.join)(file.destination, file.filename);
        const { image_id, image_url } = await this.cloudinary.uploadAndDeleteLocal(path);
        // Create a new post
        await this.postRepository.newPost({
            ...post,
            image_id,
            image_url,
        });
        return "Post created successfully";
    });
    editPost = this.wrap.serviceWrap(async (post_id, post) => {
        // Check if the arguments is provided
        if (!post_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        if (post.image_url) {
            throw api_exception_1.default.HTTP400Error("Image url is not allowed to be changed");
        }
        // If the post is not found, return an error
        const data = await this.postRepository.findPostsByPostId(post_id);
        if (!data)
            throw api_exception_1.default.HTTP404Error("Post not found");
        // Edit the post
        return this.postRepository.editPost(post_id, post);
    });
    deletePost = this.wrap.serviceWrap(async (post_id) => {
        // check if the arguments is provided
        if (!post_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the post is not found, return an error
        const data = await this.postRepository.findPostsByPostId(post_id);
        if (!data)
            throw api_exception_1.default.HTTP404Error("Post not found");
        // Delete the post
        return await this.postRepository.deletePost(post_id);
    });
    getLikesCountForPost = this.wrap.serviceWrap(async (post_id) => {
        // check if the arguments is provided
        if (!post_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // Check if the post_id is provided
        const data = await this.postRepository.findPostsByPostId(post_id);
        if (!data)
            throw api_exception_1.default.HTTP404Error("Post not found");
        // Get the total likes for the post
        return await this.postRepository.getLikesCountForPost(post_id);
    });
    checkUserLikeStatusForPost = this.wrap.serviceWrap(async (like) => {
        // check if the arguments is provided
        if (!like?.post_id || !like?.user_id) {
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        }
        // If the user is not found, return an error
        const isUserExist = await this.userRepository.findUserById(like.user_id);
        if (!isUserExist)
            throw api_exception_1.default.HTTP404Error("User not found");
        // If the post is not found, return an error
        const isPostExist = await this.postRepository.findPostsByPostId(like.post_id);
        if (!isPostExist)
            throw api_exception_1.default.HTTP404Error("Post not found");
        // If the post is not found, return an error
        return await this.postRepository.isUserLikePost(like);
    });
    toggleUserLikeForPost = this.wrap.serviceWrap(async (like) => {
        // check if the arguments is provided
        if (!like.post_id || !like.user_id) {
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        }
        // If the post is not found, return an error
        await this.postRepository.findPostsByPostId(like.post_id);
        // Check to see if the user already likes the post.
        const data = await this.postRepository.isUserLikePost(like);
        // If the user hasn't liked the post yet, then create or insert.
        if (!data)
            return await this.postRepository.toggleUserLikeForPost(like);
        // If the user has already liked the post, then delete or remove.
        return await this.postRepository.removeUserLikeForPost(like);
    });
}
;
exports.default = PostService;

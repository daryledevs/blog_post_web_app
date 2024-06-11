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
    getPostByUuid = this.wrap.serviceWrap(async (uuid) => {
        // check if the post_id is provided
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // if the post is not found, return an error
        const post = await this.postRepository.findPostsByPostId(uuid);
        if (!post)
            throw api_exception_1.default.HTTP404Error("Post not found");
        // return the post
        return post;
    });
    getAllPostsByUsersUuid = this.wrap.serviceWrap(async (user_uuid) => {
        // check if the user_uuid is provided
        if (!user_uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // if the user is not found, return an error
        const user = await this.userRepository.findUserById(user_uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // get the posts for the user
        return await this.postRepository.findAllPostsByUserId(user.getId());
    });
    geTotalPostsByUsersUuid = this.wrap.serviceWrap(async (user_uuid) => {
        // check if the user_uuid is provided
        if (!user_uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // if the user is not found, return an error
        const user = await this.userRepository.findUserById(user_uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // get the total posts for the user
        return await this.postRepository.findUserTotalPostsByUserId(user.getId());
    });
    createNewPost = this.wrap.serviceWrap(async (post, file) => {
        // check if the image is uploaded
        if (!file)
            throw api_exception_1.default.HTTP400Error("No image uploaded");
        if (!post?.user_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        const user_uuid = post.user_id;
        // if the user is not found, return an error
        const user = await this.userRepository.findUserById(user_uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        const path = (0, path_1.join)(file.destination, file.filename);
        const { image_id, image_url } = await this.cloudinary.uploadAndDeleteLocal(path);
        // create a new post
        await this.postRepository.createNewPost({
            ...post,
            user_id: user.getId(),
            image_id,
            image_url,
        });
        return "Post created successfully";
    });
    updatePostByUuid = this.wrap.serviceWrap(async (uuid, post) => {
        // check if the arguments is provided
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        if (post.image_url) {
            throw api_exception_1.default.HTTP400Error("Image url is not allowed to be changed");
        }
        // if the post is not found, return an error
        const data = await this.postRepository.findPostsByPostId(uuid);
        if (!data)
            throw api_exception_1.default.HTTP404Error("Post not found");
        // edit the post
        await this.postRepository.editPostByPostId(uuid, post);
        return "Post edited successfully";
    });
    deletePostByUuid = this.wrap.serviceWrap(async (uuid) => {
        // check if the arguments is provided
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // if the post is not found, return an error
        const post = await this.postRepository.findPostsByPostId(uuid);
        if (!post)
            throw api_exception_1.default.HTTP404Error("Post not found");
        // delete the post
        await this.postRepository.deletePostById(post.id);
        return "Post deleted successfully";
    });
}
;
exports.default = PostService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("@/domain/models/post.model"));
const post_dto_1 = __importDefault(require("@/domain/dto/post.dto"));
const path_1 = require("path");
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const class_transformer_1 = require("class-transformer");
class PostService {
    postRepository;
    userRepository;
    cloudinary;
    constructor(postRepository, userRepository, cloudinary) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.cloudinary = cloudinary;
    }
    getPostByUuid = async (uuid) => {
        // if the post is not found, return an error
        const post = await this.postRepository.findPostsByPostId(uuid);
        if (!post)
            throw api_exception_1.default.HTTP404Error("Post not found");
        // return the post
        return (0, class_transformer_1.plainToInstance)(post_dto_1.default, post, { excludeExtraneousValues: true });
    };
    getAllPostsByUsersUuid = async (user_uuid) => {
        // if the user is not found, return an error
        const user = await this.userRepository.findUserById(user_uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // get the posts for the user
        const posts = await this.postRepository.findAllPostsByUserId(user.getId());
        return (0, class_transformer_1.plainToInstance)(post_dto_1.default, posts, { excludeExtraneousValues: true });
    };
    geTotalPostsByUsersUuid = async (user_uuid) => {
        // if the user is not found, return an error
        const user = await this.userRepository.findUserById(user_uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // get the total posts for the user
        return await this.postRepository.findUserTotalPostsByUserId(user.getId());
    };
    createNewPost = async (postDto) => {
        const [file] = postDto.getFiles() ?? [];
        const user_uuid = postDto.getUserUuid();
        const destination = file?.destination ?? "";
        const filename = file?.filename ?? "";
        const path = (0, path_1.join)(destination, filename);
        if (!path || (path && path.replace(/\s+/g, "") === "")) {
            throw api_exception_1.default.HTTP400Error("Error on image uploaded");
        }
        // if the user is not found, return an error
        const user = await this.userRepository.findUserById(user_uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        const { image_id, image_url } = await this.cloudinary.uploadAndDeleteLocal(path);
        postDto.setUserId(user.getId());
        postDto.setImageId(image_id);
        postDto.setImageUrl(image_url);
        const post = (0, class_transformer_1.plainToInstance)(post_model_1.default, postDto);
        // create a new post. If an error occurs, delete the image from cloudinary
        try {
            await this.postRepository.createNewPost(post.save());
        }
        catch (error) {
            await this.cloudinary.deleteImage(image_id);
            throw error;
        }
        return "Post created successfully";
    };
    updatePostByUuid = async (postDto) => {
        // if the post is not found, return an error
        const post = await this.postRepository.findPostsByPostId(postDto.getUuid());
        if (!post)
            throw api_exception_1.default.HTTP404Error("Post not found");
        const updatedPost = (0, class_transformer_1.plainToInstance)(post_model_1.default, postDto);
        const data = updatedPost.save();
        Object.keys(data).forEach((key, index) => {
            if (data[key] === undefined || null) {
                delete data[key];
            }
        });
        // update the post
        await this.postRepository.editPostByPostId(updatedPost.getUuid(), data);
        return "Post edited successfully";
    };
    deletePostByUuid = async (uuid) => {
        // if the post is not found, return an error
        const post = await this.postRepository.findPostsByPostId(uuid);
        if (!post)
            throw api_exception_1.default.HTTP404Error("Post not found");
        // delete the post
        await this.postRepository.deletePostById(post.getId());
        return "Post deleted successfully";
    };
}
;
exports.default = PostService;

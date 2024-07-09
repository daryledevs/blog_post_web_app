"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const like_service_impl_1 = __importDefault(require("@/application/services/like/like.service.impl"));
const like_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/like.repository.impl"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const post_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/post.repository.impl"));
const generate_data_util_1 = __importDefault(require("@/__tests__/utils/generate-data.util"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const cloudinary_service_lib_1 = __importDefault(require("@/application/libs/cloudinary-service.lib"));
const vitest_1 = require("vitest");
vitest_1.vi.mock("@/repositories/feed/feed.repository.impl");
vitest_1.vi.mock("@/repositories/user/post.repository.impl");
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
vitest_1.vi.mock("@/utils/cloudinary-service.util");
(0, vitest_1.describe)("PostService", () => {
    let cloudinary;
    let likeRepository;
    let postRepository;
    let userRepository;
    let likeService;
    const error = {
        noArgsMsg: api_exception_1.default.HTTP400Error("No arguments provided"),
        userNotFoundMsg: api_exception_1.default.HTTP400Error("User not found"),
        postNotFoundMsg: api_exception_1.default.HTTP400Error("Post not found"),
    };
    const users = generate_data_util_1.default.createUserList(10);
    const existingUser = users[0];
    const notFoundUser = generate_data_util_1.default.createUser();
    const posts = generate_data_util_1.default.generateMockData(false, users, generate_data_util_1.default.createPost);
    const existingPost = posts[0];
    const nonExistingPost = generate_data_util_1.default.createPost(1000);
    (0, vitest_1.beforeEach)(() => {
        cloudinary = new cloudinary_service_lib_1.default();
        likeRepository = new like_repository_impl_1.default();
        postRepository = new post_repository_impl_1.default();
        userRepository = new user_repository_impl_1.default();
        likeService = new like_service_impl_1.default(likeRepository, postRepository, userRepository);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    afterAll(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("getPostLikesCountByUuid (get the total likes for the post)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(existingPost);
            likeRepository.findPostsLikeCount = vitest_1.vi.fn().mockResolvedValue(10);
            const result = await likeService.getPostLikesCountByUuid(existingPost.uuid);
            (0, vitest_1.expect)(result).toBe(10);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.uuid);
            (0, vitest_1.expect)(likeRepository.findPostsLikeCount).toHaveBeenCalledWith(existingPost.id);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            likeRepository.findPostsLikeCount = vitest_1.vi.fn();
            await (0, vitest_1.expect)(likeService.getPostLikesCountByUuid(undefined)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(likeRepository.findPostsLikeCount).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(undefined);
            likeRepository.findPostsLikeCount = vitest_1.vi.fn();
            await (0, vitest_1.expect)(likeService.getPostLikesCountByUuid(nonExistingPost.uuid)).rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPost.uuid);
            (0, vitest_1.expect)(likeRepository.findPostsLikeCount).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("getUserLikeStatusForPostByUuid (check if the user liked the post)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const like = generate_data_util_1.default.createLike(existingPost.user_id, existingPost.id);
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUser);
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(existingPost);
            likeRepository.isUserLikePost = vitest_1.vi.fn().mockResolvedValue(like);
            const result = await likeService.getUserLikeStatusForPostByUuid(existingUser.uuid, existingPost.uuid);
            (0, vitest_1.expect)(result).toBe(like);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.uuid);
            (0, vitest_1.expect)(likeRepository.isUserLikePost).toHaveBeenCalledWith(existingUser.id, existingPost.id);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            likeRepository.isUserLikePost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(likeService.getUserLikeStatusForPostByUuid(undefined, undefined)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(likeRepository.isUserLikePost).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if user not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            likeRepository.isUserLikePost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(likeService.getUserLikeStatusForPostByUuid(notFoundUser.uuid, existingPost.uuid)).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.uuid);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(likeRepository.isUserLikePost).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUser);
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(undefined);
            likeRepository.isUserLikePost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(likeService.getUserLikeStatusForPostByUuid(existingUser.uuid, nonExistingPost.uuid)).rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPost.uuid);
            (0, vitest_1.expect)(likeRepository.isUserLikePost).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("toggleUserLikeForPost (toggle the user's like for the post)", async () => {
        (0, vitest_1.test)("should return the 'like added successfully' message", async () => {
            const expectedMsg = "Like added successfully";
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUser);
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(existingPost);
            likeRepository.isUserLikePost = vitest_1.vi.fn().mockResolvedValue(undefined);
            likeRepository.likeUsersPostById = vitest_1.vi.fn();
            likeRepository.dislikeUsersPostById = vitest_1.vi.fn();
            const result = await likeService.toggleUserLikeForPost(existingUser.uuid, existingPost.uuid);
            (0, vitest_1.expect)(result).toBe(expectedMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.uuid);
            (0, vitest_1.expect)(likeRepository.isUserLikePost).toHaveBeenCalledWith(existingUser.id, existingPost.id);
            (0, vitest_1.expect)(likeRepository.dislikeUsersPostById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should return the 'like removed successfully' message", async () => {
            const expectedMsg = "Like removed successfully";
            const like = generate_data_util_1.default.createLike(existingPost.user_id, existingPost.id);
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUser);
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(existingPost);
            likeRepository.isUserLikePost = vitest_1.vi.fn().mockResolvedValue(like);
            likeRepository.likeUsersPostById = vitest_1.vi.fn();
            likeRepository.dislikeUsersPostById = vitest_1.vi.fn();
            const result = await likeService.toggleUserLikeForPost(existingUser.uuid, existingPost.uuid);
            (0, vitest_1.expect)(result).toBe(expectedMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.uuid);
            (0, vitest_1.expect)(likeRepository.isUserLikePost).toHaveBeenCalledWith(existingUser.id, existingPost.id);
            (0, vitest_1.expect)(likeRepository.dislikeUsersPostById).toHaveBeenCalledWith(like.id);
            (0, vitest_1.expect)(likeRepository.likeUsersPostById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            likeRepository.isUserLikePost = vitest_1.vi.fn();
            likeRepository.likeUsersPostById = vitest_1.vi.fn();
            likeRepository.dislikeUsersPostById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(likeService.toggleUserLikeForPost(undefined, undefined)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(likeRepository.isUserLikePost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(likeRepository.likeUsersPostById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(likeRepository.dislikeUsersPostById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if user not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            likeRepository.isUserLikePost = vitest_1.vi.fn();
            likeRepository.likeUsersPostById = vitest_1.vi.fn();
            likeRepository.dislikeUsersPostById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(likeService.toggleUserLikeForPost(notFoundUser.uuid, existingPost.uuid)).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.uuid);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(likeRepository.isUserLikePost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(likeRepository.likeUsersPostById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(likeRepository.dislikeUsersPostById).not.toHaveBeenCalled();
        });
    });
});

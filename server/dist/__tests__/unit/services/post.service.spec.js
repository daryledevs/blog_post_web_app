"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const faker_1 = require("@faker-js/faker");
const stream_1 = require("stream");
const post_service_impl_1 = __importDefault(require("@/application/services/post/post.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const post_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/post.repository.impl"));
const generate_data_util_1 = __importDefault(require("@/__tests__/utils/generate-data.util"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const cloudinary_service_lib_1 = __importDefault(require("@/application/libs/cloudinary-service.lib"));
const vitest_1 = require("vitest");
vitest_1.vi.mock("@/repositories/feed/feed.repository.impl");
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
vitest_1.vi.mock("@/utils/cloudinary-service.util");
(0, vitest_1.describe)("PostService", () => {
    let cloudinary;
    let postRepository;
    let userRepository;
    let postService;
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
        postRepository = new post_repository_impl_1.default();
        userRepository = new user_repository_impl_1.default();
        postService = new post_service_impl_1.default(postRepository, userRepository, cloudinary);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    afterAll(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("getPostByUuid (get post by id)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            postRepository.findPostsByPostId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingPost);
            const result = await postService.getPostByUuid(existingPost.uuid);
            (0, vitest_1.expect)(result).toEqual(existingPost);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.uuid);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(null);
            await (0, vitest_1.expect)(postService.getPostByUuid(null)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(null);
            await (0, vitest_1.expect)(postService.getPostByUuid(nonExistingPost.uuid)).rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPost.uuid);
        });
    });
    (0, vitest_1.describe)("getAllPostsByUsersUuid", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUser);
            postRepository.findAllPostsByUserId = vitest_1.vi.fn().mockResolvedValue(posts);
            const result = await postService.getAllPostsByUsersUuid(existingUser.uuid);
            (0, vitest_1.expect)(result).toEqual(posts);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(postRepository.findAllPostsByUserId).toHaveBeenCalledWith(existingUser.id);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.getAllPostsByUsersUuid(null)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if user not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(null);
            await (0, vitest_1.expect)(postService.getAllPostsByUsersUuid(notFoundUser.uuid)).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.uuid);
        });
    });
    (0, vitest_1.describe)("geTotalPostsByUsersUuid (get the total post available for feed)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUser);
            postRepository.findUserTotalPostsByUserId = vitest_1.vi.fn().mockResolvedValue(posts.length);
            const result = await postService.geTotalPostsByUsersUuid(existingUser.uuid);
            (0, vitest_1.expect)(result).toEqual(posts.length);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(postRepository.findUserTotalPostsByUserId).toHaveBeenCalledWith(existingUser.id);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            postRepository.findUserTotalPostsByUserId = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.geTotalPostsByUsersUuid(undefined))
                .rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.findUserTotalPostsByUserId).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if user not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.findUserTotalPostsByUserId = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.geTotalPostsByUsersUuid(notFoundUser.uuid))
                .rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.uuid);
            (0, vitest_1.expect)(postRepository.findUserTotalPostsByUserId).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("createNewPost (create new post from the user)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const { image_url, image_id, ...rest } = existingPost;
            const buffer = Buffer.alloc(1024 * 1024 * 10, ".");
            const file = {
                buffer,
                mimetype: "image/jpeg",
                originalname: faker_1.faker.system.fileName(),
                size: buffer.length,
                filename: faker_1.faker.system.fileName(),
                destination: faker_1.faker.system.directoryPath(),
                fieldname: "",
                encoding: "",
                stream: new stream_1.Readable(),
                path: faker_1.faker.system.filePath(),
                image_id,
                user_id: rest.user_id,
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            postRepository.createNewPost = vitest_1.vi
                .fn()
                .mockResolvedValue(existingPost);
            cloudinary.uploadAndDeleteLocal = vitest_1.vi
                .fn()
                .mockResolvedValue({ image_url, image_id });
            const result = await postService.createNewPost(rest, file);
            (0, vitest_1.expect)(result).toBe("Post created successfully");
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingPost.user_id);
            (0, vitest_1.expect)(cloudinary.uploadAndDeleteLocal).toHaveBeenCalledWith((0, path_1.join)(file.destination, file.filename));
            (0, vitest_1.expect)(postRepository.createNewPost).toHaveBeenCalledWith({
                ...rest,
                image_url,
                image_id,
            });
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            const { image_url, image_id, user_id, ...rest } = existingPost;
            const buffer = Buffer.alloc(1024 * 1024 * 10, ".");
            const file = {
                buffer,
                mimetype: "image/jpeg",
                originalname: faker_1.faker.system.fileName(),
                size: buffer.length,
                filename: faker_1.faker.system.fileName(),
                destination: faker_1.faker.system.directoryPath(),
                fieldname: "",
                encoding: "",
                stream: new stream_1.Readable,
                path: faker_1.faker.system.filePath(),
                image_id,
                user_id,
            };
            userRepository.findUserById = vitest_1.vi.fn();
            postRepository.createNewPost = vitest_1.vi.fn();
            cloudinary.uploadAndDeleteLocal = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.createNewPost(undefined, file))
                .rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.createNewPost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if no image uploaded", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            postRepository.createNewPost = vitest_1.vi.fn();
            cloudinary.uploadAndDeleteLocal = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.createNewPost(undefined, undefined))
                .rejects.toThrow("No image uploaded");
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.createNewPost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if user not found", async () => {
            const { image_url, image_id, ...rest } = existingPost;
            const buffer = Buffer.alloc(1024 * 1024 * 10, ".");
            const file = {
                buffer,
                mimetype: "image/jpeg",
                originalname: faker_1.faker.system.fileName(),
                size: buffer.length,
                filename: faker_1.faker.system.fileName(),
                destination: faker_1.faker.system.directoryPath(),
                fieldname: "",
                encoding: "",
                stream: new stream_1.Readable(),
                path: faker_1.faker.system.filePath(),
                image_id,
                user_id: rest.user_id,
            };
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.createNewPost = vitest_1.vi.fn();
            cloudinary.uploadAndDeleteLocal = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.createNewPost(rest, file))
                .rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingPost.user_id);
            (0, vitest_1.expect)(postRepository.createNewPost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("updatePostByUuid (edit the user's post)", () => {
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            postRepository.findPostsByPostId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingPost);
            postRepository.editPostByPostId = vitest_1.vi.fn();
            const { image_url, image_id, ...rest } = existingPost;
            const result = await postService.updatePostByUuid(existingPost.uuid, rest);
            (0, vitest_1.expect)(result).toBe("Post edited successfully");
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.uuid);
            (0, vitest_1.expect)(postRepository.editPostByPostId).toHaveBeenCalledWith(existingPost.uuid, rest);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            postRepository.editPostByPostId = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.updatePostByUuid(undefined, undefined)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.editPostByPostId).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.editPostByPostId = vitest_1.vi.fn();
            const { image_url, image_id, ...rest } = nonExistingPost;
            await (0, vitest_1.expect)(postService.updatePostByUuid(rest.uuid, rest)).rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(rest.uuid);
            (0, vitest_1.expect)(postRepository.editPostByPostId).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("deletePostByUuid (delete the user's post)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            postRepository.findPostsByPostId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingPost);
            postRepository.deletePostById = vitest_1.vi.fn();
            const result = await postService.deletePostByUuid(existingPost.uuid);
            (0, vitest_1.expect)(result).toBe("Post deleted successfully");
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.uuid);
            (0, vitest_1.expect)(postRepository.deletePostById).toHaveBeenCalledWith(existingPost.id);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            postRepository.deletePostById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.deletePostByUuid(undefined)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.deletePostById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.deletePostById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.deletePostByUuid(nonExistingPost.uuid)).rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPost.uuid);
            (0, vitest_1.expect)(postRepository.deletePostById).not.toHaveBeenCalled();
        });
    });
});

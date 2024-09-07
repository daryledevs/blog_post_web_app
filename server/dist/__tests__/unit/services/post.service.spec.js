"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const vitest_1 = require("vitest");
const post_dto_1 = __importDefault(require("@/domain/dto/post.dto"));
const user_dto_1 = __importDefault(require("@/domain/dto/user.dto"));
const path_1 = require("path");
const faker_1 = require("@faker-js/faker");
const stream_1 = require("stream");
const post_service_impl_1 = __importDefault(require("@/application/services/post/post.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const post_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/post.repository.impl"));
const generate_data_util_1 = __importDefault(require("@/__tests__/utils/generate-data.util"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const cloudinary_service_lib_1 = __importDefault(require("@/application/libs/cloudinary-service.lib"));
const class_transformer_1 = require("class-transformer");
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
    const existingUserDto = (0, class_transformer_1.plainToInstance)(user_dto_1.default, existingUser, {
        excludeExtraneousValues: true,
    });
    const notFoundUser = generate_data_util_1.default.createUser();
    const notFoundUserDto = (0, class_transformer_1.plainToInstance)(user_dto_1.default, notFoundUser, {
        excludeExtraneousValues: true,
    });
    const posts = generate_data_util_1.default.generateMockData(false, users, generate_data_util_1.default.createPost);
    const postsDto = posts.map((post) => (0, class_transformer_1.plainToInstance)(post_dto_1.default, post, { excludeExtraneousValues: true }));
    const existingPost = posts[0];
    const existingPostDto = (0, class_transformer_1.plainToInstance)(post_dto_1.default, existingPost, {
        excludeExtraneousValues: true,
    });
    const nonExistingPost = generate_data_util_1.default.createPost(1000);
    const nonExistingPostDto = (0, class_transformer_1.plainToInstance)(post_dto_1.default, nonExistingPost, {
        excludeExtraneousValues: true,
    });
    (0, vitest_1.beforeEach)(() => {
        cloudinary = new cloudinary_service_lib_1.default();
        postRepository = new post_repository_impl_1.default(cloudinary);
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
                .mockResolvedValue(existingPostDto);
            const result = await postService.getPostByUuid(existingPostDto.getUuid());
            (0, vitest_1.expect)(result).toEqual(existingPostDto);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPostDto.getUuid());
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(null);
            await (0, vitest_1.expect)(postService.getPostByUuid(nonExistingPostDto.getUuid())).rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPostDto.getUuid());
        });
    });
    (0, vitest_1.describe)("getAllPostsByUsersUuid", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUser);
            postRepository.findAllPostsByUserId = vitest_1.vi.fn().mockResolvedValue(posts);
            const result = await postService.getAllPostsByUsersUuid(existingUserDto.getUuid());
            (0, vitest_1.expect)(result).toEqual(postsDto);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUserDto.getUuid());
            (0, vitest_1.expect)(postRepository.findAllPostsByUserId).toHaveBeenCalledWith(existingUserDto.getId());
        });
        (0, vitest_1.test)("should throw an error if user not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(null);
            await (0, vitest_1.expect)(postService.getAllPostsByUsersUuid(notFoundUserDto.getUuid())).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(notFoundUserDto.getUuid());
        });
    });
    (0, vitest_1.describe)("geTotalPostsByUsersUuid (get the total post available for feed)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUserDto);
            postRepository.findUserTotalPostsByUserId = vitest_1.vi.fn().mockResolvedValue(posts.length);
            const result = await postService.geTotalPostsByUsersUuid(existingUserDto.getUuid());
            (0, vitest_1.expect)(result).toEqual(posts.length);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUserDto.getUuid());
            (0, vitest_1.expect)(postRepository.findUserTotalPostsByUserId).toHaveBeenCalledWith(existingUserDto.getId());
        });
        (0, vitest_1.test)("should throw an error if user not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.findUserTotalPostsByUserId = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.geTotalPostsByUsersUuid(notFoundUserDto.getUuid()))
                .rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(notFoundUserDto.getUuid());
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
            const post = { ...rest, files: file };
            const existingPostDto = (0, class_transformer_1.plainToInstance)(post_dto_1.default, post, {
                excludeExtraneousValues: true,
            });
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUserDto);
            postRepository.createNewPost = vitest_1.vi
                .fn()
                .mockResolvedValue(existingPostDto);
            cloudinary.uploadAndDeleteLocal = vitest_1.vi
                .fn()
                .mockResolvedValue({ image_url, image_id });
            const result = await postService.createNewPost(existingPostDto);
            (0, vitest_1.expect)(result).toBe("Post created successfully");
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingPostDto.getUserUuid());
            (0, vitest_1.expect)(cloudinary.uploadAndDeleteLocal).toHaveBeenCalledWith((0, path_1.join)(file.destination, file.filename));
            (0, vitest_1.expect)(postRepository.createNewPost).toHaveBeenCalledWith(existingPostDto);
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
            const post = { ...rest, files: file };
            const existingPostDto = (0, class_transformer_1.plainToInstance)(post_dto_1.default, post);
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.createNewPost = vitest_1.vi.fn();
            cloudinary.uploadAndDeleteLocal = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.createNewPost(existingPostDto))
                .rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingPostDto.getUserUuid());
            (0, vitest_1.expect)(postRepository.createNewPost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("updatePostByUuid (edit the user's post)", () => {
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
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
            const post = { ...rest, files: file };
            const existingPostDto = (0, class_transformer_1.plainToInstance)(post_dto_1.default, post);
            postRepository.findPostsByPostId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingPostDto);
            postRepository.editPostByPostId = vitest_1.vi.fn();
            const result = await postService.updatePostByUuid(existingPostDto);
            (0, vitest_1.expect)(result).toBe("Post edited successfully");
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPostDto.getUuid());
            (0, vitest_1.expect)(postRepository.editPostByPostId).toHaveBeenCalledWith(existingPostDto.getUuid(), rest);
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            const { image_url, image_id, ...rest } = nonExistingPost;
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
            const post = { ...rest, files: file };
            const existingPostDto = (0, class_transformer_1.plainToInstance)(post_dto_1.default, post);
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.editPostByPostId = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.updatePostByUuid(existingPostDto)).rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(rest.uuid);
            (0, vitest_1.expect)(postRepository.editPostByPostId).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("deletePostByUuid (delete the user's post)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            postRepository.findPostsByPostId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingPostDto);
            postRepository.deletePostById = vitest_1.vi.fn();
            const result = await postService.deletePostByUuid(existingPostDto.getUuid());
            (0, vitest_1.expect)(result).toBe("Post deleted successfully");
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPostDto.getUuid());
            (0, vitest_1.expect)(postRepository.deletePostById).toHaveBeenCalledWith(existingPostDto.getId());
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.deletePostById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.deletePostByUuid(nonExistingPostDto.getUuid())).rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPostDto.getUuid());
            (0, vitest_1.expect)(postRepository.deletePostById).not.toHaveBeenCalled();
        });
    });
});

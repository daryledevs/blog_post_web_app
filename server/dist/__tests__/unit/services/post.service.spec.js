"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_service_impl_1 = __importDefault(require("@/services/post/post.service.impl"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const post_repository_impl_1 = __importDefault(require("@/repositories/post/post.repository.impl"));
const generate_data_util_1 = __importDefault(require("../../utils/generate-data.util"));
const vitest_1 = require("vitest");
vitest_1.vi.mock("@/repositories/feed/feed.repository.impl");
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
(0, vitest_1.describe)("FeedService", () => {
    let postRepository;
    let userRepository;
    let postService;
    const noArgsMsgError = api_exception_1.default.HTTP400Error("No arguments provided");
    const userNotFoundMsgError = api_exception_1.default.HTTP400Error("User not found");
    const postNotFoundMsgError = api_exception_1.default.HTTP400Error("Post not found");
    const users = generate_data_util_1.default.createUserList(10);
    const posts = generate_data_util_1.default.generateMockData(false, users, generate_data_util_1.default.createPost);
    const existingPost = posts[0];
    const nonExistingPost = generate_data_util_1.default.createPost(1000);
    (0, vitest_1.beforeEach)(() => {
        postRepository = new post_repository_impl_1.default();
        userRepository = new user_repository_impl_1.default();
        postService = new post_service_impl_1.default(postRepository, userRepository);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    afterAll(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("findPostsByPostId", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(existingPost);
            const result = await postService.findPostsByPostId(existingPost.post_id);
            (0, vitest_1.expect)(result).toEqual(existingPost);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.post_id);
        });
        (0, vitest_1.test)("should throw an error if no post_id provided", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(null);
            await (0, vitest_1.expect)(postService.findPostsByPostId(null)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(null);
            await (0, vitest_1.expect)(postService.findPostsByPostId(nonExistingPost.post_id)).rejects.toThrow(postNotFoundMsgError);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPost.post_id);
        });
    });
});

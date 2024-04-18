import PostService                                           from "@/services/post/post.service.impl";
import ErrorException                                        from "@/exceptions/api.exception";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import PostRepository                                        from "@/repositories/post/post.repository.impl";
import GenerateMockData                                      from "../../utils/generate-data.util";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/repositories/feed/feed.repository.impl");

vi.mock("@/repositories/user/user.repository.impl");

describe("FeedService", () => {
  let postRepository: PostRepository;
  let userRepository: UserRepository;
  let postService: PostService;

  const noArgsMsgError: ErrorException = 
    ErrorException.HTTP400Error("No arguments provided");

  const userNotFoundMsgError: ErrorException = 
    ErrorException.HTTP400Error("User not found");

  const postNotFoundMsgError: ErrorException =
    ErrorException.HTTP400Error("Post not found");

  const users = GenerateMockData.createUserList(10);
  const existingUser = users[0]!;
  const notFoundUser = GenerateMockData.createUser();

  const posts = GenerateMockData.generateMockData(
    false, users, GenerateMockData.createPost
  );
  const existingPost = posts[0]!;
  const nonExistingPost = GenerateMockData.createPost(1000);

  beforeEach(() => {
    postRepository = new PostRepository();
    userRepository = new UserRepository();

    postService = new PostService(postRepository, userRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("findPostsByPostId", async () => {
    test("should return the correct result", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(existingPost);

      const result = await postService.findPostsByPostId(existingPost.post_id);

      expect(result).toEqual(existingPost);
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.post_id);
    });

    test("should throw an error if no args provided", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(null);

      await expect(
        postService.findPostsByPostId(null as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(null);

      await expect(
        postService.findPostsByPostId(nonExistingPost.post_id)
      ).rejects.toThrow(postNotFoundMsgError);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPost.post_id);
    });
  });

  describe("getUserPosts", async () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);
      postRepository.getUserPosts = vi.fn().mockResolvedValue(posts);

      const result = await postService.getUserPosts(existingUser.user_id);

      expect(result).toEqual(posts);
      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(postRepository.getUserPosts).toHaveBeenCalledWith(existingUser.user_id);
    });

    test("should throw an error if no args provided", async () => {
      userRepository.findUserById = vi.fn();

      await expect(
        postService.getUserPosts(null as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
    });

    test("should throw an error if user not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(null);

      await expect(
        postService.getUserPosts(notFoundUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
    });
  });
});


import createPost                                            from "@/__mock__/data/post.mock";
import PostService                                           from "@/services/post/post.service.impl";
import ErrorException                                        from "@/exceptions/error.exception";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import PostRepository                                        from "@/repositories/post/post.repository.impl";
import generateMockData                                      from "../util/generate-mock-data";
import { createUserList }                                    from "@/__mock__/data/user.mock";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/repositories/feed/feed.repository.impl");

vi.mock("@/repositories/user/user.repository.impl");

describe("FeedService", () => {
  let postRepository: PostRepository;
  let userRepository: UserRepository;
  let postService: PostService;

  const noArgsMsgError: ErrorException = 
    ErrorException.badRequest("No arguments provided");

  const userNotFoundMsgError: ErrorException = 
    ErrorException.badRequest("User not found");

  const postNotFoundMsgError: ErrorException =
    ErrorException.badRequest("Post not found");

  const users = createUserList(10);
  const posts = generateMockData(false, users, createPost);
  const existingPost = posts[0]!;
  const nonExistingPost = createPost(1000);

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
      expect(postRepository.findPostsByPostId).toBeCalledWith(existingPost.post_id);
    });

    test("should throw an error if no post_id provided", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(null);

      await expect(
        postService.findPostsByPostId(null as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(postRepository.findPostsByPostId).not.toBeCalled();
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(null);

      await expect(
        postService.findPostsByPostId(nonExistingPost.post_id)
      ).rejects.toThrow(postNotFoundMsgError);

      expect(postRepository.findPostsByPostId).toBeCalledWith(nonExistingPost.post_id);
    });
  });
});

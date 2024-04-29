import { join }                                              from "path";
import { faker }                                             from "@faker-js/faker";
import PostService                                           from "@/services/post/post.service.impl";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import PostRepository                                        from "@/repositories/post/post.repository.impl";
import GenerateMockData                                      from "../../utils/generate-data.util";
import ApiErrorException                                     from "@/exceptions/api.exception";
import CloudinaryService                                     from "@/utils/cloudinary-service.util";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/repositories/feed/feed.repository.impl");

vi.mock("@/repositories/user/user.repository.impl");

vi.mock("@/utils/cloudinary-service.util");

describe("FeedService", () => {
  let cloudinary: CloudinaryService;
  let postRepository: PostRepository;
  let userRepository: UserRepository;
  let postService: PostService;

  const error = {
    noArgsMsg: ApiErrorException.HTTP400Error("No arguments provided"),
    userNotFoundMsg: ApiErrorException.HTTP400Error("User not found"),
    postNotFoundMsg: ApiErrorException.HTTP400Error("Post not found"),
  };

  const users = GenerateMockData.createUserList(10);
  const existingUser = users[0]!;
  const notFoundUser = GenerateMockData.createUser();

  const posts = GenerateMockData.generateMockData(
    false, users, GenerateMockData.createPost
  );
  const existingPost = posts[0]!;
  const nonExistingPost = GenerateMockData.createPost(1000);

  beforeEach(() => {
    cloudinary = new CloudinaryService();
    postRepository = new PostRepository();
    userRepository = new UserRepository();

    postService = new PostService(
      postRepository, 
      userRepository, 
      cloudinary
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("findPostsByPostId (get post by id)", async () => {
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
      ).rejects.toThrow(error.noArgsMsg);

      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(null);

      await expect(
        postService.findPostsByPostId(nonExistingPost.post_id)
      ).rejects.toThrow(error.postNotFoundMsg);

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
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
    });

    test("should throw an error if user not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(null);

      await expect(
        postService.getUserPosts(notFoundUser.user_id)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
    });
  });

  describe("getUserTotalPosts (get the total post available for feed)", async () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);
      postRepository.getUserTotalPosts = vi.fn().mockResolvedValue(posts.length);

      const result = await postService.getUserTotalPosts(existingUser.user_id);

      expect(result).toEqual(posts.length);
      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(postRepository.getUserTotalPosts).toHaveBeenCalledWith(existingUser.user_id);
    });

    test("should throw an error if no args provided", async () => {
      userRepository.findUserById = vi.fn();
      postRepository.getUserTotalPosts = vi.fn();

      await expect(
        postService.getUserTotalPosts(undefined))
      .rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(postRepository.getUserTotalPosts).not.toHaveBeenCalled();
    });

    test("should throw an error if user not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(undefined);
      postRepository.getUserTotalPosts = vi.fn();

      await expect(
        postService.getUserTotalPosts(notFoundUser.user_id))
      .rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(postRepository.getUserTotalPosts).not.toHaveBeenCalled();
    });
  });

  describe("newPost (create new post from the user)", async () => {
    test("should return the correct result", async () => {
      const { image_url, image_id, ...rest } = existingPost;

      const buffer = Buffer.alloc(1024 * 1024 * 10, ".");
      const file = {
        buffer,
        mimetype: "image/jpeg",
        originalname: faker.system.fileName(),
        size: buffer.length,
        filename: faker.system.fileName(),
        destination: faker.system.directoryPath()
      };

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      postRepository.newPost = vi
        .fn()
        .mockResolvedValue(existingPost);

      cloudinary.uploadAndDeleteLocal = vi
        .fn()
        .mockResolvedValue({ image_url, image_id });
      
      const result = await postService.newPost(file, rest);

      expect(result).toBe("Post created successfully");
      expect(userRepository.findUserById).toHaveBeenCalledWith(existingPost.user_id);
      
      expect(cloudinary.uploadAndDeleteLocal).toHaveBeenCalledWith(
        join(file.destination, file.filename)
      );

      expect(postRepository.newPost).toHaveBeenCalledWith({
        ...rest,
        image_url,
        image_id,
      });
    });
    
    test("should throw an error if no args provided", async () => {
      const { image_url, image_id, ...rest } = existingPost;
      const buffer = Buffer.alloc(1024 * 1024 * 10, ".");
      const file = {
        buffer,
        mimetype: "image/jpeg",
        originalname: faker.system.fileName(),
        size: buffer.length,
        filename: faker.system.fileName(),
        destination: faker.system.directoryPath(),
      };

      userRepository.findUserById = vi.fn();
      postRepository.newPost = vi.fn();
      cloudinary.uploadAndDeleteLocal = vi.fn();

      await expect(
        postService.newPost(file, undefined))
      .rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(postRepository.newPost).not.toHaveBeenCalled();
      expect(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
    });

    test("should throw an error if no image uploaded", async () => {
      userRepository.findUserById = vi.fn();
      postRepository.newPost = vi.fn();
      cloudinary.uploadAndDeleteLocal = vi.fn();

      await expect(
        postService.newPost(undefined, undefined))
      .rejects.toThrow("No image uploaded");

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(postRepository.newPost).not.toHaveBeenCalled();
      expect(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
    });

    test("should throw an error if user not found", async () => {
      const { image_url, image_id, ...rest } = existingPost;
      const buffer = Buffer.alloc(1024 * 1024 * 10, ".");
      const file = {
        buffer,
        mimetype: "image/jpeg",
        originalname: faker.system.fileName(),
        size: buffer.length,
        filename: faker.system.fileName(),
        destination: faker.system.directoryPath(),
      };

      userRepository.findUserById = vi.fn().mockResolvedValue(undefined);
      postRepository.newPost = vi.fn();
      cloudinary.uploadAndDeleteLocal = vi.fn();

      await expect(
        postService.newPost(file, rest))
      .rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(existingPost.user_id);
      expect(postRepository.newPost).not.toHaveBeenCalled();
      expect(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
    });
  });

  describe("editPost (edit the user's post)", () => {
    test("should throw an error if no args provided", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(existingPost);
      postRepository.editPost = vi.fn().mockResolvedValue(existingPost);

      const { image_url, image_id, ...rest } = existingPost;
      const result = await postService.editPost(existingPost.post_id, rest);

      expect(result).toBe(existingPost)
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.post_id);
      expect(postRepository.editPost).toHaveBeenCalledWith(existingPost.post_id, rest);
    });

    test("should throw an error if no args provided", async () => {
      postRepository.findPostsByPostId = vi.fn();
      postRepository.editPost = vi.fn();

      await expect(
        postService.editPost(undefined, undefined))
      .rejects.toThrow(error.noArgsMsg);

      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(postRepository.editPost).not.toHaveBeenCalled();
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(undefined);
      postRepository.editPost = vi.fn();

      const { image_url, image_id, ...rest } = nonExistingPost;

      await expect(
        postService.editPost(rest.post_id, rest)
      ).rejects.toThrow(error.postNotFoundMsg);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(rest.post_id);
      expect(postRepository.editPost).not.toHaveBeenCalled();
    });
  });

  describe("deletePost (delete the user's post)", async () => {
    test("should return the correct result", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(existingPost);
      postRepository.deletePost = vi.fn().mockResolvedValue("Post deleted successfully");

      const result = await postService.deletePost(existingPost.post_id);

      expect(result).toBe("Post deleted successfully");
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.post_id);
      expect(postRepository.deletePost).toHaveBeenCalledWith(existingPost.post_id);
    });

    test("should throw an error if no args provided", async () => {
      postRepository.findPostsByPostId = vi.fn();
      postRepository.deletePost = vi.fn();

      await expect(
        postService.deletePost(undefined))
      .rejects.toThrow(error.noArgsMsg);

      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(postRepository.deletePost).not.toHaveBeenCalled();
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(undefined);
      postRepository.deletePost = vi.fn();

      await expect(
        postService.deletePost(nonExistingPost.post_id))
      .rejects.toThrow(error.postNotFoundMsg);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPost.post_id);
      expect(postRepository.deletePost).not.toHaveBeenCalled();
    });
  });

  describe("getLikesCountForPost (get the total likes for the post)", async () => {
    test("should return the correct result", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(existingPost);
      postRepository.getLikesCountForPost = vi.fn().mockResolvedValue(10);

      const result = await postService.getLikesCountForPost(existingPost.post_id);

      expect(result).toBe(10);
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.post_id);
      expect(postRepository.getLikesCountForPost).toHaveBeenCalledWith(existingPost.post_id);
    });

    test("should throw an error if no args provided", async () => {
      postRepository.findPostsByPostId = vi.fn();
      postRepository.getLikesCountForPost = vi.fn();

      await expect(
        postService.getLikesCountForPost(undefined))
      .rejects.toThrow(error.noArgsMsg);

      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(postRepository.getLikesCountForPost).not.toHaveBeenCalled();
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(undefined);
      postRepository.getLikesCountForPost = vi.fn();

      await expect(
        postService.getLikesCountForPost(nonExistingPost.post_id))
      .rejects.toThrow(error.postNotFoundMsg);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPost.post_id);
      expect(postRepository.getLikesCountForPost).not.toHaveBeenCalled();
    });
  });

  describe("checkUserLikeStatusForPost (check if the user liked the post)", async () => {
    test("should return the correct result", async () => {
      const like = GenerateMockData.createLike(
        existingPost.post_id,
        existingPost.user_id
      );

      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(existingPost);
      postRepository.isUserLikePost = vi.fn().mockResolvedValue(like);

      const result = await postService.checkUserLikeStatusForPost(like);

      expect(result).toBe(like);
      expect(userRepository.findUserById).toHaveBeenCalledWith(like.user_id);
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(like.post_id);
      expect(postRepository.isUserLikePost).toHaveBeenCalledWith(like);
    });

    test("should throw an error if no args provided", async () => {
      userRepository.findUserById = vi.fn();
      postRepository.findPostsByPostId = vi.fn();
      postRepository.isUserLikePost = vi.fn();

      await expect(
        postService.checkUserLikeStatusForPost(undefined))
      .rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(postRepository.isUserLikePost).not.toHaveBeenCalled();
    });

    test("should throw an error if user not found", async () => {
      const like = GenerateMockData.createLike(
        existingPost.post_id,
        existingPost.user_id
      );

      userRepository.findUserById = vi.fn().mockResolvedValue(undefined);
      postRepository.findPostsByPostId = vi.fn();
      postRepository.isUserLikePost = vi.fn();

      await expect(
        postService.checkUserLikeStatusForPost(like))
      .rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(like.user_id);
      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(postRepository.isUserLikePost).not.toHaveBeenCalled();
    });

    test("should throw an error if post not found", async () => {
      const like = GenerateMockData.createLike(
        existingPost.post_id,
        existingPost.user_id
      );

      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(undefined);
      postRepository.isUserLikePost = vi.fn();

      await expect(
        postService.checkUserLikeStatusForPost(like))
      .rejects.toThrow(error.postNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(like.user_id);
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(like.post_id);
      expect(postRepository.isUserLikePost).not.toHaveBeenCalled();
    });
  });

  describe("toggleUserLikeForPost (toggle the user's like for the post)", async () => {
    test("should return the 'like added successfully' message", async () => {
      const like = GenerateMockData.createLike(
        existingPost.post_id,
        existingPost.user_id
      );

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      postRepository.findPostsByPostId = vi
        .fn()
        .mockResolvedValue(existingPost);

      postRepository.isUserLikePost = vi
        .fn()
        .mockResolvedValue(undefined);

      postRepository.toggleUserLikeForPost = vi.fn();

      postRepository.removeUserLikeForPost = vi.fn();

      const result = await postService.toggleUserLikeForPost(like);

      expect(result).toBe("Like added successfully");
      expect(userRepository.findUserById).toHaveBeenCalledWith(like.user_id);
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(like.post_id);
      expect(postRepository.isUserLikePost).toHaveBeenCalledWith(like);
      expect(postRepository.removeUserLikeForPost).not.toHaveBeenCalled();
    });

    test("should return the 'like removed successfully' message", async () => {
      const like = GenerateMockData.createLike(
        existingPost.post_id,
        existingPost.user_id
      );

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      postRepository.findPostsByPostId = vi
        .fn()
        .mockResolvedValue(existingPost);

      postRepository.isUserLikePost = vi
        .fn()
        .mockResolvedValue(like);

      postRepository.toggleUserLikeForPost = vi.fn();

      postRepository.removeUserLikeForPost = vi.fn();

      const result = await postService.toggleUserLikeForPost(like);

      expect(result).toBe("Like removed successfully");
      expect(userRepository.findUserById).toHaveBeenCalledWith(like.user_id);
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(like.post_id);
      expect(postRepository.isUserLikePost).toHaveBeenCalledWith(like);
      expect(postRepository.removeUserLikeForPost).toHaveBeenCalledWith(like);
      expect(postRepository.toggleUserLikeForPost).not.toHaveBeenCalled();
    });

    test("should throw an error if no args provided", async () => {
      userRepository.findUserById = vi.fn();
      postRepository.findPostsByPostId = vi.fn();
      postRepository.isUserLikePost = vi.fn();
      postRepository.toggleUserLikeForPost = vi.fn();
      postRepository.removeUserLikeForPost = vi.fn();

      await expect(
        postService.toggleUserLikeForPost(undefined))
      .rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(postRepository.isUserLikePost).not.toHaveBeenCalled();
      expect(postRepository.toggleUserLikeForPost).not.toHaveBeenCalled();
      expect(postRepository.removeUserLikeForPost).not.toHaveBeenCalled();
    });

    test("should throw an error if user not found", async () => {
      const like = GenerateMockData.createLike(
        existingPost.post_id,
        existingPost.user_id
      );

      userRepository.findUserById = vi.fn().mockResolvedValue(undefined);
      postRepository.findPostsByPostId = vi.fn();
      postRepository.isUserLikePost = vi.fn();
      postRepository.toggleUserLikeForPost = vi.fn();
      postRepository.removeUserLikeForPost = vi.fn();

      await expect(
        postService.toggleUserLikeForPost(like))
      .rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(like.user_id);
      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(postRepository.isUserLikePost).not.toHaveBeenCalled();
      expect(postRepository.toggleUserLikeForPost).not.toHaveBeenCalled();
      expect(postRepository.removeUserLikeForPost).not.toHaveBeenCalled();
    });
  });
});

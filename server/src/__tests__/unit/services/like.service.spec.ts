import LikeService                                           from "@/services/like/like.service.impl";
import IELikeService                                         from "@/services/like/like.service";
import LikeRepository                                        from "@/repositories/like/like.repository.impl";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import PostRepository                                        from "@/repositories/post/post.repository.impl";
import IEPostRepository                                      from "@/repositories/post/post.repository";
import IEUserRepository                                      from "@/repositories/user/user.repository";
import IELikeRepository                                      from "@/repositories/like/like.repository";
import GenerateMockData                                      from "../../utils/generate-data.util";
import ApiErrorException                                     from "@/exceptions/api.exception";
import CloudinaryService                                     from "@/libraries/cloudinary/cloudinary-service.lib";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/repositories/feed/feed.repository.impl");

vi.mock("@/repositories/user/post.repository.impl");

vi.mock("@/repositories/user/user.repository.impl");

vi.mock("@/utils/cloudinary-service.util");

describe("PostService", () => {
  let cloudinary:     CloudinaryService;
  let likeRepository: IELikeRepository;
  let postRepository: IEPostRepository;
  let userRepository: IEUserRepository;
  let likeService:    IELikeService;

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
    likeRepository = new LikeRepository();
    postRepository = new PostRepository();
    userRepository = new UserRepository();

    likeService = new LikeService(
      likeRepository, 
      postRepository,
      userRepository,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("getPostLikesCountByUuid (get the total likes for the post)", async () => {
    test("should return the correct result", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(existingPost);
      likeRepository.findPostsLikeCount = vi.fn().mockResolvedValue(10);

      const result = await likeService.getPostLikesCountByUuid(existingPost.uuid);

      expect(result).toBe(10);
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        existingPost.uuid
      );

      expect(likeRepository.findPostsLikeCount).toHaveBeenCalledWith(
        existingPost.id
      );
    });

    test("should throw an error if no args provided", async () => {
      postRepository.findPostsByPostId = vi.fn();
      likeRepository.findPostsLikeCount = vi.fn();

      await expect(
        likeService.getPostLikesCountByUuid(undefined)
      ).rejects.toThrow(error.noArgsMsg);

      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(likeRepository.findPostsLikeCount).not.toHaveBeenCalled();
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(undefined);
      likeRepository.findPostsLikeCount = vi.fn();

      await expect(
        likeService.getPostLikesCountByUuid(nonExistingPost.uuid)
      ).rejects.toThrow(error.postNotFoundMsg);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        nonExistingPost.uuid
      );
      expect(likeRepository.findPostsLikeCount).not.toHaveBeenCalled();
    });
  });

  describe("getUserLikeStatusForPostByUuid (check if the user liked the post)", async () => {
    test("should return the correct result", async () => {
      const like = GenerateMockData.createLike(
        existingPost.user_id,
        existingPost.id
      );

      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);

      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(existingPost);

      likeRepository.isUserLikePost = vi.fn().mockResolvedValue(like);

      const result = await likeService.getUserLikeStatusForPostByUuid(
        existingUser.uuid,
        existingPost.uuid
      );

      expect(result).toBe(like);

      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        existingPost.uuid
      );

      expect(likeRepository.isUserLikePost).toHaveBeenCalledWith(
        existingUser.id,
        existingPost.id
      );
    });

    test("should throw an error if no args provided", async () => {
      userRepository.findUserById = vi.fn();
      postRepository.findPostsByPostId = vi.fn();
      likeRepository.isUserLikePost = vi.fn();

      await expect(
        likeService.getUserLikeStatusForPostByUuid(undefined, undefined)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(likeRepository.isUserLikePost).not.toHaveBeenCalled();
    });

    test("should throw an error if user not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(undefined);
      postRepository.findPostsByPostId = vi.fn();
      likeRepository.isUserLikePost = vi.fn();

      await expect(
        likeService.getUserLikeStatusForPostByUuid(
          notFoundUser.uuid,
          existingPost.uuid
        )
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.uuid);
      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(likeRepository.isUserLikePost).not.toHaveBeenCalled();
    });

    test("should throw an error if post not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(undefined);
      likeRepository.isUserLikePost = vi.fn();

      await expect(
        likeService.getUserLikeStatusForPostByUuid(
          existingUser.uuid,
          nonExistingPost.uuid
        )
      ).rejects.toThrow(error.postNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        nonExistingPost.uuid
      );

      expect(likeRepository.isUserLikePost).not.toHaveBeenCalled();
    });
  });

  describe("toggleUserLikeForPost (toggle the user's like for the post)", async () => {
    test("should return the 'like added successfully' message", async () => {
      const expectedMsg = "Like added successfully";

      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);

      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(existingPost);

      likeRepository.isUserLikePost = vi.fn().mockResolvedValue(undefined);

      likeRepository.likeUsersPostById = vi.fn();

      likeRepository.dislikeUsersPostById = vi.fn();

      const result = await likeService.toggleUserLikeForPost(
        existingUser.uuid,
        existingPost.uuid
      );

      expect(result).toBe(expectedMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        existingPost.uuid
      );

      expect(likeRepository.isUserLikePost).toHaveBeenCalledWith(
        existingUser.id,
        existingPost.id
      );

      expect(likeRepository.dislikeUsersPostById).not.toHaveBeenCalled();
    });

    test("should return the 'like removed successfully' message", async () => {
      const expectedMsg = "Like removed successfully";

      const like = GenerateMockData.createLike(
        existingPost.user_id,
        existingPost.id
      );

      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);

      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(existingPost);

      likeRepository.isUserLikePost = vi.fn().mockResolvedValue(like);

      likeRepository.likeUsersPostById = vi.fn();

      likeRepository.dislikeUsersPostById = vi.fn();

      const result = await likeService.toggleUserLikeForPost(
        existingUser.uuid,
        existingPost.uuid
      );

      expect(result).toBe(expectedMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        existingPost.uuid
      );

      expect(likeRepository.isUserLikePost).toHaveBeenCalledWith(
        existingUser.id,
        existingPost.id
      );

      expect(likeRepository.dislikeUsersPostById).toHaveBeenCalledWith(like.id);
      expect(likeRepository.likeUsersPostById).not.toHaveBeenCalled();
    });

    test("should throw an error if no args provided", async () => {
      userRepository.findUserById = vi.fn();
      postRepository.findPostsByPostId = vi.fn();
      likeRepository.isUserLikePost = vi.fn();
      likeRepository.likeUsersPostById = vi.fn();
      likeRepository.dislikeUsersPostById = vi.fn();

      await expect(
        likeService.toggleUserLikeForPost(undefined, undefined)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(likeRepository.isUserLikePost).not.toHaveBeenCalled();
      expect(likeRepository.likeUsersPostById).not.toHaveBeenCalled();
      expect(likeRepository.dislikeUsersPostById).not.toHaveBeenCalled();
    });

    test("should throw an error if user not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(undefined);
      postRepository.findPostsByPostId = vi.fn();
      likeRepository.isUserLikePost = vi.fn();
      likeRepository.likeUsersPostById = vi.fn();
      likeRepository.dislikeUsersPostById = vi.fn();

      await expect(
        likeService.toggleUserLikeForPost(notFoundUser.uuid, existingPost.uuid)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.uuid);

      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(likeRepository.isUserLikePost).not.toHaveBeenCalled();
      expect(likeRepository.likeUsersPostById).not.toHaveBeenCalled();
      expect(likeRepository.dislikeUsersPostById).not.toHaveBeenCalled();
    });
  });
});

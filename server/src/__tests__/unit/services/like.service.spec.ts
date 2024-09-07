import "reflect-metadata";
import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
}                          from "vitest";
import UserDto             from "@/domain/dto/user.dto";
import PostDto             from "@/domain/dto/post.dto";
import LikeService         from "@/application/services/like/like.service.impl";
import IELikeService       from "@/application/services/like/like.service";
import LikeRepository      from "@/infrastructure/repositories/like.repository.impl";
import UserRepository      from "@/infrastructure/repositories/user.repository.impl";
import PostRepository      from "@/infrastructure/repositories/post.repository.impl";
import IEPostRepository    from "@/domain/repositories/post.repository";
import IEUserRepository    from "@/domain/repositories/user.repository";
import IELikeRepository    from "@/domain/repositories/like.repository";
import GenerateMockData    from "@/__tests__/utils/generate-data.util";
import ApiErrorException   from "@/application/exceptions/api.exception";
import CloudinaryService   from "@/application/libs/cloudinary-service.lib";
import { plainToInstance } from "class-transformer";

vi.mock("@/repositories/feed/feed.repository.impl");

vi.mock("@/repositories/user/post.repository.impl");

vi.mock("@/repositories/user/user.repository.impl");

vi.mock("@/utils/cloudinary-service.util");

describe("LikeService", () => {
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
  const existingUserDto = plainToInstance(UserDto, existingUser);
  const notFoundUser = GenerateMockData.createUser();
  const notFoundUserDto = plainToInstance(UserDto, notFoundUser);

  const posts = GenerateMockData.generateMockData(
    false, users, GenerateMockData.createPost
  );
  const existingPost = posts[0]!;
  const existingPostDto = plainToInstance(PostDto, existingPost as Object);
  const nonExistingPost = GenerateMockData.createPost(1000);

  const nonExistingPostDto = plainToInstance(
    PostDto,
    nonExistingPost as Object
  );

  beforeEach(() => {
    cloudinary = new CloudinaryService();
    likeRepository = new LikeRepository();
    postRepository = new PostRepository(cloudinary);
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
      postRepository.findPostsByPostId = vi
        .fn()
        .mockResolvedValue(existingPostDto);

      likeRepository.findPostsLikeCount = vi.fn().mockResolvedValue(10);

      const result = await likeService.getPostLikesCountByUuid(
        existingPostDto.getUuid()
      );

      expect(result).toBe(10);
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        existingPostDto.getUuid()
      );

      expect(likeRepository.findPostsLikeCount).toHaveBeenCalledWith(
        existingPostDto.getId()
      );
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(undefined);
      likeRepository.findPostsLikeCount = vi.fn();

      await expect(
        likeService.getPostLikesCountByUuid(nonExistingPostDto.getUuid())
      ).rejects.toThrow(error.postNotFoundMsg);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        nonExistingPostDto.getUuid()
      );
      expect(likeRepository.findPostsLikeCount).not.toHaveBeenCalled();
    });
  });

  describe("getUserLikeStatusForPostByUuid (check if the user liked the post)", async () => {
    test("should return the correct result", async () => {
      const like = GenerateMockData.createLike(
        existingPostDto.getUuid(),
        existingPostDto.getUuid()
      );

      userRepository.findUserById = vi.fn().mockResolvedValue(existingUserDto);

      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(existingPostDto);

      likeRepository.isUserLikePost = vi.fn().mockResolvedValue(like);

      const result = await likeService.getUserLikeStatusForPostByUuid(
        existingUserDto.getUuid(),
        existingPostDto.getUuid()
      );

      expect(result).toBe(like);

      expect(userRepository.findUserById).toHaveBeenCalledWith(
        existingUserDto.getUuid()
  );

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        existingPostDto.getUuid()
      );

      expect(likeRepository.isUserLikePost).toHaveBeenCalledWith(
        existingUserDto.getUuid(),
        existingPostDto.getUuid()
      );
    });

    test("should throw an error if user not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(undefined);
      postRepository.findPostsByPostId = vi.fn();
      likeRepository.isUserLikePost = vi.fn();

      await expect(
        likeService.getUserLikeStatusForPostByUuid(
          notFoundUserDto.getUuid(),
          existingPostDto.getUuid()
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
          nonExistingPostDto.getUuid()
        )
      ).rejects.toThrow(error.postNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        nonExistingPostDto.getUuid()
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
        existingPostDto.getUuid()
      );

      expect(result).toBe(expectedMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        existingPostDto.getUuid()
      );

      expect(likeRepository.isUserLikePost).toHaveBeenCalledWith(
        existingUser.id,
        existingPostDto.getUuid()     );

      expect(likeRepository.dislikeUsersPostById).not.toHaveBeenCalled();
    });

    test("should return the 'like removed successfully' message", async () => {
      const expectedMsg = "Like removed successfully";

      const like = GenerateMockData.createLike(
        existingPostDto.getUuid(),
        existingPostDto.getUuid()     );

      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);

      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(existingPost);

      likeRepository.isUserLikePost = vi.fn().mockResolvedValue(like);

      likeRepository.likeUsersPostById = vi.fn();

      likeRepository.dislikeUsersPostById = vi.fn();

      const result = await likeService.toggleUserLikeForPost(
        existingUser.uuid,
        existingPostDto.getUuid()
      );

      expect(result).toBe(expectedMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        existingPostDto.getUuid()
      );

      expect(likeRepository.isUserLikePost).toHaveBeenCalledWith(
        existingUser.id,
        existingPostDto.getUuid()     );

      expect(likeRepository.dislikeUsersPostById).toHaveBeenCalledWith(like.id);
      expect(likeRepository.likeUsersPostById).not.toHaveBeenCalled();
    });

    test("should throw an error if user not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(undefined);
      postRepository.findPostsByPostId = vi.fn();
      likeRepository.isUserLikePost = vi.fn();
      likeRepository.likeUsersPostById = vi.fn();
      likeRepository.dislikeUsersPostById = vi.fn();

      await expect(
        likeService.toggleUserLikeForPost(notFoundUser.uuid, existingPostDto.getUuid())
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.uuid);

      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(likeRepository.isUserLikePost).not.toHaveBeenCalled();
      expect(likeRepository.likeUsersPostById).not.toHaveBeenCalled();
      expect(likeRepository.dislikeUsersPostById).not.toHaveBeenCalled();
    });
  });
});

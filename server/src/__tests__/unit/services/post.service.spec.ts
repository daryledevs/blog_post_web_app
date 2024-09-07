import "reflect-metadata";
import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
}                          from "vitest";
import PostDto             from "@/domain/dto/post.dto";
import UserDto             from "@/domain/dto/user.dto";
import { join }            from "path";
import { faker }           from "@faker-js/faker";
import { Readable }        from "stream";
import PostService         from "@/application/services/post/post.service.impl";
import IEPostService       from "@/application/services/post/post.service";
import UserRepository      from "@/infrastructure/repositories/user.repository.impl";
import PostRepository      from "@/infrastructure/repositories/post.repository.impl";
import IEPostRepository    from "@/domain/repositories/post.repository";
import IEUserRepository    from "@/domain/repositories/user.repository";
import GenerateMockData    from "@/__tests__/utils/generate-data.util";
import ApiErrorException   from "@/application/exceptions/api.exception";
import CloudinaryService   from "@/application/libs/cloudinary-service.lib";
import { plainToInstance } from "class-transformer";

vi.mock("@/repositories/feed/feed.repository.impl");

vi.mock("@/repositories/user/user.repository.impl");

vi.mock("@/utils/cloudinary-service.util");

describe("PostService", () => {
  let cloudinary:     CloudinaryService;
  let postRepository: IEPostRepository;
  let userRepository: IEUserRepository;
  let postService:    IEPostService;

  const error = {
    noArgsMsg: ApiErrorException.HTTP400Error("No arguments provided"),
    userNotFoundMsg: ApiErrorException.HTTP400Error("User not found"),
    postNotFoundMsg: ApiErrorException.HTTP400Error("Post not found"),
  };

  const users = GenerateMockData.createUserList(10);
  
  const existingUser = users[0]!;
  const existingUserDto = plainToInstance(UserDto, existingUser as Object, {
    excludeExtraneousValues: true,
  });

  const notFoundUser = GenerateMockData.createUser();
  const notFoundUserDto = plainToInstance(UserDto, notFoundUser as Object, {
    excludeExtraneousValues: true,
  });

  const posts = GenerateMockData.generateMockData(
    false, users, GenerateMockData.createPost
  );

  const postsDto = posts.map((post) =>
    plainToInstance(PostDto, post as Object, { excludeExtraneousValues: true })
  );

  const existingPost = posts[0]!;
  const existingPostDto = plainToInstance(PostDto, existingPost as Object, {
    excludeExtraneousValues: true,
  });

  const nonExistingPost = GenerateMockData.createPost(1000);
  const nonExistingPostDto = plainToInstance(
    PostDto,
    nonExistingPost as Object,
    {
      excludeExtraneousValues: true,
    }
  );

  beforeEach(() => {
    cloudinary = new CloudinaryService();
    postRepository = new PostRepository(cloudinary);
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

  describe("getPostByUuid (get post by id)", async () => {
    test("should return the correct result", async () => {
      postRepository.findPostsByPostId = vi
        .fn()
        .mockResolvedValue(existingPostDto);

      const result = await postService.getPostByUuid(existingPostDto.getUuid());

      expect(result).toEqual(existingPostDto);
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        existingPostDto.getUuid()
      );
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(null);

      await expect(
        postService.getPostByUuid(nonExistingPostDto.getUuid())
      ).rejects.toThrow(error.postNotFoundMsg);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        nonExistingPostDto.getUuid()
      );
    });
  });

  describe("getAllPostsByUsersUuid", async () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);
      postRepository.findAllPostsByUserId = vi.fn().mockResolvedValue(posts);

      const result = await postService.getAllPostsByUsersUuid(
        existingUserDto.getUuid()
      );

      expect(result).toEqual(postsDto);
      expect(userRepository.findUserById).toHaveBeenCalledWith(
        existingUserDto.getUuid()
      );
      expect(postRepository.findAllPostsByUserId).toHaveBeenCalledWith(
        existingUserDto.getId()
      );
    });

    test("should throw an error if user not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(null);

      await expect(
        postService.getAllPostsByUsersUuid(notFoundUserDto.getUuid())
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(
        notFoundUserDto.getUuid()
      );
    });
  });

  describe("geTotalPostsByUsersUuid (get the total post available for feed)", async () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(existingUserDto);
      postRepository.findUserTotalPostsByUserId = vi.fn().mockResolvedValue(posts.length);

      const result = await postService.geTotalPostsByUsersUuid(existingUserDto.getUuid());

      expect(result).toEqual(posts.length);
      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUserDto.getUuid());
      expect(postRepository.findUserTotalPostsByUserId).toHaveBeenCalledWith(existingUserDto.getId());
    });

    test("should throw an error if user not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(undefined);
      postRepository.findUserTotalPostsByUserId = vi.fn();

      await expect(
        postService.geTotalPostsByUsersUuid(notFoundUserDto.getUuid()))
      .rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(notFoundUserDto.getUuid());
      expect(postRepository.findUserTotalPostsByUserId).not.toHaveBeenCalled();
    });
  });

  describe("createNewPost (create new post from the user)", async () => {
    test("should return the correct result", async () => {
      const { image_url, image_id, ...rest } = existingPost;
      
      const buffer = Buffer.alloc(1024 * 1024 * 10, ".");

      const file = {
        buffer,
        mimetype: "image/jpeg",
        originalname: faker.system.fileName(),
        size: buffer.length,
        filename: faker.system.fileName(),
        destination: faker.system.directoryPath(),
        fieldname: "",
        encoding: "",
        stream: new Readable(),
        path: faker.system.filePath(),
        image_id,
        user_id: rest.user_id,
      };

      const post = { ...rest, files: file}
      const existingPostDto = plainToInstance(PostDto, post as Object, {
        excludeExtraneousValues: true,
      });

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUserDto);

      postRepository.createNewPost = vi
        .fn()
        .mockResolvedValue(existingPostDto);

      cloudinary.uploadAndDeleteLocal = vi
        .fn()
        .mockResolvedValue({ image_url, image_id });
      
      const result = await postService.createNewPost(existingPostDto);

      expect(result).toBe("Post created successfully");
      expect(userRepository.findUserById).toHaveBeenCalledWith(existingPostDto.getUserUuid());
      
      expect(cloudinary.uploadAndDeleteLocal).toHaveBeenCalledWith(
        join(file.destination, file.filename)
      );

      expect(postRepository.createNewPost).toHaveBeenCalledWith(
        existingPostDto
      );
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
        fieldname: "",
        encoding: "",
        stream: new Readable(),
        path: faker.system.filePath(),
        image_id,
        user_id: rest.user_id,
      };

      const post = { ...rest, files: file };
      const existingPostDto = plainToInstance(PostDto, post as Object);

      userRepository.findUserById = vi.fn().mockResolvedValue(undefined);
      postRepository.createNewPost = vi.fn();
      cloudinary.uploadAndDeleteLocal = vi.fn();

      await expect(
        postService.createNewPost(existingPostDto))
      .rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(existingPostDto.getUserUuid());
      expect(postRepository.createNewPost).not.toHaveBeenCalled();
      expect(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
    });
  });

  describe("updatePostByUuid (edit the user's post)", () => {
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
        fieldname: "",
        encoding: "",
        stream: new Readable(),
        path: faker.system.filePath(),
        image_id,
        user_id: rest.user_id,
      };

      const post = { ...rest, files: file };
      const existingPostDto = plainToInstance(PostDto, post as Object);
      
      postRepository.findPostsByPostId = vi
        .fn()
        .mockResolvedValue(existingPostDto);

      postRepository.editPostByPostId = vi.fn()

      const result = await postService.updatePostByUuid(existingPostDto);

      expect(result).toBe("Post edited successfully");
      
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        existingPostDto.getUuid()
      );

      expect(postRepository.editPostByPostId).toHaveBeenCalledWith(
        existingPostDto.getUuid(),
        rest
      );
    });

    test("should throw an error if post not found", async () => {
      const { image_url, image_id, ...rest } = nonExistingPost;

       const buffer = Buffer.alloc(1024 * 1024 * 10, ".");

      const file = {
        buffer,
        mimetype: "image/jpeg",
        originalname: faker.system.fileName(),
        size: buffer.length,
        filename: faker.system.fileName(),
        destination: faker.system.directoryPath(),
        fieldname: "",
        encoding: "",
        stream: new Readable(),
        path: faker.system.filePath(),
        image_id,
        user_id: rest.user_id,
      };

      const post = { ...rest, files: file };
      const existingPostDto = plainToInstance(PostDto, post as Object);
      
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(undefined);
      postRepository.editPostByPostId = vi.fn();


      await expect(
        postService.updatePostByUuid(existingPostDto)
      ).rejects.toThrow(error.postNotFoundMsg);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        rest.uuid
      );
      expect(postRepository.editPostByPostId).not.toHaveBeenCalled();
    });
  });

  describe("deletePostByUuid (delete the user's post)", async () => {
    test("should return the correct result", async () => {
      postRepository.findPostsByPostId = vi
        .fn()
        .mockResolvedValue(existingPostDto);

      postRepository.deletePostById = vi.fn()

      const result = await postService.deletePostByUuid(existingPostDto.getUuid());

      expect(result).toBe("Post deleted successfully");

      expect(
        postRepository.findPostsByPostId
      ).toHaveBeenCalledWith(existingPostDto.getUuid());
      
      expect(
        postRepository.deletePostById
      ).toHaveBeenCalledWith(existingPostDto.getId());
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(undefined);
      postRepository.deletePostById = vi.fn();

      await expect(
        postService.deletePostByUuid(nonExistingPostDto.getUuid())
      ).rejects.toThrow(error.postNotFoundMsg);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        nonExistingPostDto.getUuid()
      );
      expect(postRepository.deletePostById).not.toHaveBeenCalled();
    });
  });
});

import {
  NewPosts,
  SelectLikes,
  SelectPosts,
  UpdatePosts,
}                           from "@/types/table.types";
import { join }             from "path";
import AsyncWrapper         from "@/utils/async-wrapper.util";
import IPostService         from "./post.service";
import PostRepository       from "@/repositories/post/post.repository.impl";
import UserRepository       from "@/repositories/user/user.repository.impl";
import ApiErrorException    from "@/exceptions/api.exception";
import CloudinaryService from "@/utils/cloudinary-service.util";

class PostService implements IPostService {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private cloudinary: CloudinaryService;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(postRepository: PostRepository, userRepository: UserRepository, cloudinary: CloudinaryService) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.cloudinary     = cloudinary;
  }

  public findPostsByPostId = this.wrap.serviceWrap(
    async (post_id: number): Promise<SelectPosts | undefined> => {
      // Check if the post_id is provided
      if (!post_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the post is not found, return an error
      const data = await this.postRepository.findPostsByPostId(post_id);
      if (!data) throw ApiErrorException.HTTP404Error("Post not found");

      // Return the post
      return data;
    }
  );

  public getUserPosts = this.wrap.serviceWrap(
    async (user_id: number): Promise<SelectPosts[]> => {
      // Check if the user_id is provided
      if (!user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const isUserExist = await this.userRepository.findUserById(user_id);
      if (!isUserExist) throw ApiErrorException.HTTP404Error("User not found");

      // Get the posts for the user
      return await this.postRepository.getUserPosts(user_id as any);
    }
  );

  public getUserTotalPosts = this.wrap.serviceWrap(
    async (user_id: number): Promise<string | number | bigint> => {
      // Check if the user_id is provided
      if (!user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const isUserExist = await this.userRepository.findUserById(user_id);
      if (!isUserExist) throw ApiErrorException.HTTP404Error("User not found");

      // Get the total posts for the user
      return await this.postRepository.getUserTotalPosts(user_id);
    }
  );

  public newPost = this.wrap.serviceWrap(
    async (
      file: Express.Multer.File | null | undefined,
      post: NewPosts
    ): Promise<string> => {
      // Check if the image is uploaded
      if (!file) throw ApiErrorException.HTTP400Error("No image uploaded");
      if (!post.user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const isUserExist = await this.userRepository.findUserById(post.user_id);
      if (!isUserExist) throw ApiErrorException.HTTP404Error("User not found");

      const path = join(file.destination, file.filename);
      const { image_id, image_url } = await this.cloudinary.uploadAndDeleteLocal(path);

      // Create a new post
      await this.postRepository.newPost({
        ...post,
        image_id,
        image_url,
      });

      return "Post created successfully";
    }
  );

  public editPost = this.wrap.serviceWrap(
    async (post_id: number, post: UpdatePosts): Promise<string | undefined> => {
      // Check if the arguments is provided
      if (!post_id) throw ApiErrorException.HTTP400Error("No arguments provided");
      if (post.image_url) throw ApiErrorException
        .HTTP400Error("Image url is not allowed to be changed");

      // If the post is not found, return an error
      const data = await this.postRepository.findPostsByPostId(post_id);
      if (!data) throw ApiErrorException.HTTP404Error("Post not found");

      // Edit the post
      return this.postRepository.editPost(post_id, post);
    }
  );

  public deletePost = this.wrap.serviceWrap(
    async (post_id: number): Promise<string> => {
      // check if the arguments is provided
      if (!post_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the post is not found, return an error
      const data = await this.postRepository.findPostsByPostId(post_id);
      if (!data) throw ApiErrorException.HTTP404Error("Post not found");

      // Delete the post
      return await this.postRepository.deletePost(post_id);
    }
  );

  public getLikesCountForPost = this.wrap.serviceWrap(
    async (post_id: number): Promise<number> => {
      // check if the arguments is provided
      if (!post_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // Check if the post_id is provided
      const data = await this.postRepository.findPostsByPostId(post_id);
      if (!data) throw ApiErrorException.HTTP404Error("Post not found");

      // Get the total likes for the post
      return await this.postRepository.getLikesCountForPost(post_id);
    }
  );

  public checkUserLikeStatusForPost = this.wrap.serviceWrap(
    async (like: SelectLikes): Promise<SelectLikes | undefined> => {
      // check if the arguments is provided
      if (like.post_id || like.user_id)
        throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const isUserExist = await this.userRepository.findUserById(like.user_id);
      if (!isUserExist) throw ApiErrorException.HTTP404Error("User not found");

      // If the post is not found, return an error
      const isPostExist = await this.postRepository.findPostsByPostId(like.post_id);
      if (!isPostExist) throw ApiErrorException.HTTP404Error("Post not found");

      // If the post is not found, return an error
      return await this.postRepository.isUserLikePost(like);
    }
  );

  public toggleUserLikeForPost = this.wrap.serviceWrap(
    async (like: SelectLikes): Promise<string> => {
      // check if the arguments is provided
      if (like.post_id || like.user_id)
        throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the post is not found, return an error
      await this.postRepository.findPostsByPostId(like.post_id);

      // Check to see if the user already likes the post.
      const data = await this.postRepository.isUserLikePost(like);

      // If the user hasn't liked the post yet, then create or insert.
      if (!data) return await this.postRepository.toggleUserLikeForPost(like);

      // If the user has already liked the post, then delete or remove.
      return await this.postRepository.removeUserLikeForPost(like);
    }
  );
};

export default PostService;
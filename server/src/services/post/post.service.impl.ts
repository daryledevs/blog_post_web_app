import {
  NewPosts,
  SelectLikes,
  SelectPosts,
  UpdatePosts,
}                           from "@/types/table.types";
import { join }             from "path";
import IPostService         from "./post.service";
import ErrorException       from "@/exceptions/error.exception";
import PostRepository       from "@/repositories/post/post.repository.impl";
import UserRepository       from "@/repositories/user/user.repository.impl";
import uploadAndDeleteLocal from "@/config/cloudinary.config";

class PostService implements IPostService {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  };

  public async findPostsByPostId(post_id: number): Promise<SelectPosts | undefined> {
    try {
      // Check if the post_id is provided
      if(!post_id) throw ErrorException.badRequest("No arguments provided");

      // Check if the post exists
      const data = await this.postRepository.findPostsByPostId(post_id);

      // If the post doesn't exist, throw an error
      if(!data) throw ErrorException.notFound("Post not found");

      // Return the post
      return data;
    } catch (error) {
      throw error;
    };
  };

  public async getUserPosts(user_id: number): Promise<SelectPosts[]> {
    try {
      // Check if the user_id is provided
      if(!user_id) throw ErrorException.badRequest("No arguments provided");

      // Check if the user exists
      const isUserExist = await this.userRepository.findUserById(user_id);

      // If the user doesn't exist, throw an error
      if(!isUserExist) throw ErrorException.notFound("User not found");
      
      // Get the posts for the user
      return await this.postRepository.getUserPosts(user_id as any);
    } catch (error) {
      throw error;
    };
  };

  public async getUserTotalPosts(user_id: number): Promise<string | number | bigint> {
    try {
      // Check if the user_id is provided
      if(!user_id) throw ErrorException.badRequest("No arguments provided");

      // Check if the user exists
      const isUserExist = await this.userRepository.findUserById(user_id);

      // If the user doesn't exist, throw an error
      if(!isUserExist) throw ErrorException.notFound("User not found");

      // Get the total posts for the user
      return await this.postRepository.getUserTotalPosts(user_id);
    } catch (error) {
      throw error;
    };
  };

  public async newPost(file: Express.Multer.File | null | undefined, post: NewPosts): Promise<string> {
    try {
      // Check if the image is uploaded
      if(!file) throw ErrorException.badRequest("No image uploaded");
      if(!post.user_id) throw ErrorException.badRequest("No arguments provided");

      // Check if the user exists
      const isUserExist = await this.userRepository.findUserById(post.user_id);
      if(!isUserExist) throw ErrorException.notFound("User not found");

      const path = join(file.destination, file.filename);
      const { image_id, image_url } = await uploadAndDeleteLocal(path);

      // Create a new post
      return await this.postRepository.newPost({ ...post, image_id, image_url });
    } catch (error) {
      throw error;
    };
  };

  public async editPost(post_id: number, post: UpdatePosts): Promise<string | undefined> {
    try {
      // Check if the image_url is provided
      if(post.image_url) throw ErrorException.badRequest("Image url is not allowed to be changed");

      // Check if the post_id is provided
      if(!post_id) throw ErrorException.badRequest("No arguments provided");

      // Check if the post exists
      const data = await this.postRepository.findPostsByPostId(post_id);

      // If the post doesn't exist, throw an error
      if(!data) throw ErrorException.notFound("Post not found");

      // Edit the post
      return this.postRepository.editPost(post_id, post);
    } catch (error) {
      throw error;
    };
  };

  public async deletePost(post_id: number): Promise<string> {
    try {
      // Check if the post_id is provided
      if(!post_id) throw ErrorException.badRequest("No arguments provided");

      // Check if the post exists
      const data = await this.postRepository.findPostsByPostId(post_id);

      // If the post doesn't exist, throw an error
      if(!data) throw ErrorException.notFound("Post not found");
      
      // Delete the post
      return await this.postRepository.deletePost(post_id);
    } catch (error) {
      throw error;
    };
  };

  public async getLikesCountForPost(post_id: number): Promise<number> {
    try {
      // Check if the post_id is provided
      const data = await this.postRepository.findPostsByPostId(post_id);

      // If the post doesn't exist, throw an error
      if(!data) throw ErrorException.notFound("Post not found");

      // Get the total likes for the post
      return await this.postRepository.getLikesCountForPost(post_id);
    } catch (error) {
      throw error;
    };
  };

  public async checkUserLikeStatusForPost(like: SelectLikes): Promise<SelectLikes | undefined> {
    try {
      // Check if the post_id and user_id is provided
      if(like.post_id || like.user_id) {
        throw ErrorException.badRequest("No arguments provided");
      };

      // Check if the user exists
      const isUserExist = await this.userRepository.findUserById(like.user_id);
      if(!isUserExist) throw ErrorException.notFound("User not found");

      // Check if the post exists
      const isPostExist = await this.postRepository.findPostsByPostId(like.post_id);
      if(!isPostExist) throw ErrorException.notFound("Post not found");
      
      // Check if the post exists
      return await this.postRepository.isUserLikePost(like);
    } catch (error) {
      throw error;
    };
  };

  public async toggleUserLikeForPost(like: SelectLikes): Promise<string> {
    try {
      if(like.post_id || like.user_id) throw ErrorException.badRequest("No arguments provided");
      // check if the post exists
      await this.postRepository.findPostsByPostId(like.post_id);

      // Check to see if the user already likes the post.
      const data = await this.postRepository.isUserLikePost(like);

      // If the user hasn't liked the post yet, then create or insert.
      if(!data) return await this.postRepository.toggleUserLikeForPost(like);

      // If the user has already liked the post, then delete or remove.
      return await this.postRepository.removeUserLikeForPost(like);
    } catch (error) {
      throw error;
    };
  };
};

export default PostService;
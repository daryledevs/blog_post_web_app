import {
  NewPosts,
  SelectLikes,
  SelectPosts,
  UpdatePosts,
}                           from "@/types/table.types";
import { join }             from "path";
import Exception            from "@/exception/exception";
import IPostService         from "./post.service";
import PostsRepository      from "@/repository/post.repository";
import UsersRepository      from "@/repository/user.repository";
import uploadAndDeleteLocal from "@/config/cloudinary";

class PostService implements IPostService {
  private postsRepository: PostsRepository;
  private usersRepository: UsersRepository;

  constructor() {
    this.postsRepository = new PostsRepository();
    this.usersRepository = new UsersRepository();
  };

  async findPostsByPostId(post_id: number): Promise<SelectPosts | undefined> {
    try {
      if(!post_id) throw Exception.badRequest("Missing post's id");
      const data = await this.postsRepository.findPostsByPostId(post_id);
      if(!data) throw Exception.notFound("Post doesn't exist");
      return data;
    } catch (error) {
      throw error;
    };
  };

  async getUserPosts(user_id: number): Promise<SelectPosts[]> {
    try {
      if(!user_id) throw Exception.badRequest("Missing user's id");
      const isUserExist = await this.usersRepository.findUserById(user_id);
      if(!isUserExist) throw Exception.notFound("User doesn't exist");
      return await this.postsRepository.getUserPosts(user_id as any);
    } catch (error) {
      throw error;
    };
  };

  async getUserTotalPosts(user_id: number): Promise<string | number | bigint> {
    try {
      if(!user_id) throw Exception.badRequest("Missing user's id");
      const isUserExist = await this.usersRepository.findUserById(user_id);
      if(!isUserExist) throw Exception.notFound("User doesn't exist");
      return await this.postsRepository.getUserTotalPosts(user_id);
    } catch (error) {
      throw error;
    };
  };

  async newPost(file: Express.Multer.File, post: NewPosts): Promise<string> {
    try {
      if(!file) throw Exception.badRequest("No image uploaded");
      if(!post.user_id) throw Exception.badRequest("Missing user's id");

      const isUserExist = await this.usersRepository.findUserById(post.user_id);
      if(!isUserExist) throw Exception.notFound("User doesn't exist");

      const path = join(file.destination, file.filename);
      const { image_id, image_url } = await uploadAndDeleteLocal(path);

      return await this.postsRepository.newPost({ ...post, image_id, image_url });
    } catch (error) {
      throw error;
    };
  };

  async editPost(post_id: number, post: UpdatePosts): Promise<string | undefined> {
    try {
      if(post.image_url) throw Exception.badRequest("Image url is not allowed to be changed");
      if(!post_id) throw Exception.badRequest("Missing post's id");
      const data = await this.postsRepository.findPostsByPostId(post_id);
      if(!data) throw Exception.notFound("Post not found");
      return this.postsRepository.editPost(post_id, post);
    } catch (error) {
      throw error;
    };
  };

  async deletePost(post_id: number): Promise<string> {
    try {
      if(!post_id) throw Exception.badRequest("Missing post's id");
      const data = await this.postsRepository.findPostsByPostId(post_id);
      if(!data) throw Exception.notFound("Post not found");
      return await this.postsRepository.deletePost(post_id);
    } catch (error) {
      throw error;
    };
  };

  async getLikesCountForPost(post_id: number): Promise<number> {
    try {
      const data = await this.postsRepository.findPostsByPostId(post_id);
      if(!data) throw Exception.notFound("Post not found");
      return await this.postsRepository.getLikesCountForPost(post_id);
    } catch (error) {
      throw error;
    };
  };

  async checkUserLikeStatusForPost(like: SelectLikes): Promise<SelectLikes | undefined> {
    try {
      if(like.post_id || like.user_id) throw Exception.badRequest("Missing required fields");
      return await this.postsRepository.isUserLikePost(like);
    } catch (error) {
      throw error;
    };
  };

  async toggleUserLikeForPost(like: SelectLikes): Promise<string> {
    try {
      if(like.post_id || like.user_id) throw Exception.badRequest("Missing required fields");
      // check if the post exists
      await this.postsRepository.findPostsByPostId(like.post_id);

      // Check to see if the user already likes the post.
      const data = await this.postsRepository.isUserLikePost(like);

      // If the user hasn't liked the post yet, then create or insert.
      if(!data) return await this.postsRepository.toggleUserLikeForPost(like);

      // If the user has already liked the post, then delete or remove.
      return await this.postsRepository.removeUserLikeForPost(like);
    } catch (error) {
      throw error;
    };
  };
};

export default PostService;
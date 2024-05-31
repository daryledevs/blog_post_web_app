import {
  NewLikes,
  NewPosts,
  SelectLikes,
  SelectPosts,
  UpdatePosts,
}                        from "@/types/table.types";
import { join }          from "path";
import AsyncWrapper      from "@/utils/async-wrapper.util";
import IEPostService     from "./post.service";
import IEPostRepository  from "@/repositories/post/post.repository";
import IEUserRepository  from "@/repositories/user/user.repository";
import ApiErrorException from "@/exceptions/api.exception";
import CloudinaryService from "@/libraries/cloudinary/cloudinary-service.lib";

class PostService implements IEPostService {
  private postRepository: IEPostRepository;
  private userRepository: IEUserRepository;
  private cloudinary: CloudinaryService;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(
    postRepository: IEPostRepository,
    userRepository: IEUserRepository,
    cloudinary: CloudinaryService
  ) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.cloudinary = cloudinary;
  }

  public getPostByUuid = this.wrap.serviceWrap(
    async (uuid: string | undefined): Promise<SelectPosts | undefined> => {
      // check if the post_id is provided
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // if the post is not found, return an error
      const post = await this.postRepository.findPostsByPostId(uuid);
      if (!post) throw ApiErrorException.HTTP404Error("Post not found");

      // return the post
      return post;
    }
  );

  public getAllPostsByUsersUuid = this.wrap.serviceWrap(
    async (user_uuid: string): Promise<SelectPosts[]> => {
      // check if the user_uuid is provided
      if (!user_uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // if the user is not found, return an error
      const user = await this.userRepository.findUserById(user_uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      // get the posts for the user
      return await this.postRepository.findAllPostsByUserId(user.id);
    }
  );

  public geTotalPostsByUsersUuid = this.wrap.serviceWrap(
    async (user_uuid: string): Promise<string | number | bigint> => {
      // check if the user_uuid is provided
      if (!user_uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // if the user is not found, return an error
      const user = await this.userRepository.findUserById(user_uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      // get the total posts for the user
      return await this.postRepository.findUserTotalPostsByUserId(user.id);
    }
  );

  public createNewPost = this.wrap.serviceWrap(
    async (
      post: NewPosts,
      file: Express.Multer.File | null | undefined
    ): Promise<string> => {
      // check if the image is uploaded
      if (!file) throw ApiErrorException.HTTP400Error("No image uploaded");
      if (!post?.user_id) throw ApiErrorException.HTTP400Error("No arguments provided");
      const user_uuid = post.user_id as unknown as string;

      // if the user is not found, return an error
      const user = await this.userRepository.findUserById(user_uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      const path = join(file.destination, file.filename);
      
      const { image_id, image_url } =
        await this.cloudinary.uploadAndDeleteLocal(path);

      // create a new post
      await this.postRepository.createNewPost({
        ...post,
        user_id: user.id,
        image_id,
        image_url,
      });

      return "Post created successfully";
    }
  );

  public updatePostByUuid = this.wrap.serviceWrap(
    async (uuid: string, post: UpdatePosts): Promise<string | undefined> => {
      // check if the arguments is provided
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");
      if (post.image_url) {
        throw ApiErrorException.HTTP400Error(
          "Image url is not allowed to be changed"
        );
      }

      // if the post is not found, return an error
      const data = await this.postRepository.findPostsByPostId(uuid);
      if (!data) throw ApiErrorException.HTTP404Error("Post not found");

      // edit the post
      await this.postRepository.editPostByPostId(uuid, post);
      return "Post edited successfully";
    }
  );

  public deletePostByUuid = this.wrap.serviceWrap(
    async (uuid: string | undefined): Promise<string> => {
      // check if the arguments is provided
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // if the post is not found, return an error
      const post = await this.postRepository.findPostsByPostId(uuid);
      if (!post) throw ApiErrorException.HTTP404Error("Post not found");

      // delete the post
      await this.postRepository.deletePostById(post.id);

      return "";
    }
  );

  public getPostLikesCountByUuid = this.wrap.serviceWrap(
    async (uuid: string): Promise<number> => {
      // check if the arguments is provided
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // check if the post_id is provided
      const post = await this.postRepository.findPostsByPostId(uuid);
      if (!post) throw ApiErrorException.HTTP404Error("Post not found");

      // get the total likes for the post
      return await this.postRepository.findPostsLikeCount(post.id);
    }
  );

  public getUserLikeStatusForPostByUuid = this.wrap.serviceWrap(
    async (
      user_uuid: string | undefined,
      post_uuid: string | undefined
    ): Promise<SelectLikes | undefined> => {
      // check if the arguments is provided
      if (!user_uuid || !post_uuid) {
        throw ApiErrorException.HTTP400Error("No arguments provided");
      }

      // If the user is not found, return an error
      const user = await this.userRepository.findUserById(user_uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      // If the post is not found, return an error
      const post = await this.postRepository.findPostsByPostId(post_uuid);
      if (!post) throw ApiErrorException.HTTP404Error("Post not found");

      // If the post is not found, return an error
      return await this.postRepository.isUserLikePost(user.id, post.id);
    }
  );

  public toggleUserLikeForPost = this.wrap.serviceWrap(
    async (
      user_uuid: string | undefined,
      post_uuid: string | undefined
    ): Promise<string> => {
      // check if the arguments is provided
      if (!user_uuid || !post_uuid) {
        throw ApiErrorException.HTTP400Error("No arguments provided");
      }

      // If the user is not found, return an error
      const user = await this.userRepository.findUserById(user_uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      // If the post is not found, return an error
      const post = await this.postRepository.findPostsByPostId(post_uuid);
      if (!post) throw ApiErrorException.HTTP404Error("Post not found");

      // Check to see if the user already likes the post.
      const like = await this.postRepository.isUserLikePost(user.id, post.id);

      // If the user hasn't liked the post yet, then create or insert.
      if (!like) {
        const data = { user_id: user.id, post_id: post.id };
        await this.postRepository.likeUsersPostById(data);
        return "Like added successfully";
      }

      // If the user has already liked the post, then delete or remove.
      await this.postRepository.dislikeUsersPostById(like.id);
      return "Like removed successfully";
    }
  );
};

export default PostService;
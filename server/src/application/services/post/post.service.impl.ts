import {
  NewPosts,
  UpdatePosts,
}                          from "@/domain/types/table.types";
import PostDto             from "@/domain/dto/post.dto";
import { join }            from "path";
import AsyncWrapper        from "@/application/utils/async-wrapper.util";
import IEPostService       from "./post.service";
import IEPostRepository    from "@/domain/repositories/post.repository";
import IEUserRepository    from "@/domain/repositories/user.repository";
import ApiErrorException   from "@/application/exceptions/api.exception";
import CloudinaryService   from "@/application/libs/cloudinary-service.lib";
import { plainToInstance } from "class-transformer";

class PostService implements IEPostService {
  private postRepository: IEPostRepository;
  private userRepository: IEUserRepository;
  private cloudinary: CloudinaryService;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(
    postRepository: IEPostRepository,
    userRepository: IEUserRepository,
    cloudinary:     CloudinaryService
  ) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.cloudinary = cloudinary;
  }

  public getPostByUuid = this.wrap.serviceWrap(
    async (uuid: string | undefined): Promise<PostDto | undefined> => {
      // check if the post_id is provided
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // if the post is not found, return an error
      const post = await this.postRepository.findPostsByPostId(uuid);
      if (!post) throw ApiErrorException.HTTP404Error("Post not found");

      // return the post
      return plainToInstance(PostDto, post, { excludeExtraneousValues: true });
    }
  );

  public getAllPostsByUsersUuid = this.wrap.serviceWrap(
    async (user_uuid: string): Promise<PostDto[]> => {
      // check if the user_uuid is provided
      if (!user_uuid)
        throw ApiErrorException.HTTP400Error("No arguments provided");

      // if the user is not found, return an error
      const user = await this.userRepository.findUserById(user_uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      // get the posts for the user
      const posts = await this.postRepository.findAllPostsByUserId(
        user.getId()
      );

      return plainToInstance(PostDto, posts, { excludeExtraneousValues: true });
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
      return await this.postRepository.findUserTotalPostsByUserId(user.getId());
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

      const { image_id, image_url } = await this.cloudinary.uploadAndDeleteLocal(path);

      // create a new post
      await this.postRepository.createNewPost({
        ...post,
        user_id: user.getId(),
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
      await this.postRepository.deletePostById(post.getId());

      return "Post deleted successfully";
    }
  );
};

export default PostService;
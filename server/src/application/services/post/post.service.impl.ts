import Post                from "@/domain/models/post.model";
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
    async (postDto: PostDto): Promise<string> => {
      const files = postDto.getFiles();
      const user_uuid = postDto.getUserUuid();

      if (!files.length) {
        throw ApiErrorException.HTTP400Error("No image uploaded");
      }

      if (!user_uuid) {
        throw ApiErrorException.HTTP400Error("No arguments provided");
      }
      
      // if the user is not found, return an error
      const user = await this.userRepository.findUserById(user_uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      const file = files?.[0];
      const path = join(file?.destination ?? "", file?.filename ?? "");

      if (!path) throw ApiErrorException.HTTP400Error("Error on image uploaded");
      const { image_id, image_url } = await this.cloudinary.uploadAndDeleteLocal(path);

      postDto.setUserId(user.getId());
      postDto.setImageId(image_id);
      postDto.setImageUrl(image_url);

      const post = plainToInstance(Post, postDto);

      // create a new post. If an error occurs, delete the image from cloudinary
      try {
        await this.postRepository.createNewPost(post.save());
      } catch (error) {
        await this.cloudinary.deleteImage(image_id);
        throw error;
      }

      return "Post created successfully";
    }
  );

  public updatePostByUuid = this.wrap.serviceWrap(
    async (uuid: string, postDto: PostDto): Promise<string | undefined> => {
      // check if the arguments is provided
      if (!uuid) {
        throw ApiErrorException.HTTP400Error("No arguments provided");
      }

      if (postDto.getImageUrl()) {
        throw ApiErrorException.HTTP400Error(
          "Image url is not allowed to be changed"
        );
      }

      // if the post is not found, return an error
      const post = await this.postRepository.findPostsByPostId(uuid);
      if (!post) throw ApiErrorException.HTTP404Error("Post not found");

      const updatedPost = plainToInstance(Post, postDto);

      // edit the post
      await this.postRepository.editPostByPostId(uuid, updatedPost.save());
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
import Post                from "@/domain/models/post.model";
import PostDto             from "@/domain/dto/post.dto";
import { join }            from "path";
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

  constructor(
    postRepository: IEPostRepository,
    userRepository: IEUserRepository,
    cloudinary: CloudinaryService
  ) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.cloudinary = cloudinary;
  }

  public getPostByUuid = async (uuid: string): Promise<PostDto | undefined> => {
    // if the post is not found, return an error
    const post = await this.postRepository.findPostsByPostId(uuid);
    if (!post) throw ApiErrorException.HTTP404Error("Post not found");

    // return the post
    return plainToInstance(PostDto, post, { excludeExtraneousValues: true });
  };

  public getAllPostsByUsersUuid = async (
    user_uuid: string
  ): Promise<PostDto[]> => {
    // if the user is not found, return an error
    const user = await this.userRepository.findUserById(user_uuid);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    // get the posts for the user
    const posts = await this.postRepository.findAllPostsByUserId(user.getId());

    return plainToInstance(PostDto, posts, { excludeExtraneousValues: true });
  };

  public geTotalPostsByUsersUuid = async (
    user_uuid: string
  ): Promise<string | number | bigint> => {
    // if the user is not found, return an error
    const user = await this.userRepository.findUserById(user_uuid);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    // get the total posts for the user
    return await this.postRepository.findUserTotalPostsByUserId(user.getId());
  };

  public createNewPost = async (postDto: PostDto): Promise<string> => {
    const [file] = postDto.getFiles() ?? [];
    const user_uuid = postDto.getUserUuid();

    const destination = file?.destination ?? "";
    const filename = file?.filename ?? "";
    const path = join(destination, filename);

    if (!path || (path && path.replace(/\s+/g, "") === "")) {
      throw ApiErrorException.HTTP400Error("Error on image uploaded");
    }

    // if the user is not found, return an error
    const user = await this.userRepository.findUserById(user_uuid);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    const { image_id, image_url } = await this.cloudinary.uploadAndDeleteLocal(
      path
    );

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
  };

  public updatePostByUuid = async (
    postDto: PostDto
  ): Promise<string | undefined> => {
    // if the post is not found, return an error
    const post = await this.postRepository.findPostsByPostId(postDto.getUuid());
    if (!post) throw ApiErrorException.HTTP404Error("Post not found");

    const updatedPost = plainToInstance(Post, postDto);
    const data = updatedPost.save();

    Object.keys(data).forEach((key, index) => {
      if ((data as { [key: string]: any })[key] === undefined || null) {
        delete (data as { [key: string]: any })[key];
      }
    });

    // update the post
    await this.postRepository.editPostByPostId(updatedPost.getUuid(), data);
    return "Post edited successfully";
  };

  public deletePostByUuid = async (uuid: string): Promise<string> => {
    // if the post is not found, return an error
    const post = await this.postRepository.findPostsByPostId(uuid);
    if (!post) throw ApiErrorException.HTTP404Error("Post not found");

    // delete the post
    await this.postRepository.deletePostById(post.getId());

    return "Post deleted successfully";
  };
};

export default PostService;
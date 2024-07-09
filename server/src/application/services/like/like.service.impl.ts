import LikeDto             from "@/domain/dto/like.dto";
import AsyncWrapper        from "@/application/utils/async-wrapper.util";
import IELikeService       from "./like.service";
import IEUserRepository    from "@/domain/repositories/user.repository";
import IELikeRepository    from "@/domain/repositories/like.repository";
import IEPostRepository    from "@/domain/repositories/post.repository";
import ApiErrorException   from "@/application/exceptions/api.exception";
import { plainToInstance } from "class-transformer";

class LikeService implements IELikeService {
  private likeRepository: IELikeRepository;
  private postRepository: IEPostRepository;
  private userRepository: IEUserRepository;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(
    likeRepository: IELikeRepository,
    postRepository: IEPostRepository,
    userRepository: IEUserRepository
  ) {
    this.likeRepository = likeRepository;
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  public getPostLikesCountByUuid = this.wrap.serviceWrap(
    async (uuid: string): Promise<number> => {
      // check if the arguments is provided
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // check if the post_id is provided
      const post = await this.postRepository.findPostsByPostId(uuid);
      if (!post) throw ApiErrorException.HTTP404Error("Post not found");

      // get the total likes for the post
      return await this.likeRepository.findPostsLikeCount(post.getId());
    }
  );

  public getUserLikeStatusForPostByUuid = this.wrap.serviceWrap(
    async (
      user_uuid: string | undefined,
      post_uuid: string | undefined
    ): Promise<LikeDto | undefined> => {
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
      const likes = await this.likeRepository.isUserLikePost(
        user.getId(),
        post.getId()
      );

      return plainToInstance(LikeDto, likes, {
        excludeExtraneousValues: true,
      });
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
      const like = await this.likeRepository.isUserLikePost(user.getId(), post.getId());

      // If the user hasn't liked the post yet, then create or insert.
      if (!like) {
        const data = { user_id: user.getId(), post_id: post.getId() };
        await this.likeRepository.likeUsersPostById(data);
        return "Like added successfully";
      }

      // If the user has already liked the post, then delete or remove.
      await this.likeRepository.dislikeUsersPostById(like.getId());
      return "Like removed successfully";
    }
  );
}

export default LikeService;

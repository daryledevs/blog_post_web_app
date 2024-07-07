import Follower            from "@/model/follower.model";
import Following           from "@/model/following.model";
import FollowerDto         from "@/dto/follower.dto";
import FollowingDto        from "@/dto/following.dto";
import AsyncWrapper        from "@/utils/async-wrapper.util";
import IEUserRepository    from "@/repositories/user/user.repository";
import IEFollowService     from "./follow.service";
import ApiErrorException   from "@/exceptions/api.exception";
import IEFollowRepository  from "@/repositories/follow/follow.repository";
import { FollowStatsType } from "@/repositories/follow/follow.repository";
import { plainToInstance } from "class-transformer";

class FollowService implements IEFollowService {
  private userRepository: IEUserRepository;
  private followRepository: IEFollowRepository;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(
    userRepository: IEUserRepository,
    followRepository: IEFollowRepository
  ) {
    this.userRepository = userRepository;
    this.followRepository = followRepository;
  }

  public getFollowStats = this.wrap.serviceWrap(
    async (uuid: string): Promise<FollowStatsType> => {
      // If no arguments are provided, return an error
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const user = await this.userRepository.findUserById(uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      return await this.followRepository.findUserFollowStatsById(user.getId());
    }
  );

  public getFollowerFollowingLists = this.wrap.serviceWrap(
    async (
      uuid: string | undefined,
      fetch: string,
      listsId: number[]
    ): Promise<FollowerDto[] | FollowingDto[]> => {
      // If no arguments are provided, return an error
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const user = await this.userRepository.findUserById(uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      const listIdsToExclude = listsId?.length ? listsId : [0];

      switch (fetch) {
        case "followers":
          const followers = await this.getFollowers(user.getId(), listIdsToExclude);
          return plainToInstance(FollowerDto, followers);
        case "following":
          const following = await this.getFollowing(user.getId(), listIdsToExclude);
          return plainToInstance(FollowingDto, following);
        default:
          throw ApiErrorException.HTTP400Error("Invalid fetch parameter");
      }
    }
  );

  public toggleFollow = this.wrap.serviceWrap(
    async (follower_uuid: string, followed_uuid: string): Promise<string> => {
      // If no arguments are provided, return an error
      if (!follower_uuid || !followed_uuid) {
        throw ApiErrorException.HTTP400Error("No arguments provided");
      }

      // If the user is not found, return an error
      const user = await this.userRepository.findUserById(follower_uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      // If the user is not found, return an error
      const otherUser = await this.userRepository.findUserById(followed_uuid);
      if (!otherUser) throw ApiErrorException.HTTP404Error("User not found");

      const args = {
        follower_id: user.getId(),
        followed_id: otherUser.getId(),
      };

      // Check if the user is already following the other user
      const isExist = await this.followRepository.isUserFollowing(args);

      // If it already exists, delete the data from the database
      if (isExist) {
        await this.followRepository.unfollowUser(args);
        return "User unfollowed successfully";
      }

      // if there is no data in the database, create one
      await this.followRepository.followUser(args);
      return "User followed successfully";
    }
  );

  private getFollowers = this.wrap.serviceWrap(
    async (id: number, lists: number[]): Promise<Follower[]> => {
      return await this.followRepository.findAllFollowersById(id, lists);
    }
  );

  private getFollowing = this.wrap.serviceWrap(
    async (id: number, lists: number[]): Promise<Following[]> => {
      return await this.followRepository.findAllFollowingById(id, lists);
    }
  );
};

export default FollowService;
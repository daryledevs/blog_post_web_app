import AsyncWrapper        from "@/utils/async-wrapper.util";
import IEUserRepository    from "@/repositories/user/user.repository";
import IEFollowService     from "./follow.service";
import ApiErrorException   from "@/exceptions/api.exception";
import IEFollowRepository  from "@/repositories/follow/follow.repository";
import { SelectFollowers } from "@/types/table.types";
import { FollowStatsType } from "@/repositories/follow/follow.repository";

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

      return await this.followRepository.findUserFollowStatsById(user.id);
    }
  );

  public getFollowerFollowingLists = this.wrap.serviceWrap(
    async (
      uuid: string,
      fetch: string,
      listsId: number[]
    ): Promise<SelectFollowers[]> => {
      // If no arguments are provided, return an error
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const user = await this.userRepository.findUserById(uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      const listIdsToExclude = listsId?.length ? listsId : [0];

      switch (fetch) {
        case "followers":
          return this.getFollowers(user.id, listIdsToExclude);
        case "following":
          return this.getFollowing(user.id, listIdsToExclude);
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
        follower_id: user.id,
        followed_id: otherUser.id,
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
    async (id: number, lists: number[]): Promise<SelectFollowers[]> => {
      return await this.followRepository.findAllFollowersById(id, lists);
    }
  );

  private getFollowing = this.wrap.serviceWrap(
    async (id: number, lists: number[]): Promise<SelectFollowers[]> => {
      return await this.followRepository.findAllFollowersById(id, lists);
    }
  );
};

export default FollowService;
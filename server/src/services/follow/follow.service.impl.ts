import AsyncWrapper        from "@/utils/async-wrapper.util";
import UserRepository      from "@/repositories/user/user.repository.impl";
import IFollowService      from "./follow.service";
import FollowRepository    from "@/repositories/follow/follow.repository.impl";
import ApiErrorException   from "@/exceptions/api.exception";
import { SelectFollowers } from "@/types/table.types";
import { FollowStatsType } from "@/repositories/follow/follow.repository";

class FollowService implements IFollowService {
  private userRepository: UserRepository;
  private followRepository: FollowRepository;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(
    userRepository: UserRepository,
    followRepository: FollowRepository
  ) {
    this.userRepository = userRepository;
    this.followRepository = followRepository;
  }

  public getFollowStats = this.wrap.serviceWrap(
    async (user_id: any): Promise<FollowStatsType> => {
      // If no arguments are provided, return an error
      if (!user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const isExist = await this.userRepository.findUserById(user_id);
      if (!isExist) throw ApiErrorException.HTTP404Error("User not found");

      return await this.followRepository.getFollowStats(user_id);
    }
  );

  public getFollowerFollowingLists = this.wrap.serviceWrap(
    async (
      user_id: any,
      fetch: string,
      listsId: number[]
    ): Promise<SelectFollowers[]> => {
      // If no arguments are provided, return an error
      if (!user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const isExist = await this.userRepository.findUserById(user_id);
      if (!isExist) throw ApiErrorException.HTTP404Error("User not found");

      const listIdsToExclude = listsId?.length ? listsId : [0];

      switch (fetch) {
        case "followers":
          return this.followRepository.getFollowersLists(
            user_id,
            listIdsToExclude
          );
        case "following":
          return this.followRepository.getFollowingLists(
            user_id,
            listIdsToExclude
          );
        default:
          throw ApiErrorException.HTTP400Error("Invalid fetch parameter");
      }
    }
  );

  public toggleFollow = this.wrap.serviceWrap(
    async (user_id: any, followed_id: any): Promise<string> => {
      // If no arguments are provided, return an error
      if (!user_id || !followed_id) throw ApiErrorException
        .HTTP400Error("No arguments provided");

      const args = {
        follower_id: user_id as any,
        followed_id: followed_id as any,
      };

      // If the user is not found, return an error
      const user = await this.userRepository.findUserById(user_id);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      // If the user is not found, return an error
      const otherUser = await this.userRepository.findUserById(followed_id);
      if (!otherUser) throw ApiErrorException
        .HTTP404Error("The user to be followed doesn't exist");
        

      // Check if the user is already following the other user
      const isExist = await this.followRepository.isFollowUser(args);

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
};

export default FollowService;
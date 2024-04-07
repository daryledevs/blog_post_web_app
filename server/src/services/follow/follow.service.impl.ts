import ErrorException      from "@/exceptions/error.exception";
import UserRepository      from "@/repositories/user/user.repository.impl";
import IFollowService      from "./follow.service";
import { SelectUsers }     from "@/types/table.types";
import FollowRepository    from "@/repositories/follow/follow.repository.impl";
import { FollowStatsType } from "@/repositories/follow/follow.repository";

class FollowService implements IFollowService {
  private userRepository: UserRepository;
  private followRepository: FollowRepository;

  constructor(
    userRepository: UserRepository,
    followRepository: FollowRepository,
  ) {
    this.userRepository = userRepository;
    this.followRepository = followRepository;
  };

  public async getFollowStats(user_id: any): Promise<FollowStatsType> {
    try {
      // If no arguments are provided, return an error
      if (!user_id) throw ErrorException.badRequest("No arguments provided");

      // Check if the user is already following the other user
      const isExist = await this.userRepository.findUserById(user_id);
      if (!isExist) throw ErrorException.notFound("User not found");

      return await this.followRepository.getFollowStats(user_id);
    } catch (error) {
      throw error;
    };
  };

  public async getFollowerFollowingLists(user_id: any, fetch: string, listsId: number[]): Promise<SelectUsers[]> {
    try {
      // If no arguments are provided, return an error
      if (!user_id) throw ErrorException.badRequest("No arguments provided");

      // Check if the user is already following the other user
      const isExist = await this.userRepository.findUserById(user_id);
      if (!isExist) throw ErrorException.notFound("User not found");

      const listIdsToExclude = listsId?.length ? listsId : [0];

      switch(fetch) {
        case "followers":
          return this.followRepository.getFollowersLists(user_id, listIdsToExclude);
        case "following":
          return this.followRepository.getFollowingLists(user_id, listIdsToExclude);
        default:
          throw ErrorException.badRequest("Invalid fetch parameter");
      };
      
    } catch (error) {
      throw error;
    };
  };

  public async toggleFollow(user_id: any, followed_id: any): Promise<string> {
    try {
      if(!user_id || !followed_id) throw ErrorException.badRequest("No arguments provided");

      const args = {
        follower_id: user_id as any,
        followed_id: followed_id as any,
      };

      const user = await this.userRepository.findUserById(user_id);
      if(!user) throw ErrorException.notFound("User not found");

      const otherUser = await this.userRepository.findUserById(followed_id);
      if(!otherUser) throw ErrorException.notFound("The user to be followed doesn't exist")

      // Check if the user is already following the other user
      const isExist = await this.followRepository.isFollowUser(args);

      // If it already exists, delete the data from the database
      if (isExist) {
        await this.followRepository.unfollowUser(args);
        return "User unfollowed successfully";
      };

      // if there is no data in the database, create one
      await this.followRepository.followUser(args);
      return "User followed successfully";
    } catch (error) {
      throw error;
    };
  };
};

export default FollowService;
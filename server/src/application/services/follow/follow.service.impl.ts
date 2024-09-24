import Follower            from "@/domain/models/follower.model";
import Following           from "@/domain/models/following.model";
import FollowerDto         from "@/domain/dto/follower.dto";
import FollowingDto        from "@/domain/dto/following.dto";
import IEUserRepository    from "@/domain/repositories/user.repository";
import IEFollowService     from "./follow.service";
import ApiErrorException   from "@/application/exceptions/api.exception";
import IEFollowRepository  from "@/domain/repositories/follow.repository";
import { FollowStatsType } from "@/domain/repositories/follow.repository";
import { plainToInstance } from "class-transformer";

class FollowService implements IEFollowService {
  private userRepository: IEUserRepository;
  private followRepository: IEFollowRepository;

  constructor(
    userRepository: IEUserRepository,
    followRepository: IEFollowRepository
  ) {
    this.userRepository = userRepository;
    this.followRepository = followRepository;
  }

  public getFollowStats = async (uuid: string): Promise<FollowStatsType> => {
    // If the user is not found, return an error
    const user = await this.userRepository.findUserById(uuid);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    return await this.followRepository.findUserFollowStatsById(user.getId());
  };

  public getFollowerFollowingLists = async (
    uuid: string,
    fetchFollowType: string,
    followListIds: number[]
  ): Promise<FollowerDto[] | FollowingDto[]> => {
    // If the user is not found, return an error
    const user = await this.userRepository.findUserById(uuid);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    const listIdsToExclude = followListIds?.length ? followListIds : [0];

    switch (fetchFollowType) {
      case "followers":
        const followers = await this.getFollowers(
          user.getId(),
          listIdsToExclude
        );
        return plainToInstance(FollowerDto, followers, {
          excludeExtraneousValues: true,
        });

      case "following":
        const following = await this.getFollowing(
          user.getId(),
          listIdsToExclude
        );
        return plainToInstance(FollowingDto, following, {
          excludeExtraneousValues: true,
        });

      default:
        throw ApiErrorException.HTTP400Error(
          "Invalid fetch follow type parameter"
        );
    }
  };

  public toggleFollow = async (
    follower_uuid: string,
    followed_uuid: string
  ): Promise<string> => {
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
  };

  private getFollowers = async (
    id: number,
    lists: number[]
  ): Promise<Follower[]> => {
    return await this.followRepository.findAllFollowersById(id, lists);
  };

  private getFollowing = async (
    id: number,
    lists: number[]
  ): Promise<Following[]> => {
    return await this.followRepository.findAllFollowingById(id, lists);
  };
};

export default FollowService;
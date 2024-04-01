import IUsersService                         from "./user.service";
import ErrorException                        from "@/exceptions/error.exception";
import UserRepository                        from "@/repositories/user/user.repository.impl";
import FollowRepository                      from "@/repositories/follow/follow.repository.impl";
import { FollowStatsType }                   from "@/repositories/follow/follow.repository";
import RecentSearchRepository                from "@/repositories/recent search/recent-search.repository.impl";
import { SelectSearches, SelectUsers }       from "@/types/table.types";

class UsersService implements IUsersService {
  private userRepository: UserRepository;
  private followRepository: FollowRepository;
  private recentSearchRepository: RecentSearchRepository;

  constructor(
    userRepository: UserRepository,
    followRepository: FollowRepository,
    recentSearchRepository: RecentSearchRepository,
  ) {
    this.userRepository = userRepository;
    this.followRepository = followRepository;
    this.recentSearchRepository = recentSearchRepository;
  };

  public async getUserById(id: string, person: string): Promise<SelectUsers> {
    try {
      let data: SelectUsers | undefined;

      // If no parameters are provided, return an error
      if (!id && !person) throw ErrorException.badRequest("No parameters provided");

      // If the person is provided, search the user by username
      if (person)
        data = await this.userRepository.findUserByUsername(person as string);

      // If the user_id is provided, search the user by user_id
      if (!person && id) data = await this.userRepository.findUserById(id as any);

      // If the user is not found, return an error
      if (!data) throw ErrorException.notFound("User not found");

      return data;
    } catch (error) {
      throw error;
    };
  };

  public async getUserByEmail(email: string): Promise<SelectUsers | undefined> {
    try {
      return await this.userRepository.findUserByEmail(email);
    } catch (error) {
      throw error;
    };
  };

  public async updateUser(id: number, user: any): Promise<any> {
    try {
      return await this.userRepository.updateUser(id, user);
    } catch (error) {
      throw error;
    };
  };

  public async deleteUser(id: number): Promise<string | undefined> {
    try {
      return await this.userRepository.deleteUser(id);
    } catch (error) {
      throw error;
    };
  };

  public async searchUserByFields(search: string): Promise<SelectUsers[]> {
    try {
      const data = await this.userRepository.searchUsersByQuery(search);
      // If the user is not found, return an error
      if (!data?.length) throw ErrorException.notFound("User not found");
      return data;
    } catch (error) {
      throw error;
    };
  };

  public async getAllRecentSearches(user_id: any): Promise<SelectSearches[] | undefined> {
    try {
      return await this.recentSearchRepository.getRecentSearches(user_id);
    } catch (error) {
      throw error;
    };
  };

  public async saveRecentSearches(user_id: any, search_user_id: any): Promise<string | undefined> {
    try {
      return await this.recentSearchRepository.saveRecentSearches(user_id, search_user_id);
    } catch (error) {
      throw error;
    }
  };

  public async removeRecentSearches(recent_id: any): Promise<string | undefined> {
    try {
      return await this.recentSearchRepository.deleteRecentSearches(recent_id);
    } catch (error) {
      throw error;
    };
  };

  public async getFollowStats(user_id: any): Promise<FollowStatsType> {
    try {
      return await this.followRepository.getFollowStats(user_id);
    } catch (error) {
      throw error;
    };
  };

  public async getFollowerFollowingLists(user_id: any, fetch: string, listsId: number[]): Promise<SelectUsers[]> {
    try {
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

  public async toggleFollow(user_id: any, followed_id: any): Promise<string | undefined> {
    try {
      let result: string | undefined = undefined;

      const args = {
        follower_id: user_id as unknown as number,
        followed_id: followed_id as unknown as number,
      };

      // Check if the user is already following the other user
      const isExist = await this.followRepository.isFollowUser(args);

      // If it already exists, delete the data from the database
      if (isExist) result = await this.followRepository.unfollowUser(args);

      // if there is no data in the database, create one
      if (!isExist) result = await this.followRepository.followUser(args);

      return result;
    } catch (error) {
      throw error;
    };
  };
};

export default UsersService;
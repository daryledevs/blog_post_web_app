import Exception                             from "../../exception/exception";
import IUsersService                         from "./user.service";
import UserRepository                        from "../../repository/user.repository";
import RecentSearchesRepository              from "../../repository/recent-searches.repository";
import FollowRepository, { FollowStatsType } from "../../repository/follow.repository";
import { SelectRecentSearches, SelectUsers } from "../../types/table.types";

class UsersService implements IUsersService {
  private userRepository: UserRepository;
  private recentSearchesRepository: RecentSearchesRepository;
  private followRepository: FollowRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.recentSearchesRepository = new RecentSearchesRepository();
    this.followRepository = new FollowRepository();
  };

  async getUserById(id: string, person: string): Promise<SelectUsers> {
    try {
      let data: SelectUsers | undefined;

      // If no parameters are provided, return an error
      if (!id && !person) throw Exception.badRequest("No parameters provided");

      // If the person is provided, search the user by username
      if (person)
        data = await this.userRepository.findUserByUsername(person as string);

      // If the user_id is provided, search the user by user_id
      if (!person && id) data = await this.userRepository.findUserById(id as any);

      // If the user is not found, return an error
      if (!data) throw Exception.notFound("User not found");

      return data;
    } catch (error) {
      throw error;
    };
  };

  async getUserByEmail(email: string): Promise<SelectUsers | undefined> {
    try {
      return await this.userRepository.findUserByEmail(email);
    } catch (error) {
      throw error;
    };
  };

  async updateUser(id: number, user: any): Promise<any> {
    try {
      return await this.userRepository.updateUser(id, user);
    } catch (error) {
      throw error;
    };
  };

  async deleteUser(id: number): Promise<string | undefined> {
    try {
      return await this.userRepository.deleteUser(id);
    } catch (error) {
      throw error;
    };
  };

  async searchUserByFields(search: string): Promise<SelectUsers[]> {
    try {
      const data = await this.userRepository.searchUsersByQuery(search);
      // If the user is not found, return an error
      if (!data?.length) throw Exception.notFound("User not found");
      return data;
    } catch (error) {
      throw error;
    };
  };

  async getAllRecentSearches(user_id: any): Promise<SelectRecentSearches[] | undefined> {
    try {
      return await this.recentSearchesRepository.getRecentSearches(user_id);
    } catch (error) {
      throw error;
    };
  };

  async saveRecentSearches(user_id: any, search_user_id: any): Promise<string | undefined> {
    try {
      return await this.recentSearchesRepository.saveRecentSearches(user_id, search_user_id);
    } catch (error) {
      throw error;
    }
  };

  async removeRecentSearches(recent_id: any): Promise<string | undefined> {
    try {
      return await this.recentSearchesRepository.deleteRecentSearches(recent_id);
    } catch (error) {
      throw error;
    };
  };

  async getFollowStats(user_id: any): Promise<FollowStatsType> {
    try {
      return await this.followRepository.getFollowStats(user_id);
    } catch (error) {
      throw error;
    };
  };

  async getFollowerFollowingLists(user_id: any, fetch: string, listsId: number[]): Promise<SelectUsers[]> {
    try {
      const listIdsToExclude = listsId?.length ? listsId : [0];

      switch(fetch) {
        case "followers":
          return this.followRepository.getFollowersLists(user_id, listIdsToExclude);
        case "following":
          return this.followRepository.getFollowingLists(user_id, listIdsToExclude);
        default:
          throw Exception.badRequest("Invalid fetch parameter");
      };
      
    } catch (error) {
      throw error;
    };
  };

  async toggleFollow(user_id: any, followed_id: any): Promise<string | undefined> {
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
import IUserService                         from "./user.service";
import ErrorException                        from "@/exceptions/error.exception";
import UserRepository                        from "@/repositories/user/user.repository.impl";
import FollowRepository                      from "@/repositories/follow/follow.repository.impl";
import { FollowStatsType }                   from "@/repositories/follow/follow.repository";
import RecentSearchRepository                from "@/repositories/recent-search/recent-search.repository.impl";
import { SelectSearches, SelectUsers, UpdateUsers }       from "@/types/table.types";

class UserService implements IUserService {
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

  public async getUserById(id: number): Promise<SelectUsers | undefined> {
    try {
      // If no parameters are provided, return an error
      if (!id) throw ErrorException.badRequest("No arguments provided");
      
      // search the user by user_id
      const data = await this.userRepository.findUserById(id as any);

      // If the user is not found, return an error
      if (!data) throw ErrorException.notFound("User not found");
      return data;
    } catch (error) {
      throw error;
    };
  };

  public async getUserByUsername(username: string): Promise<SelectUsers | undefined> {
    try {
      // If no parameters are provided, return an error
      if (!username) throw ErrorException.badRequest("No arguments provided");

      // search the user by username
      const data = await this.userRepository.findUserByUsername(username);

      // If the user is not found, return an error
      if (!data) throw ErrorException.notFound("User not found");

      return data;
    } catch (error) {
      throw error;
    };
  };

  public async getUserByEmail(email: string): Promise<SelectUsers | undefined> {
    try {
      // If no parameters are provided, return an error
      if (!email) throw ErrorException.badRequest("No arguments provided");

      // search the user by email
      const data = await this.userRepository.findUserByEmail(email);

      // If the user is not found, return an error
      if (!data) throw ErrorException.notFound("User not found");

      return data;
    } catch (error) {
      throw error;
    };
  };

  public async updateUser(id: number, user: UpdateUsers): Promise<UpdateUsers> {
    try {
      // If no parameters are provided, return an error
      if (!id) throw ErrorException.badRequest("No arguments provided");

      // search the user by email
      const data = await this.userRepository.findUserById(id);

      // If the user is not found, return an error
      if (!data) throw ErrorException.notFound("User not found");

      return await this.userRepository.updateUser(id, user);
    } catch (error) {
      throw error;
    };
  };

  public async deleteUserById(id: number): Promise<string | undefined> {
    try {
      // If no parameters are provided, return an error
      if (!id) throw ErrorException.badRequest("No arguments provided");

      // search the user by email
      const data = await this.userRepository.findUserById(id);

      // If the user is not found, return an error
      if (!data) throw ErrorException.notFound("User not found");

      await this.userRepository.deleteUser(id);
      return "User deleted successfully";
    } catch (error) {
      throw error;
    };
  };

  public async searchUserByFields(search: string): Promise<SelectUsers[]> {
    try {
      // If no parameters are provided, return an error
      if (!search) throw ErrorException.badRequest("No arguments provided");

      // search the user by search query
      return await this.userRepository.searchUsersByQuery(search);
    } catch (error) {
      throw error;
    };
  };

  public async getAllRecentSearches(user_id: any): Promise<SelectSearches[] | undefined> {
    try {
      // If no parameters are provided, return an error
      if (!user_id) throw ErrorException.badRequest("No arguments provided");

      // Check if the user is already following the other user
      const isExist = await this.userRepository.findUserById(user_id);

      // If the user is not found, return an error
      if (!isExist) throw ErrorException.notFound("User not found");

      // search the user by search query
      return await this.recentSearchRepository.getRecentSearches(user_id);
    } catch (error) {
      throw error;
    };
  };

  public async saveRecentSearches(user_id: any, search_user_id: any): Promise<string> {
    try {
      // If no parameters are provided, return an error
      if (!user_id || !search_user_id) throw ErrorException.badRequest("No arguments provided");

      // Check if the user is already following the other user
      const user = await this.userRepository.findUserById(user_id);
      if (!user) throw ErrorException.notFound("User not found");

      // Check if the user is already following the other user
      const searchUser = await this.userRepository.findUserById(search_user_id);
      if (!searchUser) throw ErrorException.notFound("Search user not found");

      const isExist = await this.recentSearchRepository
        .findUsersSearchByUserId(user_id, search_user_id);

      if (isExist) return "Search user already saved";

      await this.recentSearchRepository.saveRecentSearches( user_id, search_user_id);

      return "Search user saved successfully";
    } catch (error) {
      throw error;
    }
  };

  public async removeRecentSearches(recent_id: any): Promise<string> {
    try {
      // If no parameters are provided, return an error
      if (!recent_id) throw ErrorException.badRequest("No arguments provided");

      // Check if the user searched the other user
      const data = await this.recentSearchRepository
        .findUsersSearchByRecentId(recent_id);

      // If the user is not found, return an error
      if (!data) throw ErrorException.notFound("Recent search not found");
      
      await this.recentSearchRepository.deleteRecentSearches(recent_id);
      return "Search user deleted successfully";
    } catch (error) {
      throw error;
    };
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

export default UserService;
import AsyncWrapper             from "@/utils/async-wrapper.util";
import UserRepository           from "@/repositories/user/user.repository.impl";
import ApiErrorException        from "@/exceptions/api.exception";
import { SelectSearches }       from "@/types/table.types";
import IRecentSearchService     from "./recent-search.service";
import RecentSearchesRepository from "@/repositories/recent-search/recent-search.repository.impl";

class RecentSearchService implements IRecentSearchService {
  private wrap: AsyncWrapper = new AsyncWrapper();
  private userRepository: UserRepository;
  private recentSearchRepository: RecentSearchesRepository;

  constructor(
    userRepository: UserRepository,
    recentSearchRepository: RecentSearchesRepository,
  ) {
    this.userRepository = userRepository;
    this.recentSearchRepository = recentSearchRepository;
  };

  public getAllRecentSearches = this.wrap.serviceWrap(
    async (user_id: any): Promise<SelectSearches[] | undefined> => {
    // If no parameters are provided, return an error
    if (!user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

    // Check if the user is already following the other user
    const isExist = await this.userRepository.findUserById(user_id);

    // If the user is not found, return an error
    if (!isExist) throw ApiErrorException.HTTP404Error("User not found");

    // search the user by search query
    return await this.recentSearchRepository.getRecentSearches(user_id);
  });

  public saveRecentSearches = this.wrap.serviceWrap(
    async (user_id: any, search_user_id: any): Promise<string> => {
      // If no parameters are provided, return an error
      if (!user_id || !search_user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // Check if the user is already following the other user
      const user = await this.userRepository.findUserById(user_id);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      // Check if the user is already following the other user
      const searchUser = await this.userRepository.findUserById(search_user_id);
      if (!searchUser) throw ApiErrorException.HTTP404Error("Search user not found");

      const isExist = await this.recentSearchRepository
        .findUsersSearchByUserId(user_id, search_user_id);

      if (isExist) return "Search user already saved";

      await this.recentSearchRepository.saveRecentSearches( user_id, search_user_id);

      return "Search user saved successfully";
    }
  );

  public removeRecentSearches = this.wrap.serviceWrap(
    async (recent_id: any): Promise<string> => {
      // If no parameters are provided, return an error
      if (!recent_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // Check if the user searched the other user
      const data = await this.recentSearchRepository
        .findUsersSearchByRecentId(recent_id);

      // If the user is not found, return an error
      if (!data) throw ApiErrorException.HTTP404Error("Recent search not found");
      
      await this.recentSearchRepository.deleteRecentSearches(recent_id);
      return "Search user deleted successfully";
    }
  );
};

export default RecentSearchService;
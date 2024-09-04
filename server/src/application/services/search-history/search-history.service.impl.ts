import SearchHistoryDto          from "@/domain/dto/search-history.dto";
import IEUserRepository          from "@/domain/repositories/user.repository";
import ApiErrorException         from "@/application/exceptions/api.exception";
import { plainToInstance }       from "class-transformer";
import IESearchHistoryService    from "./search-history.service";
import IESearchHistoryRepository from "@/domain/repositories/search-history.repository";

class SearchHistoryService implements IESearchHistoryService {
  private userRepository: IEUserRepository;
  private searchHistoryRepository: IESearchHistoryRepository;

  constructor(
    userRepository: IEUserRepository,
    searchHistoryRepository: IESearchHistoryRepository
  ) {
    this.userRepository = userRepository;
    this.searchHistoryRepository = searchHistoryRepository;
  }

  public getUsersSearchHistoryById = async (
    searcher_uuid: string | undefined
  ): Promise<SearchHistoryDto[]> => {
    // If no parameters are provided, return an error
    if (!searcher_uuid) {
      throw ApiErrorException.HTTP400Error("No arguments provided");
    }

    // Check if the user is already following the other user
    const user = await this.userRepository.findUserById(searcher_uuid);

    // If the user is not found, return an error
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    // search the user by search query
    const searches = await this.searchHistoryRepository.findSearchHistoryById(
      user.getId()
    );

    return plainToInstance(SearchHistoryDto, searches, {
      excludeExtraneousValues: true,
    });
  };

  public saveUsersSearch = async (
    searcher_uuid: string | undefined,
    search_uuid: string | undefined
  ): Promise<string> => {
    // If no parameters are provided, return an error
    if (!searcher_uuid || !search_uuid) {
      throw ApiErrorException.HTTP400Error("No arguments provided");
    }

    // Check if the user is already following the other user
    const user = await this.userRepository.findUserById(searcher_uuid);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    // Check if the user is already following the other user
    const searchUser = await this.userRepository.findUserById(search_uuid);
    if (!searchUser)
      throw ApiErrorException.HTTP404Error("Search user not found");

    const isExist = await this.searchHistoryRepository.findUsersSearchByUsersId(
      user.getId(),
      searchUser.getId()
    );

    if (isExist) return "Search user already saved";

    await this.searchHistoryRepository.saveUsersSearch(
      user.getId(),
      searchUser.getId()
    );

    return "Search user saved successfully";
  };

  public removeRecentSearchesById = async (
    uuid: string | undefined
  ): Promise<string> => {
    // If no parameters are provided, return an error
    if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

    // Check if the user searched the other user
    const search = await this.searchHistoryRepository.findUsersSearchById(uuid);

    // If the user is not found, return an error
    if (!search) throw ApiErrorException.HTTP404Error("Search user not found");

    await this.searchHistoryRepository.deleteUsersSearchById(search.getId());
    return "Search user deleted successfully";
  };
};

export default SearchHistoryService;
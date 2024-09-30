import SearchHistoryDto from "@/domain/dto/search-history.dto";

interface IESearchHistoryService {
  getUsersSearchHistoryById(searcherUuid: string): Promise<SearchHistoryDto[]>;

  saveUsersSearch(searcherUuid: string, searchUuid: string): Promise<string>;

  removeRecentSearchesById: (uuid: string) => Promise<string>;
};

export default IESearchHistoryService;
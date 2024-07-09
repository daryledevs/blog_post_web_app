import SearchHistoryDto from "@/domain/dto/search-history.dto";

interface IESearchHistoryService {
  getUsersSearchHistoryById(searcher_uuid: string | undefined): Promise<SearchHistoryDto[]>;

  saveUsersSearch(searcher_uuid: string | undefined, search_uuid: string | undefined): Promise<string>;

  removeRecentSearchesById: (uuid: string | undefined) => Promise<string>;
};

export default IESearchHistoryService;
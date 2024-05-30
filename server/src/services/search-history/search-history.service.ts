import { SelectSearches } from "@/types/table.types";

interface IESearchHistoryService {
  getUsersSearchHistoryById(searcher_uuid: string | undefined): Promise<SelectSearches[] | undefined>;

  saveUsersSearch(searcher_uuid: string | undefined, search_uuid: string | undefined): Promise<string>;

  removeRecentSearchesById: (uuid: string | undefined) => Promise<string>;
};

export default IESearchHistoryService;
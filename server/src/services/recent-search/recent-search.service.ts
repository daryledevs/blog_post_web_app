import { SelectSearches } from "@/types/table.types";

interface IRecentSearchService {
  getAllRecentSearches(user_id: any): Promise<SelectSearches[] | undefined>;

  saveRecentSearches(user_id: any, search_user_id: any): Promise<string>;

  removeRecentSearches: (recent_id: any) => Promise<string>;
};

export default IRecentSearchService;
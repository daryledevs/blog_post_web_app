import { SelectSearches } from "@/types/table.types";

interface IRecentSearchRepository {
  findUsersSearchByRecentId: (recent_id: number) => Promise<SelectSearches | undefined>;

  findUsersSearchByUserId: (user_id: number, search_user_id: number) => Promise<SelectSearches | undefined>;

  getRecentSearches: (user_id: number) => Promise<SelectSearches[] | undefined>;

  saveRecentSearches: (user_id: number, search_user_id: number) => Promise<void>;

  deleteRecentSearches: (recent_id: number) => Promise<void>;
};

export default IRecentSearchRepository;
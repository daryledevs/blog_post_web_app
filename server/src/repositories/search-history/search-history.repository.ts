import { SelectSearches } from "@/types/table.types";

interface IESearchHistoryRepository {
  findUsersSearchById: (uuid: string) => Promise<SelectSearches | undefined>;

  findSearchHistoryById: (searcher_id: number) => Promise<SelectSearches[] | undefined>;

  findUsersSearchByUsersId: (searcher_id: number, search_id: number) => Promise<SelectSearches | undefined>;

  saveUsersSearch: (searcher_id: number, search_id: number) => Promise<void>;

  deleteUsersSearchById: (id: number) => Promise<void>;
};

export default IESearchHistoryRepository;
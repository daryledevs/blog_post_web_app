import SearchHistory from "@/model/search-history.model";

interface IESearchHistoryRepository {
  findUsersSearchById: (uuid: string) => Promise<SearchHistory | undefined>;

  findSearchHistoryById: (searcher_id: number) => Promise<SearchHistory[]>;

  findUsersSearchByUsersId: (searcher_id: number, search_id: number) => Promise<SearchHistory | undefined>;

  saveUsersSearch: (searcher_id: number, search_id: number) => Promise<void>;

  deleteUsersSearchById: (id: number) => Promise<void>;
};

export default IESearchHistoryRepository;
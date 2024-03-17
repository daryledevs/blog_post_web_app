import { Insertable, Selectable, Updateable } from "kysely";

interface RecentSearchTable {
  recent_id: number;
  search_user_id: number;
  user_id: number;
  create_time: string;
}

export type RecentSearch = Selectable<RecentSearchTable>;
export type NewRecentSearch = Insertable<RecentSearchTable>;
export type UpdateRecentSearch = Updateable<RecentSearchTable>;

export default RecentSearchTable;

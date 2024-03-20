import { Generated, Insertable, Selectable, Updateable } from "kysely";

interface RecentSearchTable {
  recent_id: Generated<number>;
  search_user_id: number;
  user_id: number;
  create_time: Generated<Date>;
  [key: string]: any;
}

export type RecentSearch = Selectable<RecentSearchTable>;
export type NewRecentSearch = Insertable<RecentSearchTable>;
export type UpdateRecentSearch = Updateable<RecentSearchTable>;

export default RecentSearchTable;

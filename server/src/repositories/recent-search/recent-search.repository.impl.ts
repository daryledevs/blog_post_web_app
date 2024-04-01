import db                      from "@/database/db.database";
import DatabaseException       from "@/exceptions/database.exception";
import { SelectSearches }      from "@/types/table.types";
import IRecentSearchRepository from "./recent-search.repository";

class RecentSearchesRepository implements IRecentSearchRepository {
  async findUsersSearchByRecentId(recent_id: number): Promise<SelectSearches | undefined> {
    try {
      return await db
        .selectFrom("recent_searches")
        .selectAll()
        .where("recent_id", "=", recent_id)
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async findUsersSearchByUserId(user_id: number, search_user_id: number): Promise<SelectSearches | undefined> {
    try {
      return await db
        .selectFrom("recent_searches")
        .selectAll()
        .where((eb) =>
          eb.and([
            eb("user_id", "=", user_id),
            eb("search_user_id", "=", search_user_id),
          ])
        )
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async getRecentSearches(user_id: number): Promise<SelectSearches[] | undefined> {
    try {
      return await db
        .selectFrom("recent_searches")
        .innerJoin("users", "users.user_id", "recent_searches.search_user_id")
        .where("recent_searches.user_id", "=", user_id)
        .limit(10)
        .selectAll()
        .execute();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async saveRecentSearches(user_id: number, search_user_id: number): Promise<string | undefined> {
    try {
      await db
        .insertInto("recent_searches")
        .values({ user_id, search_user_id })
        .execute();

      return "User saved successfully";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async deleteRecentSearches(recent_id: number): Promise<string | undefined> {
    try {
      await db
        .deleteFrom("recent_searches")
        .where("recent_id", "=", recent_id)
        .execute();

      return "User deleted successfully";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };
};

export default RecentSearchesRepository;

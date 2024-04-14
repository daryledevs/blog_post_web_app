import db                      from "@/database/db.database";
import { DB }                  from "@/types/schema.types";
import { Kysely }              from "kysely";
import AsyncWrapper            from "@/utils/async-wrapper.util";
import { SelectSearches }      from "@/types/table.types";
import IRecentSearchRepository from "./recent-search.repository";

class RecentSearchesRepository implements IRecentSearchRepository {
  private database: Kysely<DB>;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() { this.database = db; };

  public findUsersSearchByRecentId = this.wrap.repoWrap(
    async (recent_id: number): Promise<SelectSearches | undefined> => {
      return await this.database
        .selectFrom("recent_searches")
        .selectAll()
        .where("recent_id", "=", recent_id)
        .executeTakeFirst();
    }
  );

  public findUsersSearchByUserId = this.wrap.repoWrap(
    async (
      user_id: number,
      search_user_id: number
    ): Promise<SelectSearches | undefined> => {
      return await this.database
        .selectFrom("recent_searches")
        .selectAll()
        .where((eb) =>
          eb.and([
            eb("user_id", "=", user_id),
            eb("search_user_id", "=", search_user_id),
          ])
        )
        .executeTakeFirst();
    }
  );

  public getRecentSearches = this.wrap.repoWrap(
    async (user_id: number): Promise<SelectSearches[] | undefined> => {
      return await this.database
        .selectFrom("recent_searches")
        .innerJoin("users", "users.user_id", "recent_searches.search_user_id")
        .where("recent_searches.user_id", "=", user_id)
        .limit(10)
        .selectAll()
        .execute();
    }
  );

  public saveRecentSearches = this.wrap.repoWrap(
    async (user_id: number, search_user_id: number): Promise<void> => {
      await this.database
        .insertInto("recent_searches")
        .values({ user_id, search_user_id })
        .execute();
    }
  );

  public deleteRecentSearches = this.wrap.repoWrap(
    async (recent_id: number): Promise<void> => {
      await this.database
        .deleteFrom("recent_searches")
        .where("recent_id", "=", recent_id)
        .execute();
    }
  );
};

export default RecentSearchesRepository;

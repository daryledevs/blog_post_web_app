import db                        from "@/database/db.database";
import { DB }                    from "@/types/schema.types";
import AsyncWrapper              from "@/utils/async-wrapper.util";
import { Kysely, sql }           from "kysely";
import { SelectSearches }        from "@/types/table.types";
import IESearchHistoryRepository from "./search-history.repository";

class SearchHistoryRepository implements IESearchHistoryRepository {
  private database: Kysely<DB>;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() { this.database = db; };

  public findUsersSearchById = this.wrap.repoWrap(
    async (uuid: string): Promise<SelectSearches | undefined> => {
      return await this.database
        .selectFrom("search_history")
        .select([
          "id",
          sql`BIN_TO_UUID(uuid)`.as("uuid"),
          "searched_id",
          "searcher_id",
          "created_at",
        ])
        .where("uuid", "=", uuid)
        .executeTakeFirst();
    }
  );

  public findSearchHistoryById = this.wrap.repoWrap(
    async (searcher_id: number): Promise<SelectSearches[] | undefined> => {
      return await this.database
        .selectFrom("search_history")
        .select([
          "id",
          sql`BIN_TO_UUID(uuid)`.as("uuid"),
          "searched_id",
          "searcher_id",
          "created_at",
        ])
        .innerJoin("users", "users.id", "search_history.searched_id")
        .where("search_history.searcher_id", "=", searcher_id)
        .limit(30)
        .execute();
    }
  );

  public findUsersSearchByUsersId = this.wrap.repoWrap(
    async (
      searcher_id: number,
      searched_id: number
    ): Promise<SelectSearches | undefined> => {
      return await this.database
        .selectFrom("search_history")
        .select([
          "id",
          sql`BIN_TO_UUID(uuid)`.as("uuid"),
          "searched_id",
          "searcher_id",
          "created_at",
        ])
        .where((eb) =>
          eb.and([
            eb("searcher_id", "=", searcher_id),
            eb("searched_id", "=", searched_id),
          ])
        )
        .executeTakeFirst();
    }
  );

  public saveUsersSearch = this.wrap.repoWrap(
    async (searcher_id: number, searched_id: number): Promise<void> => {
      await this.database
        .insertInto("search_history")
        .values({ searcher_id, searched_id, uuid: "" })
        .execute();
    }
  );

  public deleteUsersSearchById = this.wrap.repoWrap(
    async (id: number): Promise<void> => {
      await this.database
        .deleteFrom("search_history")
        .where("id", "=", id)
        .execute();
    }
  );
};

export default SearchHistoryRepository;

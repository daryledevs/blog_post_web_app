import SearchHistory, {
  IESearchHistoryData,
}                                from "@/model/search-history.model";
import db                        from "@/database/db.database";
import { DB }                    from "@/types/schema.types";
import AsyncWrapper              from "@/utils/async-wrapper.util";
import { Kysely, sql }           from "kysely";
import { plainToInstance }       from "class-transformer";
import IESearchHistoryRepository from "./search-history.repository";

class SearchHistoryRepository implements IESearchHistoryRepository {
  private database: Kysely<DB>;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() { this.database = db; }

  public findUsersSearchById = this.wrap.repoWrap(
    async (uuid: string): Promise<SearchHistory | undefined> => {
      const search: IESearchHistoryData | undefined = await this.database
        .selectFrom("search_history as sh")
        .leftJoin("users as u", "u.id", "sh.searched_id")
        .select([
          "sh.id",
          sql`BIN_TO_UUID(sh.uuid)`.as("uuid"),
          "sh.searcher_id",
          "sh.searched_id",
          sql`BIN_TO_UUID(u.uuid)`.as("user_uuid"),
          "u.username",
          "u.first_name",
          "u.last_name",
          "u.avatar_url",
          "sh.created_at",
        ])
        .where("uuid", "=", uuid)
        .executeTakeFirst();

      return this.plainToModel(search);
    }
  );

  public findSearchHistoryById = this.wrap.repoWrap(
    async (searcher_id: number): Promise<SearchHistory[]> => {
      const searches: IESearchHistoryData[] = await this.database
        .selectFrom("search_history as sh")
        .leftJoin("users as u", "u.id", "sh.searched_id")
        .select([
          "sh.id",
          sql`BIN_TO_UUID(sh.uuid)`.as("uuid"),
          "sh.searcher_id",
          "sh.searched_id",
          sql`BIN_TO_UUID(u.uuid)`.as("user_uuid"),
          "u.username",
          "u.first_name",
          "u.last_name",
          "u.avatar_url",
          "sh.created_at",
        ])
        .where("sh.searcher_id", "=", searcher_id)
        .limit(30)
        .execute();

      return plainToInstance(SearchHistory, searches);
    }
  );

  public findUsersSearchByUsersId = this.wrap.repoWrap(
    async (
      searcher_id: number,
      searched_id: number
    ): Promise<SearchHistory | undefined> => {
      const search: IESearchHistoryData | undefined = await this.database
        .selectFrom("search_history as sh")
        .leftJoin("users as u", "u.id", "sh.searched_id")
        .select([
          "sh.id",
          sql`BIN_TO_UUID(sh.uuid)`.as("uuid"),
          "sh.searcher_id",
          "sh.searched_id",
          sql`BIN_TO_UUID(u.uuid)`.as("user_uuid"),
          "u.username",
          "u.first_name",
          "u.last_name",
          "u.avatar_url",
          "sh.created_at",
        ])
        .where((eb) =>
          eb.and([
            eb("sh.searcher_id", "=", searcher_id),
            eb("sh.searched_id", "=", searched_id),
          ])
        )
        .executeTakeFirst();

      return this.plainToModel(search);
    }
  );

  public saveUsersSearch = this.wrap.repoWrap(
    async (searcher_id: number, searched_id: number): Promise<void> => {
      await this.database
        .insertInto("search_history")
        .values({ searcher_id, searched_id })
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

  private plainToModel = (
    search: IESearchHistoryData | undefined
  ): SearchHistory | undefined => {
    return search ? plainToInstance(SearchHistory, search) : undefined;
  };
};

export default SearchHistoryRepository;

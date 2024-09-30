import SearchHistory, {
  IESearchHistoryData,
}                               from "@/domain/models/search-history.model";
import db                       from "@/infrastructure/database/db.database";
import { DB }                   from "@/domain/types/schema.types";
import { Kysely, sql }          from "kysely";
import { plainToInstance }      from "class-transformer";
import ISearchHistoryRepository from "@/domain/repositories/search-history.repository";

class SearchHistoryRepository implements ISearchHistoryRepository {
  private database: Kysely<DB>;

  constructor() {
    this.database = db;
  }

  public findUsersSearchById = async (
    uuid: string
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
      .where("uuid", "=", uuid)
      .executeTakeFirst();

    return this.plainToModel(search);
  };

  public findSearchHistoryById = async (
    searcherId: number
  ): Promise<SearchHistory[]> => {
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
      .where("sh.searcher_id", "=", searcherId)
      .limit(30)
      .execute();

    return plainToInstance(SearchHistory, searches);
  };

  public findUsersSearchByUsersId = async (
    searcherId: number,
    searchedId: number
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
          eb("sh.searcher_id", "=", searcherId),
          eb("sh.searched_id", "=", searchedId),
        ])
      )
      .executeTakeFirst();

    return this.plainToModel(search);
  };

  public saveUsersSearch = async (
    searcherId: number,
    searchedId: number
  ): Promise<void> => {
    await this.database
      .insertInto("search_history")
      .values({ 
        searcher_id: searcherId, 
        searched_id: searchedId 
      })
      .execute();
  };

  public deleteUsersSearchById = async (id: number): Promise<void> => {
    await this.database
      .deleteFrom("search_history")
      .where("id", "=", id)
      .execute();
  };

  private plainToModel = (
    search: IESearchHistoryData | undefined
  ): SearchHistory | undefined => {
    return search ? plainToInstance(SearchHistory, search) : undefined;
  };
};

export default SearchHistoryRepository;

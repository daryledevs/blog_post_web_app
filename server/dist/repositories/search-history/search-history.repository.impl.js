"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const kysely_1 = require("kysely");
class SearchHistoryRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    ;
    findUsersSearchById = this.wrap.repoWrap(async (uuid) => {
        return await this.database
            .selectFrom("search_history")
            .select([
            "id",
            (0, kysely_1.sql) `BIN_TO_UUID(uuid)`.as("uuid"),
            "searched_id",
            "searcher_id",
            "created_at",
        ])
            .where("uuid", "=", uuid)
            .executeTakeFirst();
    });
    findSearchHistoryById = this.wrap.repoWrap(async (searcher_id) => {
        return await this.database
            .selectFrom("search_history")
            .select([
            "id",
            (0, kysely_1.sql) `BIN_TO_UUID(uuid)`.as("uuid"),
            "searched_id",
            "searcher_id",
            "created_at",
        ])
            .innerJoin("users", "users.id", "search_history.searched_id")
            .where("search_history.searcher_id", "=", searcher_id)
            .limit(30)
            .execute();
    });
    findUsersSearchByUsersId = this.wrap.repoWrap(async (searcher_id, searched_id) => {
        return await this.database
            .selectFrom("search_history")
            .select([
            "id",
            (0, kysely_1.sql) `BIN_TO_UUID(uuid)`.as("uuid"),
            "searched_id",
            "searcher_id",
            "created_at",
        ])
            .where((eb) => eb.and([
            eb("searcher_id", "=", searcher_id),
            eb("searched_id", "=", searched_id),
        ]))
            .executeTakeFirst();
    });
    saveUsersSearch = this.wrap.repoWrap(async (searcher_id, searched_id) => {
        await this.database
            .insertInto("search_history")
            .values({ searcher_id, searched_id, uuid: "" })
            .execute();
    });
    deleteUsersSearchById = this.wrap.repoWrap(async (id) => {
        await this.database
            .deleteFrom("search_history")
            .where("id", "=", id)
            .execute();
    });
}
;
exports.default = SearchHistoryRepository;

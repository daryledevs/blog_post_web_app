"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_history_model_1 = __importDefault(require("@/domain/models/search-history.model"));
const db_database_1 = __importDefault(require("@/infrastructure/database/db.database"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
const kysely_1 = require("kysely");
const class_transformer_1 = require("class-transformer");
class SearchHistoryRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    findUsersSearchById = this.wrap.repoWrap(async (uuid) => {
        const search = await this.database
            .selectFrom("search_history as sh")
            .leftJoin("users as u", "u.id", "sh.searched_id")
            .select([
            "sh.id",
            (0, kysely_1.sql) `BIN_TO_UUID(sh.uuid)`.as("uuid"),
            "sh.searcher_id",
            "sh.searched_id",
            (0, kysely_1.sql) `BIN_TO_UUID(u.uuid)`.as("user_uuid"),
            "u.username",
            "u.first_name",
            "u.last_name",
            "u.avatar_url",
            "sh.created_at",
        ])
            .where("uuid", "=", uuid)
            .executeTakeFirst();
        return this.plainToModel(search);
    });
    findSearchHistoryById = this.wrap.repoWrap(async (searcher_id) => {
        const searches = await this.database
            .selectFrom("search_history as sh")
            .leftJoin("users as u", "u.id", "sh.searched_id")
            .select([
            "sh.id",
            (0, kysely_1.sql) `BIN_TO_UUID(sh.uuid)`.as("uuid"),
            "sh.searcher_id",
            "sh.searched_id",
            (0, kysely_1.sql) `BIN_TO_UUID(u.uuid)`.as("user_uuid"),
            "u.username",
            "u.first_name",
            "u.last_name",
            "u.avatar_url",
            "sh.created_at",
        ])
            .where("sh.searcher_id", "=", searcher_id)
            .limit(30)
            .execute();
        return (0, class_transformer_1.plainToInstance)(search_history_model_1.default, searches);
    });
    findUsersSearchByUsersId = this.wrap.repoWrap(async (searcher_id, searched_id) => {
        const search = await this.database
            .selectFrom("search_history as sh")
            .leftJoin("users as u", "u.id", "sh.searched_id")
            .select([
            "sh.id",
            (0, kysely_1.sql) `BIN_TO_UUID(sh.uuid)`.as("uuid"),
            "sh.searcher_id",
            "sh.searched_id",
            (0, kysely_1.sql) `BIN_TO_UUID(u.uuid)`.as("user_uuid"),
            "u.username",
            "u.first_name",
            "u.last_name",
            "u.avatar_url",
            "sh.created_at",
        ])
            .where((eb) => eb.and([
            eb("sh.searcher_id", "=", searcher_id),
            eb("sh.searched_id", "=", searched_id),
        ]))
            .executeTakeFirst();
        return this.plainToModel(search);
    });
    saveUsersSearch = this.wrap.repoWrap(async (searcher_id, searched_id) => {
        await this.database
            .insertInto("search_history")
            .values({ searcher_id, searched_id })
            .execute();
    });
    deleteUsersSearchById = this.wrap.repoWrap(async (id) => {
        await this.database
            .deleteFrom("search_history")
            .where("id", "=", id)
            .execute();
    });
    plainToModel = (search) => {
        return search ? (0, class_transformer_1.plainToInstance)(search_history_model_1.default, search) : undefined;
    };
}
;
exports.default = SearchHistoryRepository;

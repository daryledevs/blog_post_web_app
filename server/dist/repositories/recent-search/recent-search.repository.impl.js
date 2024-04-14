"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
class RecentSearchesRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    ;
    findUsersSearchByRecentId = this.wrap.repoWrap(async (recent_id) => {
        return await this.database
            .selectFrom("recent_searches")
            .selectAll()
            .where("recent_id", "=", recent_id)
            .executeTakeFirst();
    });
    findUsersSearchByUserId = this.wrap.repoWrap(async (user_id, search_user_id) => {
        return await this.database
            .selectFrom("recent_searches")
            .selectAll()
            .where((eb) => eb.and([
            eb("user_id", "=", user_id),
            eb("search_user_id", "=", search_user_id),
        ]))
            .executeTakeFirst();
    });
    getRecentSearches = this.wrap.repoWrap(async (user_id) => {
        return await this.database
            .selectFrom("recent_searches")
            .innerJoin("users", "users.user_id", "recent_searches.search_user_id")
            .where("recent_searches.user_id", "=", user_id)
            .limit(10)
            .selectAll()
            .execute();
    });
    saveRecentSearches = this.wrap.repoWrap(async (user_id, search_user_id) => {
        await this.database
            .insertInto("recent_searches")
            .values({ user_id, search_user_id })
            .execute();
    });
    deleteRecentSearches = this.wrap.repoWrap(async (recent_id) => {
        await this.database
            .deleteFrom("recent_searches")
            .where("recent_id", "=", recent_id)
            .execute();
    });
}
;
exports.default = RecentSearchesRepository;

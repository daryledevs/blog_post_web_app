"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const database_exception_1 = __importDefault(require("@/exceptions/database.exception"));
class RecentSearchesRepository {
    database;
    constructor() { this.database = db_database_1.default; }
    ;
    async findUsersSearchByRecentId(recent_id) {
        try {
            return await this.database
                .selectFrom("recent_searches")
                .selectAll()
                .where("recent_id", "=", recent_id)
                .executeTakeFirst();
        }
        catch (error) {
            throw database_exception_1.default.fromError(error);
        }
        ;
    }
    ;
    async findUsersSearchByUserId(user_id, search_user_id) {
        try {
            return await this.database
                .selectFrom("recent_searches")
                .selectAll()
                .where((eb) => eb.and([
                eb("user_id", "=", user_id),
                eb("search_user_id", "=", search_user_id),
            ]))
                .executeTakeFirst();
        }
        catch (error) {
            throw database_exception_1.default.fromError(error);
        }
        ;
    }
    ;
    async getRecentSearches(user_id) {
        try {
            return await this.database
                .selectFrom("recent_searches")
                .innerJoin("users", "users.user_id", "recent_searches.search_user_id")
                .where("recent_searches.user_id", "=", user_id)
                .limit(10)
                .selectAll()
                .execute();
        }
        catch (error) {
            throw database_exception_1.default.fromError(error);
        }
        ;
    }
    ;
    async saveRecentSearches(user_id, search_user_id) {
        try {
            await this.database
                .insertInto("recent_searches")
                .values({ user_id, search_user_id })
                .execute();
        }
        catch (error) {
            throw database_exception_1.default.fromError(error);
        }
        ;
    }
    ;
    async deleteRecentSearches(recent_id) {
        try {
            await this.database
                .deleteFrom("recent_searches")
                .where("recent_id", "=", recent_id)
                .execute();
        }
        catch (error) {
            throw database_exception_1.default.fromError(error);
        }
        ;
    }
    ;
}
;
exports.default = RecentSearchesRepository;

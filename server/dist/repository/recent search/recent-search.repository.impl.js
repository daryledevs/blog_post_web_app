"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database/database"));
const database_2 = __importDefault(require("../../exception/database"));
class RecentSearchesRepository {
    async findUsersSearchByRecentId(recent_id) {
        try {
            return await database_1.default
                .selectFrom("recent_searches")
                .selectAll()
                .where("recent_id", "=", recent_id)
                .executeTakeFirst();
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    async findUsersSearchByUserId(user_id, search_user_id) {
        try {
            return await database_1.default
                .selectFrom("recent_searches")
                .selectAll()
                .where((eb) => eb.and([
                eb("user_id", "=", user_id),
                eb("search_user_id", "=", search_user_id),
            ]))
                .executeTakeFirst();
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    async getRecentSearches(user_id) {
        try {
            return await database_1.default
                .selectFrom("recent_searches")
                .innerJoin("users", "users.user_id", "recent_searches.search_user_id")
                .where("recent_searches.user_id", "=", user_id)
                .limit(10)
                .selectAll()
                .execute();
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    async saveRecentSearches(user_id, search_user_id) {
        try {
            await database_1.default
                .insertInto("recent_searches")
                .values({ user_id, search_user_id })
                .execute();
            return "User saved successfully";
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    async deleteRecentSearches(recent_id) {
        try {
            await database_1.default
                .deleteFrom("recent_searches")
                .where("recent_id", "=", recent_id)
                .execute();
            return "User deleted successfully";
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
}
;
exports.default = RecentSearchesRepository;

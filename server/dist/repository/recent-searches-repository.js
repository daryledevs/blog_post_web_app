"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
const database_2 = __importDefault(require("../exception/database"));
class RecentSearchesRepository {
    static findUsersSearchByRecentId(recent_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
                    .selectFrom("recent_searches")
                    .selectAll()
                    .where("recent_id", "=", recent_id)
                    .executeTakeFirst();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
        });
    }
    static findUsersSearchByUserId(user_id, search_user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
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
        });
    }
    static getRecentSearches(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
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
        });
    }
    static saveRecentSearches(user_id, search_user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default
                    .insertInto("recent_searches")
                    .values({ user_id, search_user_id })
                    .execute();
                return "User saved successfully";
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
        });
    }
    static deleteRecentSearches(recent_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default
                    .deleteFrom("recent_searches")
                    .where("recent_id", "=", recent_id)
                    .execute();
                return "User deleted successfully";
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
        });
    }
}
exports.default = RecentSearchesRepository;

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
const database_1 = require("../database/database");
const kysely_1 = require("kysely");
const database_2 = __importDefault(require("../exception/database"));
class UserRepository {
    static findUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.db
                    .selectFrom("users")
                    .where("user_id", "=", user_id)
                    .selectAll()
                    .executeTakeFirst();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
        });
    }
    static findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.db
                    .selectFrom("users")
                    .where("username", "like", username + "%")
                    .selectAll()
                    .executeTakeFirst();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static searchUsersByQuery(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.db
                    .selectFrom("users")
                    .where((eb) => eb.or([
                    eb("username", "=", search + "%"),
                    eb("first_name", "=", search + "%"),
                    eb("last_name", "=", search + "%"),
                    eb((0, kysely_1.sql) `concat(${eb.ref("first_name")}, "", ${eb.ref("last_name")})`, "=", search + "%"),
                ]))
                    .selectAll()
                    .execute();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.db
                    .selectFrom("users")
                    .where("email", "=", email)
                    .selectAll()
                    .executeTakeFirst();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { insertId } = yield database_1.db
                    .insertInto("users")
                    .values(user)
                    .executeTakeFirstOrThrow();
                return yield UserRepository.findUserById(Number(insertId));
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static getRecentSearches(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.db
                    .selectFrom("recentSearches")
                    .innerJoin("users", "users.user_id", "recentSearches.search_user_id")
                    .where("recentSearches.user_id", "=", user_id)
                    .limit(10)
                    .selectAll()
                    .execute();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static saveRecentSearches(user_id, search_user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the user exists
                const isUsersExists = yield database_1.db
                    .selectFrom("users")
                    .where((eb) => eb.and([
                    eb("user_id", "=", user_id),
                    eb("user_id", "=", search_user_id),
                ]))
                    .executeTakeFirst();
                // If the user does not exist, return an error
                if (!isUsersExists)
                    return "User not found";
                // Check if the user is already saved
                const isRecentExists = yield database_1.db
                    .selectFrom("recentSearches")
                    .where((eb) => eb.and([
                    eb("user_id", "=", user_id),
                    eb("search_user_id", "=", search_user_id),
                ]))
                    .executeTakeFirst();
                // If the user is already saved, return an error
                if (isRecentExists)
                    return "User already saved";
                yield database_1.db
                    .insertInto("recentSearches")
                    .values({ user_id, search_user_id })
                    .execute();
                return "User saved successfully";
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static deleteRecentSearches(recent_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the user exists
                const recent = yield database_1.db
                    .selectFrom("recentSearches")
                    .where("recent_id", "=", recent_id)
                    .executeTakeFirst();
                // If the user does not exist, return an error
                if (!recent)
                    return "User not found";
                yield database_1.db
                    .deleteFrom("recentSearches")
                    .where("recent_id", "=", recent_id)
                    .execute();
                return "User deleted successfully";
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static updateUser(user_id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the user exists
                const person = yield UserRepository.findUserById(user_id);
                // If the user does not exist, return an error
                if (!person)
                    return undefined;
                yield database_1.db
                    .updateTable("users")
                    .set(user)
                    .where("user_id", "=", user_id)
                    .executeTakeFirstOrThrow();
                return yield UserRepository.findUserById(user_id);
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static deleteUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the user exists
                const person = yield UserRepository.findUserById(user_id);
                // If the user does not exist, return an error
                if (!person)
                    return "User not found";
                yield database_1.db.deleteFrom("users").where("user_id", "=", user_id).execute();
                return "User deleted successfully";
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static getFollowsStats(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryFollowers = database_1.db
                    .selectFrom("followers")
                    .innerJoin("users", "followers.followed_id", "users.user_id")
                    .select((eb) => [eb.fn.count("followed_id").as("followers")])
                    .where("followers.followed_id", "=", user_id)
                    .groupBy("followers.followed_id");
                const queryFollowing = database_1.db
                    .selectFrom("followers")
                    .innerJoin("users", "followers.follower_id", "users.user_id")
                    .select((eb) => eb.fn.count("followers.follower_id").as("following"))
                    .where("followers.follower_id", "=", user_id)
                    .groupBy("followers.follower_id");
                const { followers, following } = yield database_1.db
                    .selectNoFrom((eb) => [
                    eb.fn.coalesce(queryFollowers, eb.lit(0)).as("followers"),
                    eb.fn.coalesce(queryFollowing, eb.lit(0)).as("following"),
                ])
                    .executeTakeFirstOrThrow();
                return { followers, following };
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static getFollowerFollowingLists(user_id, fetch, listsId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listIdsToExclude = (listsId === null || listsId === void 0 ? void 0 : listsId.length) ? listsId : [0];
                const myId = fetch === "followers" ? "followed_id" : "follower_id";
                const otherId = fetch !== "followers" ? "followed_id" : "follower_id";
                const result = yield database_1.db
                    .selectFrom("followers")
                    .innerJoin("users", `followers.${otherId}`, "users.user_id")
                    .where((eb) => eb.and([
                    eb(`followers.${myId}`, "=", user_id),
                    eb(`followers.${otherId}`, "not in", listIdsToExclude),
                ]))
                    .selectAll()
                    .limit(10)
                    .execute();
                return result;
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static isFollowUser(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.db
                    .selectFrom("followers")
                    .selectAll()
                    .where((eb) => eb.and([
                    eb("follower_id", "=", identifier.follower_id),
                    eb("followed_id", "=", identifier.followed_id),
                ]))
                    .executeTakeFirst();
                return !!result;
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static followUser(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const { follower_id, followed_id } = identifier;
            yield database_1.db
                .insertInto("followers")
                .values({ follower_id, followed_id })
                .execute();
            return "User followed successfully";
        });
    }
    ;
    static unfollowUser(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { follower_id, followed_id } = identifier;
                yield database_1.db
                    .deleteFrom("followers")
                    .where((eb) => eb.and([
                    eb("follower_id", "=", follower_id),
                    eb("followed_id", "=", followed_id),
                ]))
                    .execute();
                return "User unfollowed successfully";
            }
            catch (error) {
                console.log(error);
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
}
;
exports.default = UserRepository;

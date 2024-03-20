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
class FollowRepository {
    static getFollowsStats(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryFollowers = database_1.default
                    .selectFrom("followers")
                    .innerJoin("users", "followers.followed_id", "users.user_id")
                    .select((eb) => [eb.fn.count("followed_id").as("followers")])
                    .where("followers.followed_id", "=", user_id)
                    .groupBy("followers.followed_id");
                const queryFollowing = database_1.default
                    .selectFrom("followers")
                    .innerJoin("users", "followers.follower_id", "users.user_id")
                    .select((eb) => eb.fn.count("followers.follower_id").as("following"))
                    .where("followers.follower_id", "=", user_id)
                    .groupBy("followers.follower_id");
                const { followers, following } = yield database_1.default
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
                const result = yield database_1.default
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
                const result = yield database_1.default
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
            yield database_1.default
                .insertInto("followers")
                .values(identifier)
                .execute();
            return "User followed successfully";
        });
    }
    ;
    static unfollowUser(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default
                    .deleteFrom("followers")
                    .where((eb) => eb.and([
                    eb("follower_id", "=", identifier.follower_id),
                    eb("followed_id", "=", identifier.followed_id),
                ]))
                    .execute();
                return "User unfollowed successfully";
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
}
;
exports.default = FollowRepository;

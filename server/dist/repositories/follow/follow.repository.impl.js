"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
class FollowRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    ;
    getFollowStats = this.wrap.repoWrap(async (user_id) => {
        const queryFollowers = this.database
            .selectFrom("followers")
            .innerJoin("users", "followers.followed_id", "users.user_id")
            .select((eb) => [eb.fn.count("followed_id").as("followers")])
            .where("followers.followed_id", "=", user_id)
            .groupBy("followers.followed_id");
        const queryFollowing = this.database
            .selectFrom("followers")
            .innerJoin("users", "followers.follower_id", "users.user_id")
            .select((eb) => eb.fn.count("followers.follower_id").as("following"))
            .where("followers.follower_id", "=", user_id)
            .groupBy("followers.follower_id");
        const { followers, following } = await this.database
            .selectNoFrom((eb) => [
            eb.fn.coalesce(queryFollowers, eb.lit(0)).as("followers"),
            eb.fn.coalesce(queryFollowing, eb.lit(0)).as("following"),
        ])
            .executeTakeFirstOrThrow();
        return { followers, following };
    });
    getFollowersLists = this.wrap.repoWrap(async (user_id, listsId) => {
        return await this.database
            .selectFrom("followers")
            .innerJoin("users", "followers.follower_id", "users.user_id")
            .where((eb) => eb.and([
            eb("followers.followed_id", "=", user_id),
            eb("followers.follower_id", "not in", listsId),
        ]))
            .selectAll()
            .limit(10)
            .execute();
    });
    getFollowingLists = this.wrap.repoWrap(async (user_id, listsId) => {
        return await this.database
            .selectFrom("followers")
            .innerJoin("users", "followers.followed_id", "users.user_id")
            .where((eb) => eb.and([
            eb("followers.follower_id", "=", user_id),
            eb("followers.followed_id", "not in", listsId),
        ]))
            .selectAll()
            .limit(10)
            .execute();
    });
    isFollowUser = this.wrap.repoWrap(async (identifier) => {
        const result = await this.database
            .selectFrom("followers")
            .selectAll()
            .where((eb) => eb.and([
            eb("follower_id", "=", identifier.follower_id),
            eb("followed_id", "=", identifier.followed_id),
        ]))
            .executeTakeFirst();
        return !!result;
    });
    followUser = this.wrap.repoWrap(async (identifier) => {
        await this.database
            .insertInto("followers")
            .values(identifier)
            .execute();
    });
    unfollowUser = this.wrap.repoWrap(async (identifier) => {
        await this.database
            .deleteFrom("followers")
            .where((eb) => eb.and([
            eb("follower_id", "=", identifier.follower_id),
            eb("followed_id", "=", identifier.followed_id),
        ]))
            .execute();
    });
}
;
exports.default = FollowRepository;

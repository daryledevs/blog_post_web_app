"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const kysely_1 = require("kysely");
class FeedRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    ;
    getTotalFeed = this.wrap.repoWrap(async () => {
        const query = this.database
            .selectFrom("posts")
            .select((eb) => eb.fn.countAll().as("count"))
            .where((eb) => eb("created_at", ">", (0, kysely_1.sql) `DATE_SUB(CURDATE(), INTERVAL 3 DAY)`));
        const { count } = await this.database
            .selectNoFrom((eb) => [eb.fn.coalesce(query, eb.lit(0)).as("count")])
            .executeTakeFirstOrThrow();
        return count;
    });
    getUserFeed = this.wrap.repoWrap(async (user_id, post_ids) => {
        return await this.database
            .selectFrom("followers")
            .innerJoin("posts", "followers.followed_id", "posts.user_id")
            .innerJoin("users", "users.user_id", "posts.user_id")
            .select((eb) => [
            "posts.post_id",
            "posts.image_id",
            "posts.image_url",
            "users.user_id",
            "users.username",
            "users.first_name",
            "users.last_name",
            "users.avatar_url",
            "posts.caption",
            "posts.privacy_level",
            "posts.created_at",
            eb
                .selectFrom("likes")
                .select((eb) => eb.fn.count("likes.post_id").as("count"))
                .whereRef("posts.post_id", "=", "likes.post_id")
                .as("count"),
        ])
            .where((eb) => eb.and([
            eb("followers.follower_id", "=", user_id),
            eb("posts.created_at", ">", (0, kysely_1.sql) `DATE_SUB(CURDATE(), INTERVAL 3 DAY)`),
            eb("posts.post_id", "not in", post_ids),
        ]))
            .orderBy((0, kysely_1.sql) `"RAND()"`)
            .limit(3)
            .execute();
    });
    getExploreFeed = this.wrap.repoWrap(async (user_id) => {
        return await this.database
            .selectFrom("posts")
            .innerJoin("users", "users.user_id", "posts.user_id")
            .leftJoin("followers", (join) => join.on((eb) => eb.and([
            eb("followers.followed_id", "=", eb.ref("users.user_id")),
            eb("followers.follower_id", "=", user_id),
        ])))
            .select((eb) => [
            "posts.post_id",
            "posts.image_id",
            "posts.image_url",
            "users.user_id",
            "users.username",
            "users.first_name",
            "users.last_name",
            "users.avatar_url",
            "posts.caption",
            "posts.privacy_level",
            "posts.created_at",
            eb
                .selectFrom("likes")
                .select((eb) => eb.fn.count("likes.post_id").as("count"))
                .whereRef("posts.post_id", "=", "likes.post_id")
                .as("count"),
        ])
            .where((eb) => eb.and([
            eb("posts.created_at", ">", (0, kysely_1.sql) `DATE_SUB(CURDATE(), INTERVAL 3 DAY)`),
            eb("followers.follower_id", "is", eb.lit(null)),
            eb("users.user_id", "!=", user_id),
        ]))
            .orderBy((0, kysely_1.sql) `"RAND()"`)
            .limit(3)
            .execute();
    });
}
;
exports.default = FeedRepository;

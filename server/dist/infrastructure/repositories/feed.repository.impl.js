"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/infrastructure/database/db.database"));
const uuid_to_bin_1 = __importDefault(require("@/application/utils/uuid-to-bin"));
const kysely_1 = require("kysely");
class FeedRepository {
    database;
    constructor() { this.database = db_database_1.default; }
    getTotalFeed = async () => {
        const query = this.database
            .selectFrom("posts")
            .select((eb) => eb.fn.countAll().as("count"))
            .where((eb) => eb("created_at", ">", (0, kysely_1.sql) `DATE_SUB(CURDATE(), INTERVAL 3 DAY)`));
        const { count } = await this.database
            .selectNoFrom((eb) => [eb.fn.coalesce(query, eb.lit(0)).as("count")])
            .executeTakeFirstOrThrow();
        return count;
    };
    getUserFeed = async (user_id, post_uuids) => {
        const postUuidsToBinQuery = (0, uuid_to_bin_1.default)(post_uuids);
        return await this.database
            .selectFrom("followers")
            .innerJoin("posts", "followers.followed_id", "posts.user_id")
            .innerJoin("users", "users.id", "posts.user_id")
            .select((eb) => [
            "posts.id",
            (0, kysely_1.sql) `BIN_TO_UUID(posts.uuid)`.as("uuid"),
            "posts.image_id",
            "posts.image_url",
            "posts.user_id",
            "users.id",
            (0, kysely_1.sql) `BIN_TO_UUID(users.uuid)`.as("uuid"),
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
                .whereRef("posts.id", "=", "likes.post_id")
                .as("count"),
        ])
            .where((eb) => eb.and([
            eb("followers.follower_id", "=", user_id),
            eb("posts.created_at", ">", (0, kysely_1.sql) `DATE_SUB(CURDATE(), INTERVAL 3 DAY)`),
            eb("posts.uuid", "not in", postUuidsToBinQuery),
        ]))
            .orderBy((0, kysely_1.sql) `"RAND()"`)
            .limit(3)
            .execute();
    };
    getExploreFeed = async (user_id) => {
        return await this.database
            .selectFrom("posts")
            .innerJoin("users", "users.id", "posts.user_id")
            .leftJoin("followers", (join) => join.on((eb) => eb.and([
            eb("followers.followed_id", "=", eb.ref("users.id")),
            eb("followers.follower_id", "=", user_id),
        ])))
            .select((eb) => [
            "posts.id",
            (0, kysely_1.sql) `BIN_TO_UUID(posts.uuid)`.as("uuid"),
            "posts.image_id",
            "posts.image_url",
            "posts.user_id",
            "users.id",
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
                .whereRef("posts.id", "=", "likes.post_id")
                .as("count"),
        ])
            .where((eb) => eb.and([
            eb("posts.created_at", ">", (0, kysely_1.sql) `DATE_SUB(CURDATE(), INTERVAL 3 DAY)`),
            eb("followers.follower_id", "is", eb.lit(null)),
            eb("users.id", "!=", user_id),
        ]))
            .orderBy((0, kysely_1.sql) `"RAND()"`)
            .limit(30)
            .execute();
    };
}
;
exports.default = FeedRepository;

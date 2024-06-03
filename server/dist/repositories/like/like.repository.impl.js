"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const kysely_1 = require("kysely");
class LikeRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    ;
    findPostsLikeCount = this.wrap.repoWrap(async (post_id) => {
        const query = this.database
            .selectFrom("likes")
            .select((eb) => eb.fn.count("likes.post_id").as("count"))
            .where("likes.post_id", "=", post_id);
        const { count } = await this.database
            .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
            .executeTakeFirstOrThrow();
        return count;
    });
    isUserLikePost = this.wrap.repoWrap(async (user_id, post_id) => {
        return await this.database
            .selectFrom("likes")
            .select([
            "id",
            (0, kysely_1.sql) `BIN_TO_UUID(uuid)`.as("uuid"),
            "user_id",
            "post_id",
            "created_at",
        ])
            .where((eb) => eb.and([
            eb("likes.user_id", "=", user_id),
            eb("likes.post_id", "=", post_id),
        ]))
            .executeTakeFirst();
    });
    likeUsersPostById = this.wrap.repoWrap(async (like) => {
        await this.database
            .insertInto("likes")
            .values(like)
            .execute();
    });
    dislikeUsersPostById = this.wrap.repoWrap(async (id) => {
        await this.database
            .deleteFrom("likes")
            .where("id", "=", id)
            .execute();
    });
}
;
exports.default = LikeRepository;

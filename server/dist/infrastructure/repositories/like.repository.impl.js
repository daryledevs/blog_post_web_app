"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/infrastructure/database/db.database"));
const like_model_1 = __importDefault(require("@/domain/models/like.model"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
const kysely_1 = require("kysely");
const class_transformer_1 = require("class-transformer");
class LikeRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() {
        this.database = db_database_1.default;
    }
    findPostsLikeCount = async (post_id) => {
        const query = this.database
            .selectFrom("likes")
            .select((eb) => eb.fn.count("likes.post_id").as("count"))
            .where("likes.post_id", "=", post_id);
        const { count } = await this.database
            .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
            .executeTakeFirstOrThrow();
        return count;
    };
    isUserLikePost = async (user_id, post_id) => {
        const data = await this.database
            .selectFrom("likes")
            .select([
            "likes.id",
            "likes.post_id",
            (0, kysely_1.sql) `BIN_TO_UUID(posts.uuid)`.as("post_uuid"),
            "likes.user_id",
            (0, kysely_1.sql) `BIN_TO_UUID(users.uuid)`.as("user_uuid"),
            "likes.created_at",
        ])
            .leftJoin("posts", "likes.post_id", "posts.id")
            .leftJoin("users", "likes.user_id", "users.id")
            .where((eb) => eb.and([
            eb("likes.user_id", "=", user_id),
            eb("likes.post_id", "=", post_id),
        ]))
            .executeTakeFirst();
        return (0, class_transformer_1.plainToInstance)(like_model_1.default, data);
    };
    likeUsersPostById = async (like) => {
        await this.database.insertInto("likes").values(like).execute();
    };
    dislikeUsersPostById = async (id) => {
        await this.database.deleteFrom("likes").where("id", "=", id).execute();
    };
}
;
exports.default = LikeRepository;

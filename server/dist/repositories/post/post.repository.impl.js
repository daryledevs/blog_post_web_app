"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class PostRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    ;
    findPostsByPostId = this.wrap.repoWrap(async (post_id) => {
        return this.database
            .selectFrom("posts")
            .selectAll()
            .where("posts.post_id", "=", post_id)
            .executeTakeFirst();
    });
    getUserPosts = this.wrap.repoWrap(async (user_id) => {
        return await this.database
            .selectFrom("posts")
            .innerJoin("users", "posts.user_id", "users.user_id")
            .leftJoin("likes", "posts.post_id", "likes.post_id")
            .select((eb) => [
            "posts.post_id",
            "posts.image_id",
            "posts.image_url",
            "posts.user_id",
            "users.username",
            "users.first_name",
            "users.last_name",
            "posts.caption",
            "posts.privacy_level",
            "posts.created_at",
            eb.fn.count("likes.post_id").as("count"),
        ])
            .where("posts.user_id", "=", user_id)
            .orderBy("posts.created_at", "desc")
            .groupBy("posts.post_id")
            .execute();
    });
    getUserTotalPosts = this.wrap.repoWrap(async (user_id) => {
        const query = this.database
            .selectFrom("posts")
            .select((eb) => eb.fn.count("posts.post_id").as("count"))
            .where("user_id", "=", user_id);
        const { count } = await this.database
            .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
            .executeTakeFirstOrThrow();
        return count;
    });
    newPost = this.wrap.repoWrap(async (post) => {
        await this.database.insertInto("posts").values(post).execute();
    });
    editPost = this.wrap.repoWrap(async (post_id, post) => {
        await this.database
            .updateTable("posts")
            .set(post)
            .where("post_id", "=", post_id)
            .executeTakeFirst();
    });
    deletePost = this.wrap.repoWrap(async (post_id) => {
        const { image_id } = (await this.database
            .selectFrom("posts")
            .select(["image_id"])
            .where("post_id", "=", post_id)
            .executeTakeFirst());
        const status = await cloudinary_1.default.v2.uploader.destroy(image_id);
        if (status.result !== "ok")
            throw api_exception_1.default.HTTP400Error("Delete image failed");
        await this.database
            .deleteFrom("posts")
            .where("post_id", "=", post_id)
            .executeTakeFirst();
    });
    getLikesCountForPost = this.wrap.repoWrap(async (post_id) => {
        const query = this.database
            .selectFrom("likes")
            .select((eb) => eb.fn.count("likes.post_id").as("count"))
            .where("likes.post_id", "=", post_id);
        const { count } = await this.database
            .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
            .executeTakeFirstOrThrow();
        return count;
    });
    isUserLikePost = this.wrap.repoWrap(async (like) => {
        return await this.database
            .selectFrom("likes")
            .selectAll()
            .where((eb) => eb.and([
            eb("likes.post_id", "=", like.post_id),
            eb("likes.user_id", "=", like.user_id),
        ]))
            .executeTakeFirst();
    });
    toggleUserLikeForPost = this.wrap.repoWrap(async (like) => {
        await this.database
            .insertInto("likes")
            .values(like)
            .execute();
    });
    removeUserLikeForPost = this.wrap.repoWrap(async (like) => {
        await this.database
            .deleteFrom("likes")
            .where((eb) => eb.and([
            eb("likes.post_id", "=", like.post_id),
            eb("likes.user_id", "=", like.user_id),
        ]))
            .execute();
    });
}
;
exports.default = PostRepository;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const database_exception_1 = __importDefault(require("@/exceptions/database.exception"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class PostRepository {
    database;
    constructor() { this.database = db_database_1.default; }
    ;
    async findPostsByPostId(post_id) {
        try {
            return this.database
                .selectFrom("posts")
                .selectAll()
                .where("posts.post_id", "=", post_id)
                .executeTakeFirst();
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getUserPosts(user_id) {
        try {
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
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
    async getUserTotalPosts(user_id) {
        try {
            const query = this.database
                .selectFrom("posts")
                .select((eb) => eb.fn.count("posts.post_id").as("count"))
                .where("user_id", "=", user_id);
            const { count } = await this.database
                .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
                .executeTakeFirstOrThrow();
            return count;
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
    async newPost(post) {
        try {
            await this.database
                .insertInto("posts")
                .values(post)
                .execute();
            return "Post has been posted";
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
    async editPost(post_id, post) {
        try {
            await this.database
                .updateTable("posts")
                .set(post)
                .where("post_id", "=", post_id)
                .executeTakeFirst();
            return "Edit post successfully";
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
    async deletePost(post_id) {
        try {
            const { image_id } = await this.database
                .selectFrom("posts")
                .select(["image_id"])
                .where("post_id", "=", post_id)
                .executeTakeFirst();
            const status = await cloudinary_1.default.v2.uploader.destroy(image_id);
            if (status.result !== "ok")
                throw api_exception_1.default.HTTP400Error("Delete image failed");
            await this.database
                .deleteFrom("posts")
                .where("post_id", "=", post_id)
                .executeTakeFirst();
            return "Delete post successfully";
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
    async getLikesCountForPost(post_id) {
        try {
            const query = this.database
                .selectFrom("likes")
                .select((eb) => eb.fn.count("likes.post_id").as("count"))
                .where("likes.post_id", "=", post_id);
            const { count } = await this.database
                .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
                .executeTakeFirstOrThrow();
            return count;
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
    async isUserLikePost(like) {
        try {
            return await this.database
                .selectFrom("likes")
                .selectAll()
                .where((eb) => eb.and([
                eb("likes.post_id", "=", like.post_id),
                eb("likes.user_id", "=", like.user_id)
            ]))
                .executeTakeFirst();
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
    async toggleUserLikeForPost(like) {
        try {
            await this.database
                .insertInto("likes")
                .values(like)
                .execute();
            return "Like post successfully";
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
    async removeUserLikeForPost(like) {
        try {
            await this.database
                .deleteFrom("likes")
                .where((eb) => eb.and([
                eb("likes.post_id", "=", like.post_id),
                eb("likes.user_id", "=", like.user_id)
            ]))
                .execute();
            return "Removed like from a post";
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
}
;
exports.default = PostRepository;

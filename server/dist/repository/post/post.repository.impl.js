"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("@/database/database"));
const exception_1 = __importDefault(require("@/exception/exception"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const database_2 = __importDefault(require("@/exception/database"));
class PostRepository {
    async findPostsByPostId(post_id) {
        try {
            return database_1.default
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
            return await database_1.default
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
                "posts.post_date",
                eb.fn.count("likes.post_id").as("count"),
            ])
                .where("posts.user_id", "=", user_id)
                .orderBy("posts.post_date", "desc")
                .groupBy("posts.post_id")
                .execute();
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    async getUserTotalPosts(user_id) {
        try {
            const query = database_1.default
                .selectFrom("posts")
                .select((eb) => eb.fn.count("posts.post_id").as("count"))
                .where("user_id", "=", user_id);
            const { count } = await database_1.default
                .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
                .executeTakeFirstOrThrow();
            return count;
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    async newPost(post) {
        try {
            await database_1.default
                .insertInto("posts")
                .values(post)
                .execute();
            return "Post has been posted";
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    async editPost(post_id, post) {
        try {
            await database_1.default
                .updateTable("posts")
                .set(post)
                .where("post_id", "=", post_id)
                .executeTakeFirst();
            return "Edit post successfully";
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    async deletePost(post_id) {
        try {
            const { image_id } = await database_1.default
                .selectFrom("posts")
                .select(["image_id"])
                .where("post_id", "=", post_id)
                .executeTakeFirst();
            const status = await cloudinary_1.default.v2.uploader.destroy(image_id);
            if (status.result !== "ok")
                throw exception_1.default.badRequest("Delete image failed");
            await database_1.default
                .deleteFrom("posts")
                .where("post_id", "=", post_id)
                .executeTakeFirst();
            return "Delete post successfully";
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    async getLikesCountForPost(post_id) {
        try {
            const query = database_1.default
                .selectFrom("likes")
                .select((eb) => eb.fn.count("likes.post_id").as("count"))
                .where("likes.post_id", "=", post_id);
            const { count } = await database_1.default
                .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
                .executeTakeFirstOrThrow();
            return count;
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    async isUserLikePost(like) {
        try {
            return await database_1.default
                .selectFrom("likes")
                .selectAll()
                .where((eb) => eb.and([
                eb("likes.post_id", "=", like.post_id),
                eb("likes.user_id", "=", like.user_id)
            ]))
                .executeTakeFirst();
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    async toggleUserLikeForPost(like) {
        try {
            await database_1.default
                .insertInto("likes")
                .values(like)
                .execute();
            return "Like post successfully";
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    async removeUserLikeForPost(like) {
        try {
            await database_1.default
                .deleteFrom("likes")
                .where((eb) => eb.and([
                eb("likes.post_id", "=", like.post_id),
                eb("likes.user_id", "=", like.user_id)
            ]))
                .execute();
            return "Removed like from a post";
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
}
;
exports.default = PostRepository;

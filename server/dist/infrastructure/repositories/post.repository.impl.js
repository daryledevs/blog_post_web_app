"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/infrastructure/database/db.database"));
const post_model_1 = __importDefault(require("@/domain/models/post.model"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
const kysely_1 = require("kysely");
const class_transformer_1 = require("class-transformer");
class PostRepository {
    database;
    cloudinary;
    wrap = new async_wrapper_util_1.default();
    constructor(cloudinary) {
        this.database = db_database_1.default;
        this.cloudinary = cloudinary;
    }
    findPostsByPostId = this.wrap.repoWrap(async (uuid) => {
        const data = await this.database
            .selectFrom("posts")
            .select([
            "id",
            (0, kysely_1.sql) `BIN_TO_UUID(uuid)`.as("uuid"),
            "user_id",
            "caption",
            "image_id",
            "image_url",
            "privacy_level",
            "created_at",
        ])
            .where("uuid", "=", (0, kysely_1.sql) `UUID_TO_BIN(${uuid})`)
            .executeTakeFirst();
        return this.plainToModel(data);
    });
    findAllPostsByUserId = this.wrap.repoWrap(async (user_id) => {
        const data = await this.database
            .selectFrom("posts")
            .innerJoin("users", "posts.user_id", "users.id")
            .leftJoin("likes", "posts.id", "likes.post_id")
            .select((eb) => [
            "posts.id",
            (0, kysely_1.sql) `BIN_TO_UUID(posts.uuid)`.as("uuid"),
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
            .groupBy("posts.id")
            .execute();
        return (0, class_transformer_1.plainToInstance)(post_model_1.default, data);
    });
    findUserTotalPostsByUserId = this.wrap.repoWrap(async (user_id) => {
        const query = this.database
            .selectFrom("posts")
            .select((eb) => eb.fn.count("posts.id").as("count"))
            .where("user_id", "=", user_id);
        const { count } = await this.database
            .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
            .executeTakeFirstOrThrow();
        return count;
    });
    createNewPost = this.wrap.repoWrap(async (post) => {
        await this.database.insertInto("posts").values(post).execute();
    });
    editPostByPostId = this.wrap.repoWrap(async (uuid, post) => {
        console.log(post);
        await this.database
            .updateTable("posts")
            .set(post)
            .where("uuid", "=", (0, kysely_1.sql) `UUID_TO_BIN(${uuid})`)
            .executeTakeFirst();
    });
    deletePostById = this.wrap.repoWrap(async (post_id) => {
        const { image_id } = (await this.database
            .selectFrom("posts")
            .select(["image_id"])
            .where("id", "=", post_id)
            .executeTakeFirst());
        // deletes the image associated with a user's post from the cloud storage
        await this.cloudinary.deleteImage(image_id);
        await this.database
            .deleteFrom("posts")
            .where("id", "=", post_id)
            .executeTakeFirst();
    });
    plainToModel = (post) => {
        return post ? (0, class_transformer_1.plainToInstance)(post_model_1.default, post) : undefined;
    };
}
;
exports.default = PostRepository;

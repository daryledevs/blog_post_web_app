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
const database_1 = require("../database/database");
const exception_1 = __importDefault(require("../exception/exception"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const database_2 = __importDefault(require("../exception/database"));
class PostRepository {
    static getUserPosts(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.db
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
        });
    }
    ;
    static getUserTotalPosts(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = database_1.db
                    .selectFrom("posts")
                    .select((eb) => eb.fn.count("posts.post_id").as("count"))
                    .where("user_id", "=", user_id);
                const { count } = yield database_1.db
                    .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
                    .executeTakeFirstOrThrow();
                return count;
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static newPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.db
                    .insertInto("posts")
                    .values(post)
                    .execute();
                return "Post has been posted";
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static editPost(post_id, post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.db
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
        });
    }
    ;
    static deletePost(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { image_id } = yield database_1.db
                    .selectFrom("posts")
                    .select(["image_id"])
                    .where("post_id", "=", post_id)
                    .executeTakeFirst();
                const status = yield cloudinary_1.default.v2.uploader.destroy(image_id);
                if (status.result !== "ok")
                    throw exception_1.default.badRequest("Delete image failed");
                yield database_1.db
                    .deleteFrom("posts")
                    .where("post_id", "=", post_id)
                    .executeTakeFirst();
                return "Delete post successfully";
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static getLikesCountForPost(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = database_1.db
                    .selectFrom("likes")
                    .select((eb) => eb.fn.count("likes.post_id").as("count"))
                    .where("likes.post_id", "=", post_id);
                const { count } = yield database_1.db
                    .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
                    .executeTakeFirstOrThrow();
                return count;
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static isUserLikePost(like) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.db
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
        });
    }
    ;
    static toggleUserLikeForPost(like) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.db
                    .insertInto("likes")
                    .values(like)
                    .execute();
                return "Like post successfully";
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
        });
    }
    ;
    static removeUserLikeForPost(like) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.db
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
        });
    }
    ;
}
;
exports.default = PostRepository;

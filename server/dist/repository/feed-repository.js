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
const database_1 = __importDefault(require("../database/database"));
const kysely_1 = require("kysely");
const database_2 = __importDefault(require("../exception/database"));
class FeedRepository {
    static getTotalFeed() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = database_1.default
                    .selectFrom("posts")
                    .select((eb) => eb.fn.countAll().as("count"))
                    .where((eb) => eb("post_date", ">", (0, kysely_1.sql) `DATE_SUB(CURDATE(), INTERVAL 3 DAY)`));
                const { count } = yield database_1.default
                    .selectNoFrom((eb) => [eb.fn.coalesce(query, eb.lit(0)).as("count")])
                    .executeTakeFirstOrThrow();
                return count;
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
        });
    }
    ;
    static getUserFeed(post_ids, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
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
                    "posts.post_date",
                    eb
                        .selectFrom("likes")
                        .select((eb) => eb.fn.count("likes.post_id").as("count"))
                        .whereRef("posts.post_id", "=", "likes.post_id")
                        .as("count"),
                ])
                    .where((eb) => eb.and([
                    eb("followers.follower_id", "=", user_id),
                    eb("posts.post_date", ">", (0, kysely_1.sql) `DATE_SUB(CURDATE(), INTERVAL 3 DAY)`),
                    eb("posts.post_id", "not in", post_ids),
                ]))
                    .orderBy((0, kysely_1.sql) `"RAND()"`)
                    .limit(3)
                    .execute();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
        });
    }
    ;
    static getExploreFeed(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.default
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
                "posts.post_date",
                eb
                    .selectFrom("likes")
                    .select((eb) => eb.fn.count("likes.post_id").as("count"))
                    .whereRef("posts.post_id", "=", "likes.post_id")
                    .as("count"),
            ])
                .where((eb) => eb.and([
                eb("posts.post_date", ">", (0, kysely_1.sql) `DATE_SUB(CURDATE(), INTERVAL 3 DAY)`),
                eb("followers.follower_id", "is", eb.lit(null)),
                eb("users.user_id", "!=", user_id),
            ]))
                .orderBy((0, kysely_1.sql) `"RAND()"`)
                .limit(3)
                .execute();
        });
    }
    ;
}
;
exports.default = FeedRepository;

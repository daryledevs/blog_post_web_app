"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/infrastructure/database/db.database"));
const follower_model_1 = __importDefault(require("@/domain/models/follower.model"));
const following_model_1 = __importDefault(require("@/domain/models/following.model"));
const kysely_1 = require("kysely");
const class_transformer_1 = require("class-transformer");
class FollowRepository {
    database;
    constructor() { this.database = db_database_1.default; }
    findUserFollowStatsById = async (id) => {
        const queryFollowers = this.database
            .selectFrom("followers")
            .innerJoin("users", "followers.followed_id", "users.id")
            .select((eb) => [eb.fn.count("followed_id").as("followers")])
            .where("followers.followed_id", "=", id)
            .groupBy("followers.followed_id");
        const queryFollowing = this.database
            .selectFrom("followers")
            .innerJoin("users", "followers.follower_id", "users.id")
            .select((eb) => eb.fn.count("followers.follower_id").as("following"))
            .where("followers.follower_id", "=", id)
            .groupBy("followers.follower_id");
        const { followers, following } = await this.database
            .selectNoFrom((eb) => [
            eb.fn.coalesce(queryFollowers, eb.lit(0)).as("followers"),
            eb.fn.coalesce(queryFollowing, eb.lit(0)).as("following"),
        ])
            .executeTakeFirstOrThrow();
        return { followers, following };
    };
    findAllFollowersById = async (id, followIds) => {
        const data = await this.database
            .selectFrom("followers")
            .leftJoin("users", "followers.follower_id", "users.id")
            .select([
            "followers.follower_id",
            (0, kysely_1.sql) `BIN_TO_UUID(users.uuid)`.as("follower_uuid"),
            "users.username",
            "users.first_name",
            "users.last_name",
            "users.avatar_url",
            "followers.created_at",
        ])
            .where((eb) => eb.and([
            eb("followers.followed_id", "=", id),
            eb("followers.follower_id", "not in", followIds),
        ]))
            .limit(10)
            .execute();
        return (0, class_transformer_1.plainToInstance)(follower_model_1.default, data);
    };
    findAllFollowingById = async (id, followIds) => {
        const data = await this.database
            .selectFrom("followers")
            .leftJoin("users", "followers.followed_id", "users.id")
            .select([
            "followers.followed_id",
            (0, kysely_1.sql) `BIN_TO_UUID(users.uuid)`.as("followed_uuid"),
            "users.username",
            "users.first_name",
            "users.last_name",
            "users.avatar_url",
            "followers.created_at",
        ])
            .where((eb) => eb.and([
            eb("followers.follower_id", "=", id),
            eb("followers.followed_id", "not in", followIds),
        ]))
            .limit(10)
            .execute();
        return (0, class_transformer_1.plainToInstance)(following_model_1.default, data);
    };
    isUserFollowing = async (identifier) => {
        const result = await this.database
            .selectFrom("followers")
            .selectAll()
            .where((eb) => eb.and([
            eb("follower_id", "=", identifier.follower_id),
            eb("followed_id", "=", identifier.followed_id),
        ]))
            .executeTakeFirst();
        return !!result;
    };
    followUser = async (identifier) => {
        await this.database.insertInto("followers").values(identifier).execute();
    };
    unfollowUser = async (identifier) => {
        await this.database
            .deleteFrom("followers")
            .where((eb) => eb.and([
            eb("follower_id", "=", identifier.follower_id),
            eb("followed_id", "=", identifier.followed_id),
        ]))
            .execute();
    };
}
;
exports.default = FollowRepository;

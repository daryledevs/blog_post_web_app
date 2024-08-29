"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/infrastructure/database/db.database"));
const user_model_1 = __importDefault(require("@/domain/models/user.model"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
const kysely_1 = require("kysely");
const class_transformer_1 = require("class-transformer");
class AuthRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    ;
    createUser = this.wrap.repoWrap(async (user) => {
        const { insertId } = await this.database
            .insertInto("users")
            .values(user)
            .executeTakeFirst();
        const newUser = await this.database
            .selectFrom("users")
            .select([
            "id",
            (0, kysely_1.sql) `BIN_TO_UUID(uuid)`.as("uuid"),
            "username",
            "email",
            "password",
            "roles",
            "avatar_url",
            "first_name",
            "last_name",
            "birthday",
            "age",
            "created_at",
        ])
            .where("id", "=", insertId)
            .executeTakeFirst();
        return this.plainToClass(newUser);
    });
    findResetTokenById = this.wrap.repoWrap(async (token_id) => {
        return await this.database
            .selectFrom("reset_password_token")
            .select([
            "id",
            (0, kysely_1.sql) `BIN_TO_UUID(uuid)`.as("uuid"),
            "encrypted",
            "reference_token",
            "created_at",
        ])
            .where("reference_token", "=", token_id)
            .executeTakeFirst();
    });
    saveResetToken = this.wrap.repoWrap(async (token) => {
        await this.database
            .insertInto("reset_password_token")
            .values(token)
            .execute();
    });
    deleteResetToken = this.wrap.repoWrap(async (token_id) => {
        await this.database
            .deleteFrom("reset_password_token")
            .where("reference_token", "=", token_id)
            .execute();
    });
    plainToClass = this.wrap.repoWrap(async (user) => {
        return user ? (0, class_transformer_1.plainToInstance)(user_model_1.default, user) : undefined;
    });
}
;
exports.default = AuthRepository;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const user_model_1 = __importDefault(require("@/model/user.model"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const class_transformer_1 = require("class-transformer");
const kysely_1 = require("kysely");
class UserRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    ;
    findUserById = this.wrap.repoWrap(async (uuid) => {
        const user = await this.database
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
            .where("uuid", "=", (0, kysely_1.sql) `UUID_TO_BIN(${uuid})`)
            .executeTakeFirst();
        return this.plainToModel(user);
    });
    findUserByUsername = this.wrap.repoWrap(async (username) => {
        const user = await this.database
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
            .select([(0, kysely_1.sql) `BIN_TO_UUID(uuid)`.as("uuid")])
            .where("username", "like", username + "%")
            .executeTakeFirst();
        return this.plainToModel(user);
    });
    searchUsersByQuery = this.wrap.repoWrap(async (search) => {
        const users = await this.database
            .selectFrom("users")
            .select([
            "id",
            (0, kysely_1.sql) `BIN_TO_UUID(users.uuid)`.as("uuid"),
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
            .where((eb) => eb.or([
            eb("username", "like", search + "%"),
            eb("first_name", "like", search + "%"),
            eb("last_name", "like", search + "%"),
            eb((0, kysely_1.sql) `
                concat(
                  ${eb.ref("first_name")}, "", 
                  ${eb.ref("last_name")}
                )
              `, "like", search + "%"),
        ]))
            .execute();
        return users.map((user) => (0, class_transformer_1.plainToInstance)(user_model_1.default, user));
    });
    findUserByEmail = this.wrap.repoWrap(async (email) => {
        const user = await this.database
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
            .where("email", "=", email)
            .executeTakeFirst();
        return this.plainToModel(user);
    });
    findUserByCredentials = this.wrap.repoWrap(async (userCredential) => {
        const user = await this.database
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
            .where((eb) => eb.or([
            eb("email", "=", userCredential),
            eb("username", "=", userCredential),
        ]))
            .executeTakeFirst();
        return this.plainToModel(user);
    });
    updateUserById = this.wrap.repoWrap(async (uuid, user) => {
        const updatedUser = await this.database
            .updateTable("users")
            .set(user)
            .where("uuid", "=", uuid)
            .executeTakeFirstOrThrow();
        return this.plainToModel(updatedUser);
    });
    deleteUserById = this.wrap.repoWrap(async (uuid) => {
        await this.database
            .deleteFrom("users")
            .where("uuid", "=", uuid)
            .execute();
    });
    plainToModel = (user) => {
        return user ? (0, class_transformer_1.plainToInstance)(user_model_1.default, user) : undefined;
    };
}
;
exports.default = UserRepository;

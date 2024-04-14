"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const kysely_1 = require("kysely");
class UserRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    ;
    findUserById = this.wrap.repoWrap(async (user_id) => {
        return await this.database
            .selectFrom("users")
            .where("user_id", "=", user_id)
            .selectAll()
            .executeTakeFirst();
    });
    findUserByUsername = this.wrap.repoWrap(async (username) => {
        return await this.database
            .selectFrom("users")
            .where("username", "like", username + "%")
            .selectAll()
            .executeTakeFirst();
    });
    searchUsersByQuery = this.wrap.repoWrap(async (search) => {
        return await this.database
            .selectFrom("users")
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
            .selectAll()
            .execute();
    });
    findUserByEmail = this.wrap.repoWrap(async (email) => {
        return await this.database
            .selectFrom("users")
            .where("email", "=", email)
            .selectAll()
            .executeTakeFirst();
    });
    findUserByCredentials = this.wrap.repoWrap(async (userCredential) => {
        return await this.database
            .selectFrom("users")
            .selectAll()
            .where((eb) => eb.or([
            eb("email", "=", userCredential),
            eb("username", "=", userCredential),
        ]))
            .executeTakeFirst();
    });
    updateUser = this.wrap.repoWrap(async (user_id, user) => {
        return (await this.database
            .updateTable("users")
            .set(user)
            .where("user_id", "=", user_id)
            .executeTakeFirstOrThrow());
    });
    deleteUser = this.wrap.repoWrap(async (user_id) => {
        await this.database
            .deleteFrom("users")
            .where("user_id", "=", user_id)
            .execute();
    });
}
;
exports.default = UserRepository;

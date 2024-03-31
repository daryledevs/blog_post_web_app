"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("@/database/database"));
const kysely_1 = require("kysely");
const database_2 = __importDefault(require("@/exception/database"));
class UserRepository {
    async findUserById(user_id) {
        try {
            const result = await database_1.default
                .selectFrom("users")
                .where("user_id", "=", user_id)
                .selectAll()
                .executeTakeFirst();
            return result;
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
    }
    async findUserByUsername(username) {
        try {
            return await database_1.default
                .selectFrom("users")
                .where("username", "like", username + "%")
                .selectAll()
                .executeTakeFirst();
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
    }
    async searchUsersByQuery(search) {
        try {
            return await database_1.default
                .selectFrom("users")
                .where((eb) => eb.or([
                eb("username", "=", search + "%"),
                eb("first_name", "=", search + "%"),
                eb("last_name", "=", search + "%"),
                eb((0, kysely_1.sql) `
                concat(
                  ${eb.ref("first_name")}, "", 
                  ${eb.ref("last_name")}
                )
              `, "=", search + "%"),
            ]))
                .selectAll()
                .execute();
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
    }
    async findUserByEmail(email) {
        try {
            return await database_1.default
                .selectFrom("users")
                .where("email", "=", email)
                .selectAll()
                .executeTakeFirst();
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
    }
    async findUserByCredentials(userCredential) {
        try {
            return await database_1.default
                .selectFrom("users")
                .selectAll()
                .where((eb) => eb.or([
                eb("email", "=", userCredential),
                eb("username", "=", userCredential),
            ]))
                .executeTakeFirst();
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
    }
    async updateUser(user_id, user) {
        try {
            await database_1.default
                .updateTable("users")
                .set(user)
                .where("user_id", "=", user_id)
                .executeTakeFirstOrThrow();
            return await this.findUserById(user_id);
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
    }
    async deleteUser(user_id) {
        try {
            await database_1.default.deleteFrom("users").where("user_id", "=", user_id).execute();
            return "User deleted successfully";
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
    }
}
;
exports.default = UserRepository;

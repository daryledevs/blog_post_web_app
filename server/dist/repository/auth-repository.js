"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
const user_repository_1 = __importDefault(require("./user-repository"));
const database_2 = __importDefault(require("../exception/database"));
class AuthRepository {
    static async createUser(user) {
        try {
            const { insertId } = await database_1.default
                .insertInto("users")
                .values(user)
                .executeTakeFirstOrThrow();
            return await user_repository_1.default.findUserById(Number(insertId));
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    static async findResetTokenById(token_id) {
        try {
            return await database_1.default
                .selectFrom("reset_password_token")
                .selectAll()
                .where("token_id", "=", token_id)
                .executeTakeFirst();
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    static async saveResetToken(token) {
        try {
            await database_1.default
                .insertInto("reset_password_token")
                .values(token)
                .execute();
            return "Reset token is saved successfully";
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
    static async deleteResetToken(token_id) {
        try {
            await database_1.default
                .deleteFrom("reset_password_token")
                .where("token_id", "=", token_id)
                .execute();
            return "Reset token is saved successfully";
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
        ;
    }
    ;
}
;
exports.default = AuthRepository;

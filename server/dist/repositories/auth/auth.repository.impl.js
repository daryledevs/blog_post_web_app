"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const user_repository_impl_1 = __importDefault(require("../user/user.repository.impl"));
const database_exception_1 = __importDefault(require("@/exceptions/database.exception"));
class AuthRepository {
    database;
    userRepository;
    constructor() {
        this.database = db_database_1.default;
        this.userRepository = new user_repository_impl_1.default();
    }
    ;
    async createUser(user) {
        try {
            const { insertId } = await this.database
                .insertInto("users")
                .values(user)
                .executeTakeFirstOrThrow();
            return await this.userRepository.findUserById(Number(insertId));
        }
        catch (error) {
            throw database_exception_1.default.fromError(error);
        }
    }
    async findResetTokenById(token_id) {
        try {
            return await this.database
                .selectFrom("reset_password_token")
                .selectAll()
                .where("token_id", "=", token_id)
                .executeTakeFirst();
        }
        catch (error) {
            throw database_exception_1.default.fromError(error);
        }
    }
    async saveResetToken(token) {
        try {
            await this.database.insertInto("reset_password_token").values(token).execute();
            return "Reset token is saved successfully";
        }
        catch (error) {
            throw database_exception_1.default.fromError(error);
        }
    }
    async deleteResetToken(token_id) {
        try {
            await this.database
                .deleteFrom("reset_password_token")
                .where("token_id", "=", token_id)
                .execute();
            return "Reset token is saved successfully";
        }
        catch (error) {
            throw database_exception_1.default.fromError(error);
        }
    }
}
;
exports.default = AuthRepository;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const user_repository_impl_1 = __importDefault(require("../user/user.repository.impl"));
class AuthRepository {
    database;
    userRepository;
    wrap = new async_wrapper_util_1.default();
    constructor() {
        this.database = db_database_1.default;
        this.userRepository = new user_repository_impl_1.default();
    }
    ;
    createUser = this.wrap.repoWrap(async (user) => {
        const { insertId } = await this.database
            .insertInto("users")
            .values(user)
            .executeTakeFirstOrThrow();
        return await this.userRepository.findUserById(Number(insertId));
    });
    findResetTokenById = this.wrap.repoWrap(async (token_id) => {
        return await this.database
            .selectFrom("reset_password_token")
            .selectAll()
            .where("token_id", "=", token_id)
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
            .where("token_id", "=", token_id)
            .execute();
    });
}
;
exports.default = AuthRepository;

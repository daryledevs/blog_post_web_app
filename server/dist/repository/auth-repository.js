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
const user_repository_1 = __importDefault(require("./user-repository"));
const database_2 = __importDefault(require("../exception/database"));
class AuthRepository {
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { insertId } = yield database_1.default
                    .insertInto("users")
                    .values(user)
                    .executeTakeFirstOrThrow();
                return yield user_repository_1.default.findUserById(Number(insertId));
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static findResetTokenById(token_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
                    .selectFrom("reset_password_token")
                    .selectAll()
                    .where("token_id", "=", token_id)
                    .executeTakeFirst();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static saveResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default
                    .insertInto("reset_password_token")
                    .values(token)
                    .execute();
                return "Reset token is saved successfully";
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static deleteResetToken(token_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default
                    .deleteFrom("reset_password_token")
                    .where("token_id", "=", token_id)
                    .execute();
                return "Reset token is saved successfully";
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
}
;
exports.default = AuthRepository;

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
const database_2 = __importDefault(require("../exception/database"));
class ChatRepository {
    static getUserConversationHistoryByUserId(user_id, conversations) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
                    .selectFrom("conversations")
                    .select([
                    "conversations.conversation_id",
                    "conversations.user_one_id",
                    "conversations.user_two_id",
                ])
                    .leftJoin((eb) => eb
                    .selectFrom("users")
                    .select([
                    "users.user_id",
                    "users.username",
                    "users.first_name",
                    "users.last_name",
                    "users.avatar_url",
                ])
                    .as("users"), (join) => join.onRef("users.user_id", "=", (eb) => eb
                    .case()
                    .when("conversations.user_one_id", "=", user_id)
                    .then(eb.ref("conversations.user_two_id"))
                    .else(eb.ref("conversations.user_one_id"))
                    .end()))
                    .selectAll("users")
                    .where("conversations.conversation_id", "not in", conversations)
                    .execute();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
        });
    }
    ;
    static getHistoryByConversationId(conversation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
                    .selectFrom("conversations")
                    .selectAll()
                    .where("conversation_id", "=", conversation_id)
                    .executeTakeFirst();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
        });
    }
    ;
    static findConversationByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
                    .selectFrom("conversations")
                    .select([
                    "conversations.conversation_id",
                    "conversations.user_one_id",
                    "conversations.user_two_id",
                ])
                    .where((eb) => eb.or([
                    eb("conversations.user_one_id", "=", user_id[0])
                        .and("conversations.user_two_id", "=", user_id[1]),
                    eb("conversations.user_one_id", "=", user_id[2])
                        .and("conversations.user_two_id", "=", user_id[3]),
                ]))
                    .executeTakeFirst();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static getMessagesByConversationId(conversation_id, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
                    .selectFrom("messages")
                    .selectAll()
                    .where((eb) => eb.and([
                    eb("conversation_id", "=", conversation_id),
                    eb("message_id", "not in", ids),
                ]))
                    .limit(10)
                    .execute();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static saveNewConversation(conversation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { insertId } = yield database_1.default
                    .insertInto("conversations")
                    .values(conversation)
                    .executeTakeFirst();
                return insertId;
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static saveNewMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default
                    .insertInto("messages")
                    .values(message)
                    .executeTakeFirst();
                return "New message created";
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
exports.default = ChatRepository;

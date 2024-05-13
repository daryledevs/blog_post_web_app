"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
class ChatsRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    ;
    getUserConversationHistoryByUserId = this.wrap.repoWrap(async (user_id, conversations) => {
        return await this.database
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
    });
    findConversationById = this.wrap.repoWrap(async (conversation_id) => {
        return await this.database
            .selectFrom("conversations")
            .selectAll()
            .where("conversation_id", "=", conversation_id)
            .executeTakeFirst();
    });
    findConversationByUserId = this.wrap.repoWrap(async (user_id) => {
        return await this.database
            .selectFrom("conversations")
            .select([
            "conversations.conversation_id",
            "conversations.user_one_id",
            "conversations.user_two_id",
        ])
            .where((eb) => eb.or([
            eb("conversations.user_one_id", "=", user_id[0]).and("conversations.user_two_id", "=", user_id[1]),
            eb("conversations.user_one_id", "=", user_id[2]).and("conversations.user_two_id", "=", user_id[3]),
        ]))
            .executeTakeFirst();
    });
    getMessagesById = this.wrap.repoWrap(async (conversation_id, ids) => {
        return await this.database
            .selectFrom("messages")
            .selectAll()
            .where((eb) => eb.and([
            eb("conversation_id", "=", conversation_id),
            eb("message_id", "not in", ids),
        ]))
            .limit(10)
            .execute();
    });
    saveNewConversation = this.wrap.repoWrap(async (conversation) => {
        const { insertId } = await this.database
            .insertInto("conversations")
            .values(conversation)
            .executeTakeFirst();
        return insertId;
    });
    saveNewMessage = this.wrap.repoWrap(async (message) => {
        await this.database
            .insertInto("messages")
            .values(message)
            .executeTakeFirst();
    });
    deleteConversationById = this.wrap.repoWrap(async (conversation_id) => {
        await this.database
            .deleteFrom("conversations")
            .where("conversation_id", "=", conversation_id)
            .execute();
    });
}
;
exports.default = ChatsRepository;

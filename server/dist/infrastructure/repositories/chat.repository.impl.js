"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/infrastructure/database/db.database"));
const chat_model_1 = __importDefault(require("@/domain/models/chat.model"));
const conversation_model_1 = __importDefault(require("@/domain/models/conversation.model"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
const uuid_to_bin_1 = __importDefault(require("@/application/utils/uuid-to-bin"));
const kysely_1 = require("kysely");
const class_transformer_1 = require("class-transformer");
class ChatsRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    ;
    // this returns a list of the history of people who have communicated
    findAllConversationByUserId = this.wrap.repoWrap(async (user_id, conversation_uuids) => {
        const uuidToBin = (0, uuid_to_bin_1.default)(conversation_uuids);
        const conversations = await this.database
            .selectFrom("conversations as c")
            .select(["c.id", (0, kysely_1.sql) `BIN_TO_UUID(c.uuid)`.as("uuid")])
            .leftJoin((eb) => eb
            .selectFrom("conversation_members as cm")
            .select(["cm.conversation_id", "cm.user_id"])
            .as("cm"), (join) => join.onRef("cm.conversation_id", "=", "c.id"))
            .leftJoin((eb) => eb
            .selectFrom("users as u")
            .select([
            "u.id",
            "u.username",
            "u.first_name",
            "u.last_name",
            "u.avatar_url",
        ])
            .as("user"), (join) => join
            .onRef("user.id", "=", "cm.user_id")
            .on("user.id", "!=", user_id))
            .where((eb) => eb.and([
            eb("cm.user_id", "=", user_id),
            eb("c.uuid", "not in", uuidToBin),
        ]))
            .select([
            (0, kysely_1.sql) `BIN_TO_UUID(user.uuid)`.as("user_uuid"),
            "user.username",
            "user.first_name",
            "user.last_name",
            "user.avatar_url",
        ])
            .execute();
        return (0, class_transformer_1.plainToInstance)(conversation_model_1.default, conversations);
    });
    // this return lists of messages 
    findAllMessagesById = this.wrap.repoWrap(async (conversation_id, message_uuids) => {
        const uuidsToBin = (0, uuid_to_bin_1.default)(message_uuids);
        const chats = await this.database
            .selectFrom("messages")
            .leftJoin("conversations as c", "messages.conversation_id", "c.id")
            .select([
            "id",
            (0, kysely_1.sql) `BIN_TO_UUID(u.uuid)`.as("uuid"),
            "conversation_id",
            (0, kysely_1.sql) `BIN_TO_UUID(c.uuid)`.as("conversation_uuid"),
            (0, kysely_1.sql) `BIN_TO_UUID(u.uuid)`.as("uuid"),
            "sender_id",
            (0, kysely_1.sql) `BIN_TO_UUID(sender.uuid)`.as("sender_uuid"),
            "text_message",
            "time_sent",
        ])
            .where((eb) => eb.and([
            eb("conversation_id", "=", conversation_id),
            eb("uuid", "not in", uuidsToBin),
        ]))
            .limit(30)
            .orderBy("messages.id", "desc")
            .execute();
        return (0, class_transformer_1.plainToInstance)(chat_model_1.default, chats);
    });
    findOneConversationById = this.wrap.repoWrap(async (uuid) => {
        const conversation = await this.database
            .selectFrom("conversations")
            .select(["id", (0, kysely_1.sql) `BIN_TO_BINARY(uuid)`.as("uuid"), "created_at"])
            .where("uuid", "=", (0, kysely_1.sql) `UUID_TO_BIN(${uuid})`)
            .executeTakeFirst();
        return (0, class_transformer_1.plainToInstance)(conversation_model_1.default, conversation);
    });
    findOneConversationByMembersId = this.wrap.repoWrap(async (member_id) => {
        const conversation = await this.database
            .selectFrom("conversations as c")
            .select(["c.id", (0, kysely_1.sql) `BIN_TO_BINARY(c.uuid)`.as("uuid"), "c.created_at"])
            .leftJoin((eb) => eb
            .selectFrom("conversation_members as cm")
            .select([
            "cm.id",
            (0, kysely_1.sql) `BIN_TO_UUID(cm.uuid)`.as("uuid"),
            "cm.conversation_id",
            "cm.user_id",
        ])
            .as("cm"), (join) => join.onRef("cm.conversation_id", "=", "c.id"))
            .leftJoin((eb) => eb
            .selectFrom("users as u")
            .select(["u.id", (0, kysely_1.sql) `BIN_TO_UUID(u.uuid)`.as("uuid")])
            .as("u"), (join) => join.onRef("u.id", "=", "cm.user_id"))
            .where("u.id", "in", member_id)
            .executeTakeFirst();
        return (0, class_transformer_1.plainToInstance)(conversation_model_1.default, conversation);
    });
    // never used
    findOneMessageById = this.wrap.repoWrap(async (uuid) => {
        const chat = await this.database
            .selectFrom("messages")
            .select([
            "id",
            (0, kysely_1.sql) `BIN_TO_BINARY(uuid)`.as("uuid"),
            "conversation_id",
            "sender_id",
            (0, kysely_1.sql) `BIN_TO_UUID(user.uuid)`.as("user_uuid"),
            "text_message",
            "time_sent",
        ])
            .where("uuid", "=", (0, kysely_1.sql) `UUID_TO_BIN(${uuid})`)
            .executeTakeFirst();
        return (0, class_transformer_1.plainToInstance)(chat_model_1.default, chat);
    });
    saveNewConversation = this.wrap.repoWrap(async (conversation) => {
        const { insertId } = await this.database
            .insertInto("conversations")
            .values(conversation)
            .executeTakeFirst();
        return insertId;
    });
    saveMultipleChatMembers = this.wrap.repoWrap(async (members) => {
        await this.database
            .insertInto("conversation_members")
            .values(members)
            .execute();
    });
    saveNewChatMember = this.wrap.repoWrap(async (members) => {
        await this.database
            .insertInto("conversation_members")
            .values(members)
            .execute();
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
            .where("id", "=", conversation_id)
            .execute();
    });
}
;
exports.default = ChatsRepository;

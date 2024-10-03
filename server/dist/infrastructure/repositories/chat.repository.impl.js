"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/infrastructure/database/db.database"));
const chat_model_1 = __importDefault(require("@/domain/models/chat.model"));
const conversation_model_1 = __importDefault(require("@/domain/models/conversation.model"));
const uuid_to_bin_1 = __importDefault(require("@/application/utils/uuid-to-bin"));
const kysely_1 = require("kysely");
const class_transformer_1 = require("class-transformer");
class ChatsRepository {
    database;
    constructor() { this.database = db_database_1.default; }
    // this returns a list of the history of people who have communicated
    findAllConversationByUserId = async (userId, conversationUuids) => {
        const uuidToBin = (0, uuid_to_bin_1.default)(conversationUuids);
        const conversations = await this.database
            .selectFrom("conversations as c")
            .leftJoin((eb) => eb
            .selectFrom("conversation_members as cm")
            .select(["cm.conversation_id", "cm.user_id"])
            .as("cm"), (join) => join.onRef("cm.conversation_id", "=", "c.id"))
            .leftJoin((eb) => eb
            .selectFrom("users as u")
            .select([
            "u.id",
            (0, kysely_1.sql) `BIN_TO_UUID(u.uuid)`.as("user_uuid"),
            "u.username",
            "u.first_name",
            "u.last_name",
            "u.avatar_url",
        ])
            .as("user"), (join) => join.onRef("user.id", "=", "cm.user_id"))
            .where((eb) => eb.and([
            eb("cm.user_id", "!=", userId),
            eb("c.uuid", "not in", uuidToBin),
        ]))
            .select([
            "c.id",
            (0, kysely_1.sql) `BIN_TO_UUID(c.uuid)`.as("uuid"),
            "user_uuid",
            "user.username",
            "user.first_name",
            "user.last_name",
            "user.avatar_url",
        ])
            .execute();
        return (0, class_transformer_1.plainToInstance)(conversation_model_1.default, conversations);
    };
    // this return lists of messages
    findAllMessagesById = async (conversationId, messageUuids) => {
        const uuidsToBin = (0, uuid_to_bin_1.default)(messageUuids);
        const chats = await this.database
            .selectFrom("messages as m")
            .leftJoin("conversations as c", "m.conversation_id", "c.id")
            .leftJoin("users as sender", "m.sender_id", "sender.id")
            .select([
            "m.id",
            (0, kysely_1.sql) `BIN_TO_UUID(m.uuid)`.as("uuid"),
            "m.conversation_id",
            (0, kysely_1.sql) `BIN_TO_UUID(c.uuid)`.as("conversation_uuid"),
            "sender_id",
            (0, kysely_1.sql) `BIN_TO_UUID(sender.uuid)`.as("sender_uuid"),
            "sender.username",
            "sender.first_name",
            "sender.last_name",
            "sender.avatar_url",
            "m.text_message",
            "m.time_sent",
        ])
            .where((eb) => eb.and([
            eb("conversation_id", "=", conversationId),
            eb("m.uuid", "not in", uuidsToBin),
        ]))
            .limit(30)
            .orderBy("m.id", "desc")
            .execute();
        return (0, class_transformer_1.plainToInstance)(chat_model_1.default, chats);
    };
    findOneConversationByUuId = async (uuid) => {
        const conversation = await this.database
            .selectFrom("conversations as c")
            .leftJoin((eb) => eb
            .selectFrom("conversation_members")
            .select(["conversation_id", "user_id"])
            .as("cm"), (join) => join.onRef("c.id", "=", "cm.conversation_id"))
            .leftJoin("users", "cm.user_id", "users.id")
            .select([
            "c.id",
            (0, kysely_1.sql) `BIN_TO_UUID(c.uuid)`.as("uuid"),
            (0, kysely_1.sql) `BIN_TO_UUID(users.uuid)`.as("user_uuid"),
            "users.username",
            "users.first_name",
            "users.last_name",
            "users.avatar_url",
            "c.created_at",
        ])
            .where("c.uuid", "=", (0, kysely_1.sql) `UUID_TO_BIN(${uuid})`)
            .executeTakeFirst();
        return (0, class_transformer_1.plainToInstance)(conversation_model_1.default, conversation);
    };
    findOneConversationByMembersId = async (memberIds) => {
        const conversation = await this.database
            .selectFrom("conversations as c")
            .leftJoin((eb) => eb
            .selectFrom("conversation_members as cm")
            .leftJoin("users as u", "cm.user_id", "u.id")
            .select([
            "cm.id as cm_id",
            (0, kysely_1.sql) `BIN_TO_UUID(cm.uuid)`.as("cm_uuid"),
            "conversation_id",
            "cm.user_id",
            "u.username",
            "u.first_name",
            "u.last_name",
            "u.avatar_url",
        ])
            .where("u.id", "in", memberIds)
            .as("cm"), (join) => join.onRef("conversation_id", "=", "id"))
            .select([
            "c.id",
            (0, kysely_1.sql) `BIN_TO_UUID(c.uuid)`.as("uuid"),
            "cm.username",
            "cm.user_id",
            "cm.first_name",
            "cm.last_name",
            "cm.avatar_url",
            "c.created_at",
        ])
            .executeTakeFirst();
        return (0, class_transformer_1.plainToInstance)(conversation_model_1.default, conversation);
    };
    // never used
    findOneMessageById = async (uuid) => {
        const chat = await this.database
            .selectFrom("messages")
            .leftJoin("users as user", "messages.sender_id", "user.id")
            .select([
            "id",
            (0, kysely_1.sql) `BIN_TO_UUID(uuid)`.as("uuid"),
            "conversation_id",
            "sender_id",
            (0, kysely_1.sql) `BIN_TO_UUID(user.uuid)`.as("user_uuid"),
            "user.username",
            "user.first_name",
            "user.last_name",
            "user.avatar_url",
            "text_message",
            "time_sent",
        ])
            .where("uuid", "=", (0, kysely_1.sql) `UUID_TO_BIN(${uuid})`)
            .executeTakeFirst();
        return (0, class_transformer_1.plainToInstance)(chat_model_1.default, chat);
    };
    saveNewConversation = async (conversation) => {
        const { insertId } = await this.database
            .insertInto("conversations")
            .values(conversation)
            .executeTakeFirst();
        return insertId;
    };
    saveMultipleChatMembers = async (chatMembers) => {
        await this.database
            .insertInto("conversation_members")
            .values(chatMembers)
            .execute();
    };
    saveNewChatMember = async (members) => {
        await this.database
            .insertInto("conversation_members")
            .values(members)
            .execute();
    };
    saveNewMessage = async (message) => {
        await this.database
            .insertInto("messages")
            .values(message)
            .executeTakeFirst();
    };
    deleteConversationById = async (conversationId) => {
        await this.database
            .deleteFrom("conversations")
            .where("id", "=", conversationId)
            .execute();
    };
}
exports.default = ChatsRepository;

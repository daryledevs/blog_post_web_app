import {
  NewChatMembers,
  NewConversations,
  NewMessages,
}                          from "@/domain/types/table.types";
import db                  from "@/infrastructure/database/db.database";
import Chat                from "@/domain/models/chat.model";
import { DB }              from "@/domain/types/schema.types";
import Conversation        from "@/domain/models/conversation.model";
import sqlUuidsToBin       from "@/application/utils/uuid-to-bin";
import { Kysely, sql }     from "kysely";
import IEChatRepository    from "@/domain/repositories/chat.repository";
import { plainToInstance } from "class-transformer";

class ChatsRepository implements IEChatRepository {
  private database: Kysely<DB>;

  constructor() { this.database = db;  }

  // this returns a list of the history of people who have communicated
  public findAllConversationByUserId = async (
    userId: number,
    conversationIds: string[]
  ): Promise<Conversation[]> => {
    const uuidToBin = sqlUuidsToBin(conversationIds);

    const conversations = await this.database
      .selectFrom("conversations as c")
      .select(["c.id", sql`BIN_TO_UUID(c.uuid)`.as("uuid")])
      .leftJoin(
        (eb) =>
          eb
            .selectFrom("conversation_members as cm")
            .select(["cm.conversation_id", "cm.user_id"])
            .as("cm"),
        (join) => join.onRef("cm.conversation_id", "=", "c.id")
      )
      .leftJoin(
        (eb) =>
          eb
            .selectFrom("users as u")
            .select([
              "u.id",
              "u.username",
              "u.first_name",
              "u.last_name",
              "u.avatar_url",
            ])
            .as("user"),
        (join) =>
          join.onRef("user.id", "=", "cm.user_id").on("user.id", "!=", userId)
      )
      .where((eb) =>
        eb.and([
          eb("cm.user_id", "=", userId),
          eb("c.uuid", "not in", uuidToBin),
        ])
      )
      .select([
        sql`BIN_TO_UUID(user.uuid)`.as("user_uuid"),
        "user.username",
        "user.first_name",
        "user.last_name",
        "user.avatar_url",
      ])
      .execute();

    return plainToInstance(Conversation, conversations);
  };

  // this return lists of messages
  public findAllMessagesById = async (
    conversationId: number,
    messageUuids: string[]
  ): Promise<Chat[]> => {
    const uuidsToBin = sqlUuidsToBin(messageUuids);

    const chats = await this.database
      .selectFrom("messages")
      .leftJoin("conversations as c", "messages.conversation_id", "c.id")
      .select([
        "id",
        sql`BIN_TO_UUID(u.uuid)`.as("uuid"),
        "conversation_id",
        sql`BIN_TO_UUID(c.uuid)`.as("conversation_uuid"),
        sql`BIN_TO_UUID(u.uuid)`.as("uuid"),
        "sender_id",
        sql`BIN_TO_UUID(sender.uuid)`.as("sender_uuid"),
        "text_message",
        "time_sent",
      ])
      .where((eb) =>
        eb.and([
          eb("conversation_id", "=", conversationId),
          eb("uuid", "not in", uuidsToBin),
        ])
      )
      .limit(30)
      .orderBy("messages.id", "desc")
      .execute();

    return plainToInstance(Chat, chats);
  };

  public findOneConversationByUuId = async (
    uuid: string
  ): Promise<Conversation | undefined> => {
    const conversation = await this.database
      .selectFrom("conversations")
      .select(["id", sql`BIN_TO_BINARY(uuid)`.as("uuid"), "created_at"])
      .where("uuid", "=", sql`UUID_TO_BIN(${uuid})`)
      .executeTakeFirst();

    return plainToInstance(Conversation, conversation);
  };

  public findOneConversationByMembersId = async (
    memberIds: number[]
  ): Promise<Conversation | undefined> => {
    const conversation = await this.database
      .selectFrom("conversations as c")
      .select(["c.id", sql`BIN_TO_BINARY(c.uuid)`.as("uuid"), "c.created_at"])
      .leftJoin(
        (eb) =>
          eb
            .selectFrom("conversation_members as cm")
            .select([
              "cm.id",
              sql`BIN_TO_UUID(cm.uuid)`.as("uuid"),
              "cm.conversation_id",
              "cm.user_id",
            ])
            .as("cm"),
        (join) => join.onRef("cm.conversation_id", "=", "c.id")
      )
      .leftJoin(
        (eb) =>
          eb
            .selectFrom("users as u")
            .select(["u.id", sql`BIN_TO_UUID(u.uuid)`.as("uuid")])
            .as("u"),
        (join) => join.onRef("u.id", "=", "cm.user_id")
      )
      .where("u.id", "in", memberIds)
      .executeTakeFirst();

    return plainToInstance(Conversation, conversation);
  };

  // never used
  public findOneMessageById = async (
    uuid: string
  ): Promise<Chat | undefined> => {
    const chat = await this.database
      .selectFrom("messages")
      .select([
        "id",
        sql`BIN_TO_BINARY(uuid)`.as("uuid"),
        "conversation_id",
        "sender_id",
        sql`BIN_TO_UUID(user.uuid)`.as("user_uuid"),
        "text_message",
        "time_sent",
      ])
      .where("uuid", "=", sql`UUID_TO_BIN(${uuid})`)
      .executeTakeFirst();

    return plainToInstance(Chat, chat);
  };

  public saveNewConversation = async (
    conversation: NewConversations
  ): Promise<number | bigint | undefined> => {
    const { insertId } = await this.database
      .insertInto("conversations")
      .values(conversation)
      .executeTakeFirst();

    return insertId;
  };

  public saveMultipleChatMembers = async (
    chatMembers: NewChatMembers[]
  ): Promise<void> => {
    await this.database
      .insertInto("conversation_members")
      .values(chatMembers)
      .execute();
  };

  public saveNewChatMember = async (members: NewChatMembers): Promise<void> => {
    await this.database
      .insertInto("conversation_members")
      .values(members)
      .execute();
  };

  public saveNewMessage = async (message: NewMessages): Promise<void> => {
    await this.database
      .insertInto("messages")
      .values(message)
      .executeTakeFirst();
  };

  public deleteConversationById = async (
    conversationId: number
  ): Promise<void> => {
    await this.database
      .deleteFrom("conversations")
      .where("id", "=", conversationId)
      .execute();
  };
};

export default ChatsRepository;
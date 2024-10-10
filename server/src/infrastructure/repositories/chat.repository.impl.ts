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
import IChatRepository     from "@/domain/repositories/chat.repository";
import { plainToInstance } from "class-transformer";

class ChatsRepository implements IChatRepository {
  private database: Kysely<DB>;

  constructor() { this.database = db; }

  // this returns a list of the history of people who have communicated
  public findAllConversationByUserId = async (
    userId: number,
    conversationUuids: string[]
  ): Promise<Conversation[]> => {
    const uuidToBin = sqlUuidsToBin(conversationUuids);

    const conversations = await this.database
      .selectFrom("conversations as c")
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
              sql`BIN_TO_UUID(u.uuid)`.as("user_uuid"),
              "u.username",
              "u.first_name",
              "u.last_name",
              "u.avatar_url",
            ])
            .as("user"),
        (join) =>
          join.onRef("user.id", "=", "cm.user_id")
      )
      .where((eb) =>
        eb.and([
          eb("cm.user_id", "!=", userId),
          eb("c.uuid", "not in", uuidToBin),
        ])
      )
      .select([
        "c.id", 
        sql`BIN_TO_UUID(c.uuid)`.as("uuid"),
        "user_uuid",
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
      .selectFrom("messages as m")
      .leftJoin("conversations as c", "m.conversation_id", "c.id")
      .leftJoin("users as sender", "m.sender_id", "sender.id")
      .select([
        "m.id",
        sql`BIN_TO_UUID(m.uuid)`.as("uuid"),
        "m.conversation_id",
        sql`BIN_TO_UUID(c.uuid)`.as("conversation_uuid"),
        "sender_id",
        sql`BIN_TO_UUID(sender.uuid)`.as("sender_uuid"),
        "sender.username",
        "sender.first_name",
        "sender.last_name",
        "sender.avatar_url",
        "m.text_message",
        "m.time_sent",
      ])
      .where((eb) =>
        eb.and([
          eb("conversation_id", "=", conversationId),
          eb("m.uuid", "not in", uuidsToBin),
        ])
      )
      .limit(30)
      .orderBy("m.id", "desc")
      .execute();

    return plainToInstance(Chat, chats);
  };

  public findOneConversationByUuId = async (
    uuid: string
  ): Promise<Conversation | undefined> => {
    const conversation = await this.database
      .selectFrom("conversations as c")
      .leftJoin(
        (eb) =>
          eb
            .selectFrom("conversation_members")
            .select(["conversation_id", "user_id"])
            .as("cm"),
        (join) => join.onRef("c.id", "=", "cm.conversation_id")
      )
      .leftJoin("users", "cm.user_id", "users.id")
      .select([
        "c.id",
        sql`BIN_TO_UUID(c.uuid)`.as("uuid"),
        sql`BIN_TO_UUID(users.uuid)`.as("user_uuid"),
        "users.username",
        "users.first_name",
        "users.last_name",
        "users.avatar_url",
        "c.created_at",
      ])
      .where("c.uuid", "=", sql`UUID_TO_BIN(${uuid})`)
      .executeTakeFirst();

    return plainToInstance(Conversation, conversation);
  };

  public findOneConversationByMembersId = async (
    memberIds: number[]
  ): Promise<Conversation | undefined> => {
    const conversation = await this.database
      .selectFrom("conversations as c")
      .leftJoin(
        (eb) =>
          eb
            .selectFrom("conversation_members as cm")
            .leftJoin((eb) => 
              eb.selectFrom("users as u1")
                .select([
                  "u1.id",
                  sql`BIN_TO_UUID(u1.uuid)`.as("u1_uuid"),
                  "u1.username",
                  "u1.first_name",
                  "u1.last_name",
                  "u1.avatar_url",
                ])
                .as("u1"),
              (join) => join.on("u1.id", "=", memberIds[0]!)
            )
            .select([
              "cm.id as cm_id",
              sql`BIN_TO_UUID(cm.uuid)`.as("cm_uuid"),
              "cm.conversation_id",
              "cm.user_id",
              "u1.username",
              "u1.first_name",
              "u1.last_name",
              "u1.avatar_url",
            ])
            .where("cm.user_id", "=", memberIds[0]!)
            .as("cm1"),
        (join) => join.onRef("c.id", "=", "cm1.conversation_id")
      )
      .leftJoin(
        (eb) =>
          eb
            .selectFrom("conversation_members as cm")
            .leftJoin((eb) => 
              eb.selectFrom("users as u2")
                .select([
                  "u2.id",
                  sql`BIN_TO_UUID(u2.uuid)`.as("u2_uuid"),
                  "u2.username",
                  "u2.first_name",
                  "u2.last_name",
                  "u2.avatar_url",
                ])
                .as("u2"),
              (join) => join.on("u2.id", "=", memberIds[1]!)
            )
            .select([
              "cm.id as cm_id",
              sql`BIN_TO_UUID(cm.uuid)`.as("cm_uuid"),
              "cm.conversation_id",
              "cm.user_id",
              "u2.username",
              "u2.first_name",
              "u2.last_name",
              "u2.avatar_url",
            ])
            .where("cm.user_id", "=", memberIds[1]!)
            .as("cm2"),
        (join) => join.onRef("c.id", "=", "cm2.conversation_id")
      )
      .whereRef("cm1.conversation_id", "=", "cm2.conversation_id")
      .select([
        "c.id",
        sql`BIN_TO_UUID(c.uuid)`.as("uuid"),
        "c.created_at"
      ])
      .executeTakeFirst();

    return plainToInstance(Conversation, conversation);
  };

  // never used
  public findOneMessageById = async (
    uuid: string
  ): Promise<Chat | undefined> => {
    const chat = await this.database
      .selectFrom("messages")
      .leftJoin("users as user", "messages.sender_id", "user.id")
      .select([
        "id",
        sql`BIN_TO_UUID(uuid)`.as("uuid"),
        "conversation_id",
        "sender_id",
        sql`BIN_TO_UUID(user.uuid)`.as("user_uuid"),
        "user.username",
        "user.first_name",
        "user.last_name",
        "user.avatar_url",
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
}

export default ChatsRepository;

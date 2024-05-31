import {
  NewChatMembers,
  NewConversations,
  NewMessages,
  SelectConversations,
  SelectMessages,
}                                            from "@/types/table.types";
import db                                    from "@/database/db.database";
import { DB }                                from "@/types/schema.types";
import AsyncWrapper                          from "@/utils/async-wrapper.util";
import sqlUuidsToBin                         from "@/utils/uuid-to-bin";
import { Kysely, sql }                       from "kysely";
import IEChatRepository, { ChatHistoryType } from "./chat.repository";

class ChatsRepository implements IEChatRepository {
  private database: Kysely<DB>;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() {
    this.database = db;
  }

  public findAllConversationByUserId = this.wrap.repoWrap(
    async (
      user_id: number,
      conversation_uuids: string[]
    ): Promise<ChatHistoryType[]> => {
      const uuidToBin = sqlUuidsToBin(conversation_uuids);

      return await this.database
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
            join
              .onRef("user.id", "=", "cm.user_id")
              .on("user.id", "!=", user_id)
        )
        .where((eb) =>
          eb.and([
            eb("cm.user_id", "=", user_id),
            eb("c.uuid", "not in", uuidToBin),
          ])
        )
        .select([
          "user.username",
          "user.first_name",
          "user.last_name",
          "user.avatar_url",
        ])
        .execute();
    }
  );

  public findAllMessagesById = this.wrap.repoWrap(
    async (
      conversation_id: number,
      message_uuids: string[]
    ): Promise<SelectMessages[]> => {
      const uuidsToBin = sqlUuidsToBin(message_uuids);

      return await this.database
        .selectFrom("messages")
        .select([
          "id",
          sql`BIN_TO_UUID(u.uuid)`.as("uuid"),
          "conversation_id",
          "sender_id",
          "text_message",
          "time_sent",
        ])
        .where((eb) =>
          eb.and([
            eb("conversation_id", "=", conversation_id),
            eb("uuid", "not in", uuidsToBin),
          ])
        )
        .limit(30)
        .orderBy("messages.id", "desc")
        .execute();
    }
  );

  public findOneConversationById = this.wrap.repoWrap(
    async (uuid: string): Promise<SelectConversations | undefined> => {
      return await this.database
        .selectFrom("conversations")
        .select(["id", sql`BIN_TO_BINARY(uuid)`.as("uuid"), "created_at"])
        .where("uuid", "=", sql`UUID_TO_BIN(${uuid})`)
        .executeTakeFirst();
    }
  );

  public findOneConversationByMembersId = this.wrap.repoWrap(
    async (member_id: number[]): Promise<SelectConversations | undefined> => {
      return await this.database
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
        .where("u.id", "in", member_id)
        .executeTakeFirst();
    }
  );

  public findOneMessageById = this.wrap.repoWrap(
    async (uuid: string): Promise<SelectMessages | undefined> => {
      return await this.database
        .selectFrom("messages")
        .select([
          "id",
          sql`BIN_TO_BINARY(uuid)`.as("uuid"),
          "conversation_id",
          "sender_id",
          "text_message",
          "time_sent",
        ])
        .where("uuid", "=", sql`UUID_TO_BIN(${uuid})`)
        .executeTakeFirst();
    }
  );

  public saveNewConversation = this.wrap.repoWrap(
    async (conversation: NewConversations): Promise<number | bigint | undefined> => {
      const { insertId } = await this.database
        .insertInto("conversations")
        .values(conversation)
        .executeTakeFirst();

      return insertId;
    }
  );

  public saveMultipleChatMembers = this.wrap.repoWrap(
    async (members: NewChatMembers[]): Promise<void> => {
      await this.database
        .insertInto("conversation_members")
        .values(members)
        .execute();
    }
  );

  public saveNewChatMember = this.wrap.repoWrap(
    async (members: NewChatMembers): Promise<void> => {
      await this.database
        .insertInto("conversation_members")
        .values(members)
        .execute();
    }
  );

  public saveNewMessage = this.wrap.repoWrap(
    async (message: NewMessages): Promise<void> => {
      await this.database
        .insertInto("messages")
        .values(message)
        .executeTakeFirst();
    }
  );

  public deleteConversationById = this.wrap.repoWrap(
    async (conversation_id: number): Promise<void> => {
      await this.database
        .deleteFrom("conversations")
        .where("id", "=", conversation_id)
        .execute();
    }
  );
};

export default ChatsRepository;
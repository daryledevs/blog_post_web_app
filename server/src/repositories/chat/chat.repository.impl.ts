import {
  NewConversations,
  SelectConversations,
  SelectMessages,
}                                                                from "@/types/table.types";
import db                                                        from "@/database/db.database";
import { DB }                                                    from "@/types/schema.types";
import { Kysely }                                                from "kysely";
import DatabaseException                                         from "@/exceptions/database.exception";
import IChatRepository, { ChatHistoryByIdType, MessageDataType } from "./chat.repository";

class ChatsRepository implements IChatRepository {
  private database: Kysely<DB>;

  constructor() { this.database = db; };

  async getUserConversationHistoryByUserId(user_id: number, conversations: number[]): Promise<ChatHistoryByIdType[]> {
    try {
      return await this.database
        .selectFrom("conversations")
        .select([
          "conversations.conversation_id",
          "conversations.user_one_id",
          "conversations.user_two_id",
        ])
        .leftJoin(
          (eb) =>
            eb
              .selectFrom("users")
              .select([
                "users.user_id",
                "users.username",
                "users.first_name",
                "users.last_name",
                "users.avatar_url",
              ])
              .as("users"),
          (join) =>
            join.onRef("users.user_id", "=", (eb) =>
              eb
                .case()
                .when("conversations.user_one_id", "=", user_id)
                .then(eb.ref("conversations.user_two_id"))
                .else(eb.ref("conversations.user_one_id"))
                .end()
            )
        )
        .selectAll("users")
        .where("conversations.conversation_id", "not in", conversations)
        .execute();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  };

  async findConversationByConversationId(conversation_id: number): Promise<SelectConversations | undefined> {
    try {
      return await this.database
        .selectFrom("conversations")
        .selectAll()
        .where("conversation_id", "=", conversation_id)
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  };

  async findConversationByUserId(user_id: number[]): Promise<SelectConversations | undefined> {
    try {
      return await this.database
        .selectFrom("conversations")
        .select([
          "conversations.conversation_id",
          "conversations.user_one_id",
          "conversations.user_two_id",
        ])
        .where((eb) =>
          eb.or([
            eb("conversations.user_one_id",   "=", user_id[0] as number)
            .and("conversations.user_two_id", "=", user_id[1] as number),
            eb("conversations.user_one_id",   "=", user_id[2] as number)
            .and("conversations.user_two_id", "=", user_id[3] as number),
          ])
        )
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async getMessagesByConversationId(conversation_id: number, ids: number[] | number): Promise<SelectMessages[]> {
    try {
      return await this.database
        .selectFrom("messages")
        .selectAll()
        .where((eb) => eb.and([
          eb("conversation_id", "=", conversation_id),
          eb("message_id", "not in", ids),
        ]))
        .limit(10)
        .execute();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async saveNewConversation(conversation: NewConversations): Promise<bigint | undefined> {
    try {
      const { insertId } = await this.database
        .insertInto("conversations")
        .values(conversation)
        .executeTakeFirst();

      return insertId;
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async saveNewMessage(message: MessageDataType): Promise<string> {
    try {
      await this.database
        .insertInto("messages")
        .values(message)
        .executeTakeFirst();

      return "New message created";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async deleteConversation(conversation_id: number): Promise<string> {
    try {
      await this.database
        .deleteFrom("conversations")
        .where("conversation_id", "=", conversation_id)
        .execute();

      return "Conversation deleted";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };
};

export default ChatsRepository;
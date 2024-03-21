import {
  NewConversations,
  NewMessages,
  SelectConversations,
  SelectMessages,
}                                        from "../types/table.types";
import db                                from "../database/database";
import DatabaseException                 from "../exception/database";

class ChatRepository {
  static async getUserConversationHistoryByUserId(user_id: number, conversations: number[]): Promise<any> {
    try {
      return await db
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

  static async getHistoryByConversationId(conversation_id: number): Promise<SelectConversations | undefined> {
    try {
      return await db
        .selectFrom("conversations")
        .selectAll()
        .where("conversation_id", "=", conversation_id)
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  };

  static async findConversationByUserId(user_id: number[]): Promise<SelectConversations | undefined> {
    try {
      return await db
        .selectFrom("conversations")
        .select([
          "conversations.conversation_id",
          "conversations.user_one_id",
          "conversations.user_two_id",
        ])
        .where((eb) =>
          eb.or([
            eb("conversations.user_one_id", "=", user_id[0])
            .and("conversations.user_two_id", "=", user_id[1]),
            eb("conversations.user_one_id", "=", user_id[2])
            .and("conversations.user_two_id", "=", user_id[3]),
          ])
        )
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async getMessagesByConversationId(conversation_id: number, ids: number[] | number): Promise<SelectMessages[]> {
    try {
      return await db
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

  static async saveNewConversation(conversation: NewConversations): Promise<bigint | undefined> {
    try {
      const { insertId } = await db
        .insertInto("conversations")
        .values(conversation)
        .executeTakeFirst();

      return insertId;
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async saveNewMessage(message: NewMessages): Promise<string> {
    try {
      await db
        .insertInto("messages")
        .values(message)
        .executeTakeFirst();

      return "New message created";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };
};

export default ChatRepository;
import {
  NewConversations,
  NewMessages,
  SelectConversations,
  SelectMessages,
}                                                from "@/types/table.types";
import db                                        from "@/database/db.database";
import { DB }                                    from "@/types/schema.types";
import { Kysely }                                from "kysely";
import AsyncWrapper                              from "@/utils/async-wrapper.util";
import IEChatRepository, { ChatHistoryByIdType } from "./chat.repository";

class ChatsRepository implements IEChatRepository {
  private database: Kysely<DB>;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() { this.database = db; };

  public getUserConversationHistoryByUserId = this.wrap.repoWrap(
    async (
      user_id: number,
      conversations: number[]
    ): Promise<ChatHistoryByIdType[]> => {
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
    }
  );

  public findConversationById = this.wrap.repoWrap(
    async (
      conversation_id: number
    ): Promise<SelectConversations | undefined> => {
      return await this.database
        .selectFrom("conversations")
        .selectAll()
        .where("conversation_id", "=", conversation_id)
        .executeTakeFirst();
    }
  );

  public findConversationByUserId = this.wrap.repoWrap(
    async (user_id: number[]): Promise<SelectConversations | undefined> => {
      return await this.database
        .selectFrom("conversations")
        .select([
          "conversations.conversation_id",
          "conversations.user_one_id",
          "conversations.user_two_id",
        ])
        .where((eb) =>
          eb.or([
            eb("conversations.user_one_id", "=", user_id[0] as number).and(
              "conversations.user_two_id",
              "=",
              user_id[1] as number
            ),
            eb("conversations.user_one_id", "=", user_id[2] as number).and(
              "conversations.user_two_id",
              "=",
              user_id[3] as number
            ),
          ])
        )
        .executeTakeFirst();
    }
  );

  public getMessagesById = this.wrap.repoWrap(
    async (
      conversation_id: number,
      ids: number[] | number
    ): Promise<SelectMessages[]> => {
      return await this.database
        .selectFrom("messages")
        .selectAll()
        .where((eb) =>
          eb.and([
            eb("conversation_id", "=", conversation_id),
            eb("message_id", "not in", ids),
          ])
        )
        .limit(10)
        .execute();
    }
  );

  public saveNewConversation = this.wrap.repoWrap(
    async (conversation: NewConversations): Promise<bigint | undefined> => {
      const { insertId } = await this.database
        .insertInto("conversations")
        .values(conversation)
        .executeTakeFirst();

      return insertId;
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
        .where("conversation_id", "=", conversation_id)
        .execute();
    }
  );
};

export default ChatsRepository;
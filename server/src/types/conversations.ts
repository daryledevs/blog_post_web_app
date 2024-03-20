import { Generated, Insertable, Selectable, Updateable } from "kysely";

interface ConversationTable {
  conversation_id: Generated<number>;
  user_one_id: number;
  user_two_id: number;
  [key: string]: any;
};

export type Conversation = Selectable<ConversationTable>;
export type NewConversation = Insertable<ConversationTable>;
export type UpdateConversation = Updateable<ConversationTable>;

export default ConversationTable;

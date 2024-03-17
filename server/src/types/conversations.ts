import { Insertable, Selectable, Updateable } from "kysely";

interface ConversationTable {
  conversation_id: number;
  user_one: number;
  user_two: number;
}

export type Conversation = Selectable<ConversationTable>;
export type NewConversation = Insertable<ConversationTable>;
export type UpdateConversation = Updateable<ConversationTable>;

export default ConversationTable;

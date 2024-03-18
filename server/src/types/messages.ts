import { Generated, Insertable, Selectable, Updateable } from "kysely";

interface MessageTable {
  message_id: Generated<number>;
  conversation_id: number;
  sender_id: number;
  text_message: string | null;
  time_sent: string;
};

export type Message = Selectable<MessageTable>;
export type NewMessage = Insertable<MessageTable>;
export type UpdateMessage = Updateable<MessageTable>;

export default MessageTable;

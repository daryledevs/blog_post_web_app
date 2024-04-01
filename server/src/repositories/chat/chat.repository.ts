import { NewConversations, NewMessages, SelectConversations, SelectMessages } from "@/types/table.types";

export interface MessageDataType extends NewMessages {
  receiver_id: number;
};

export type ChatHistoryByIdType = {
  conversation_id: number;
  user_one_id: number;
  user_two_id: number;
  user_id: number | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
};

interface IChatRepository {
  getUserConversationHistoryByUserId: (user_id: number, conversations: number[]) => Promise<ChatHistoryByIdType[]>;

  findConversationByConversationId: (conversation_id: number) => Promise<SelectConversations | undefined>;

  findConversationByUserId: (user_id: number[]) => Promise<SelectConversations | undefined>;

  getMessagesByConversationId: (conversation_id: number, ids: number[] | number) => Promise<SelectMessages[]>;

  saveNewConversation: (conversation: NewConversations) => Promise<bigint | undefined>;

  saveNewMessage: (message: MessageDataType) => Promise<string>;

  deleteConversation: (conversation_id: number) => Promise<string>;
}

export default IChatRepository;
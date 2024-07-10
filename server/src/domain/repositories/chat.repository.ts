import {
  NewChatMembers,
  NewConversations,
  NewMessages,
  SelectConversations,
  SelectMessages,
} from "@/domain/types/table.types";

export interface MessageDataType {
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  text_message: string;
};

export type ChatHistoryType = {
  id: number;
  uuid: any;
  user_uuid: any;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
};

interface IEChatRepository {
  findAllConversationByUserId: (user_id: number, conversations: number[]) => Promise<ChatHistoryType[]>;

  findAllMessagesById: (conversation_id: number, ids: number[] | number) => Promise<SelectMessages[]>;

  findOneConversationById: (uuid: string) => Promise<SelectConversations | undefined>;

  findOneConversationByMembersId: (member_id: number[]) => Promise<SelectConversations | undefined>;

  findOneMessageById: (uuid: string) => Promise<SelectMessages | undefined>;

  saveNewConversation: (conversation: NewConversations) => Promise<number | bigint | undefined>;

  saveMultipleChatMembers: (message: NewChatMembers[]) => Promise<void>;

  saveNewChatMember: (message: NewChatMembers) => Promise<void>;

  saveNewMessage: (message: NewMessages) => Promise<void>;

  deleteConversationById: (conversation_id: number) => Promise<void>;
}

export default IEChatRepository;
import {
  NewChatMembers,
  NewConversations,
  NewMessages,
}                   from "@/domain/types/table.types";
import Chat         from "../models/chat.model";
import Conversation from "../models/conversation.model";

export interface MessageDataType {
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  text_message: string;
};

interface IEChatRepository {
  findAllConversationByUserId: (user_id: number, conversations: number[]) => Promise<Chat[]>;

  findAllMessagesById: (conversation_id: number, ids: number[] | number) => Promise<Chat[]>;

  findOneConversationById: (uuid: string) => Promise<Conversation | undefined>;

  findOneConversationByMembersId: (member_id: number[]) => Promise<Conversation | undefined>;

  findOneMessageById: (uuid: string) => Promise<Chat | undefined>;

  saveNewConversation: (conversation: NewConversations) => Promise<number | bigint | undefined>;

  saveMultipleChatMembers: (message: NewChatMembers[]) => Promise<void>;

  saveNewChatMember: (message: NewChatMembers) => Promise<void>;

  saveNewMessage: (message: NewMessages) => Promise<void>;

  deleteConversationById: (conversation_id: number) => Promise<void>;
}

export default IEChatRepository;
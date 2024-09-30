import {
  NewChatMembers,
  NewConversations,
  NewMessages,
}                   from "@/domain/types/table.types";
import Chat         from "../models/chat.model";
import Conversation from "../models/conversation.model";

export interface MessageDataType {
  conversationUuid: string;
  senderUuid: string;
  receiverUuid: string;
  textMessage: string;
};

interface IChatRepository {
  findAllConversationByUserId: (userId: number, conversationUuids: string[]) => Promise<Conversation[]>;

  findAllMessagesById: (conversationId: number, messageUuids: string[]) => Promise<Chat[]>;

  findOneConversationByUuId: (uuid: string) => Promise<Conversation | undefined>;

  findOneConversationByMembersId: (membersIds: number[]) => Promise<Conversation | undefined>;

  findOneMessageById: (uuid: string) => Promise<Chat | undefined>;

  saveNewConversation: (conversation: NewConversations) => Promise<number | bigint | undefined>;

  saveMultipleChatMembers: (chatMembers: NewChatMembers[]) => Promise<void>;

  saveNewChatMember: (message: NewChatMembers) => Promise<void>;

  saveNewMessage: (message: NewMessages) => Promise<void>;

  deleteConversationById: (conversationUuid: number) => Promise<void>;
}

export default IChatRepository;
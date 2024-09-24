import ChatDto             from "@/domain/dto/chat.dto";
import ConversationDto     from "@/domain/dto/conversation.dto";
import { MessageDataType } from "@/domain/repositories/chat.repository";

interface IEChatService {
  getChatHistory: (uuid: string, conversationIds: string[]) => Promise<ConversationDto[]>;

  getChatMessages: (uuid: string, messageUuids: string[]) => Promise<ChatDto[]>;

  newMessageAndConversation: (messageData: MessageDataType) => Promise<string>;

  deleteConversationById: (uuid: string) => Promise<string>;
};

export default IEChatService;
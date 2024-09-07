import Chat                from "@/domain/models/chat.model";
import Conversation        from "@/domain/models/conversation.model";
import { MessageDataType } from "@/domain/repositories/chat.repository";

interface IEChatService {
  getChatHistory: (uuid: string, conversationIds: string[]) => Promise<Conversation[]>;

  getChatMessages: (uuid: string, messageUuids: string[]) => Promise<Chat[]>;

  newMessageAndConversation: (messageData: MessageDataType) => Promise<string>;

  deleteConversationById: (uuid: string) => Promise<string>;
};

export default IEChatService;
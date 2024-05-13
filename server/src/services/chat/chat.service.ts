import { SelectMessages }                       from "@/types/table.types";
import { ChatHistoryByIdType, MessageDataType } from "@/repositories/chat/chat.repository";

interface IEChatService {
  getChatHistory: (userId: number, listId: number[]) => Promise<ChatHistoryByIdType[]>;

  getChatMessages: (chatId: number, listId: number[]) => Promise<SelectMessages[]>;

  newMessageAndConversation: (messageData: MessageDataType) => Promise<string>;

  deleteConversationById: (conversation_id: number) => Promise<string>;
};

export default IEChatService;
import { SelectMessages }                       from "@/types/table.types";
import { ChatHistoryByIdType, MessageDataType } from "@/repository/chat.repository";

interface IChatsService {
  getChatHistory: (userId: number, listId: number[]) => Promise<ChatHistoryByIdType[]>;

  getChatMessages: (chatId: number, listId: number[]) => Promise<SelectMessages[]>;

  newMessageAndConversation: (conversation_id: number, messageData: MessageDataType) => Promise<string>;

  deleteConversation: (conversation_id: number) => Promise<string>;
};

export default IChatsService;
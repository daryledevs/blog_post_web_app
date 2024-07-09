import { ChatHistoryType }              from "@/domain/repositories/chat.repository";
import { NewMessages, SelectMessages }  from "@/domain/types/table.types";

interface IEChatService {
  getChatHistory: (uuid: string | undefined, listId: number[]) => Promise<ChatHistoryType[]>;

  getChatMessages: (uuid: string | undefined, listId: number[]) => Promise<SelectMessages[]>;

  newMessageAndConversation: (messageData: NewMessages | undefined) => Promise<string>;

  deleteConversationById: (uuid: string | undefined) => Promise<string>;
};

export default IEChatService;
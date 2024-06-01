import { ChatHistoryType }              from "@/repositories/chat/chat.repository";
import { NewMessages, SelectMessages }  from "@/types/table.types";

interface IEChatService {
  getChatHistory: (uuid: string | undefined, listId: number[]) => Promise<ChatHistoryType[]>;

  getChatMessages: (uuid: string | undefined, listId: number[]) => Promise<SelectMessages[]>;

  newMessageAndConversation: (messageData: NewMessages | undefined) => Promise<string>;

  deleteConversationById: (uuid: string | undefined) => Promise<string>;
};

export default IEChatService;
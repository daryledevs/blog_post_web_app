import Chat            from "@/domain/models/chat.model";
import { NewMessages } from "@/domain/types/table.types";

interface IEChatService {
  getChatHistory: (uuid: string | undefined, listId: number[]) => Promise<Chat[]>;

  getChatMessages: (uuid: string | undefined, listId: number[]) => Promise<Chat[]>;

  newMessageAndConversation: (messageData: NewMessages | undefined) => Promise<string>;

  deleteConversationById: (uuid: string | undefined) => Promise<string>;
};

export default IEChatService;
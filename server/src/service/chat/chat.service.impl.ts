import ChatsRepository, {
  ChatHistoryByIdType,
  MessageDataType,
}                         from "@/repository/chat.repository";
import Exception          from "@/exception/exception";
import IChatsService      from "./chat.service";
import UserRepository     from "@/repository/user.repository";
import { SelectMessages } from "@/types/table.types";

class ChatsServices implements IChatsService {
  private chatsRepository: ChatsRepository;
  private usersRepository: UserRepository;

  constructor() { 
    this.chatsRepository = new ChatsRepository(); 
    this.usersRepository = new UserRepository();
  };

  async getChatHistory(userId: number, listId: number[]): Promise<ChatHistoryByIdType[]> {
    if(!userId) throw Exception.badRequest("User id is required");
    const isUserExist = await this.usersRepository.findUserById(userId);
    if(!isUserExist) throw Exception.notFound("User not found");
    return await this.chatsRepository
      .getUserConversationHistoryByUserId(userId, listId);
  };

  async getChatMessages(chatId: number, listId: number[]): Promise<SelectMessages[]> {
    if(!chatId) throw Exception.badRequest("Chat id is required");
    const data = await this.chatsRepository
      .findConversationByConversationId(chatId);

    if(!data) throw Exception.notFound("Chat not found");
    return await this.chatsRepository
      .getMessagesByConversationId(chatId, listId);
  };

  async newMessageAndConversation(conversation_id: number, messageData: MessageDataType): Promise<string> {
    if(!conversation_id) throw Exception.badRequest("Conversation id is required");
    let newConversationId: any = conversation_id;

    const conversation = await this.chatsRepository
      .findConversationByConversationId(conversation_id);

    if(!conversation) {
      newConversationId = await this.chatsRepository.saveNewConversation({
        user_one_id: messageData.sender_id,
        user_two_id: messageData.receiver_id,
      });
    };

    return await this.chatsRepository
      .saveNewMessage(messageData);
  };

  async deleteConversation(conversation_id: number): Promise<string> {
    if(!conversation_id) throw Exception.badRequest("Conversation id is required");
    const conversation = await this.chatsRepository
      .findConversationByConversationId(conversation_id);

    if(!conversation) throw Exception.notFound("Conversation not found");
    return await this.chatsRepository
      .deleteConversation(conversation_id);
  };
};

export default ChatsServices;
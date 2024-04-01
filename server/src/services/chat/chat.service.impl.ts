
import IChatService                             from "./chat.service";
import UserRepository                           from "@/repositories/user/user.repository.impl";
import ChatRepository                           from "@/repositories/chat/chat.repository.impl";
import ErrorException                           from "@/exceptions/error.exception";
import { SelectMessages }                       from "@/types/table.types";
import { ChatHistoryByIdType, MessageDataType } from "@/repositories/chat/chat.repository";

class ChatServices implements IChatService {
  private chatRepository: ChatRepository;
  private userRepository: UserRepository;

  constructor(chatRepository: ChatRepository, userRepository: UserRepository) { 
    this.chatRepository = chatRepository;
    this.userRepository = userRepository;
  };

  public async getChatHistory(userId: number, listId: number[]): Promise<ChatHistoryByIdType[]> {
    if(!userId) throw ErrorException.badRequest("User id is required");
    const isUserExist = await this.userRepository.findUserById(userId);
    if(!isUserExist) throw ErrorException.notFound("User not found");
    return await this.chatRepository
      .getUserConversationHistoryByUserId(userId, listId);
  };

  public async getChatMessages(chatId: number, listId: number[]): Promise<SelectMessages[]> {
    if(!chatId) throw ErrorException.badRequest("Chat id is required");
    const data = await this.chatRepository
      .findConversationByConversationId(chatId);

    if(!data) throw ErrorException.notFound("Chat not found");
    return await this.chatRepository
      .getMessagesByConversationId(chatId, listId);
  };

  public async newMessageAndConversation(conversation_id: number, messageData: MessageDataType): Promise<string> {
    if(!conversation_id) throw ErrorException.badRequest("Conversation id is required");
    let newConversationId: any = conversation_id;

    const conversation = await this.chatRepository
      .findConversationByConversationId(conversation_id);

    if(!conversation) {
      newConversationId = await this.chatRepository.saveNewConversation({
        user_one_id: messageData.sender_id,
        user_two_id: messageData.receiver_id,
      });
    };

    return await this.chatRepository
      .saveNewMessage(messageData);
  };

  public async deleteConversation(conversation_id: number): Promise<string> {
    if(!conversation_id) throw ErrorException.badRequest("Conversation id is required");
    const conversation = await this.chatRepository
      .findConversationByConversationId(conversation_id);

    if(!conversation) throw ErrorException.notFound("Conversation not found");
    return await this.chatRepository
      .deleteConversation(conversation_id);
  };
};

export default ChatServices;
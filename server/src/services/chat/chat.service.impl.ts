
import IChatService                             from "./chat.service";
import AsyncWrapper                             from "@/utils/async-wrapper.util";
import UserRepository                           from "@/repositories/user/user.repository.impl";
import ChatRepository                           from "@/repositories/chat/chat.repository.impl";
import ApiErrorException                        from "@/exceptions/api.exception";
import { SelectMessages }                       from "@/types/table.types";
import { ChatHistoryByIdType, MessageDataType } from "@/repositories/chat/chat.repository";

class ChatServices implements IChatService {
  private chatRepository: ChatRepository;
  private userRepository: UserRepository;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(chatRepository: ChatRepository, userRepository: UserRepository) {
    this.chatRepository = chatRepository;
    this.userRepository = userRepository;
  }

  public getChatHistory = this.wrap.serviceWrap(
    async (
      userId: number,
      listId: number[]
    ): Promise<ChatHistoryByIdType[]> => {
      // If no user id is provided, return an error
      if (!userId) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const isUserExist = await this.userRepository.findUserById(userId);
      if (!isUserExist) throw ApiErrorException.HTTP404Error("User not found");

      // Return the chat history
      return await this.chatRepository.getUserConversationHistoryByUserId(
        userId,
        listId
      );
    }
  );

  public getChatMessages = this.wrap.serviceWrap(
    async (chatId: number, listId: number[]): Promise<SelectMessages[]> => {
      // If no chat id is provided, return an error
      if (!chatId) throw ApiErrorException.HTTP400Error("No arguments provided");

      // Check if the chat exists
      const data = await this.chatRepository
        .findConversationByConversationId(chatId);

      // If the chat does not exist, return an error
      if (!data) throw ApiErrorException.HTTP404Error("Chat not found");

      // Return the chat messages
      return await this.chatRepository
        .getMessagesByConversationId(chatId, listId);
    }
  );

  public newMessageAndConversation = this.wrap.serviceWrap(
    async (
      conversation_id: number,
      messageData: MessageDataType
    ): Promise<string> => {
      // If no conversation id is provided, return an error
      if (!conversation_id) throw ApiErrorException.HTTP400Error("No arguments provided");
      let newConversationId: any = conversation_id;

      // Check if the conversation exists
      const conversation = await this.chatRepository
        .findConversationByConversationId(conversation_id);

      // If the conversation does not exist, create a new conversation
      if (!conversation) {
        newConversationId = await this.chatRepository.saveNewConversation({
          user_one_id: messageData.sender_id,
          user_two_id: messageData.receiver_id,
        });
      }

      // Save the new message
      return await this.chatRepository.saveNewMessage(messageData);
    }
  );

  public deleteConversation = this.wrap.serviceWrap(
    async (conversation_id: number): Promise<string> => {
      // If no conversation id is provided, return an error
      if (!conversation_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // Check if the conversation exists
      const conversation = await this.chatRepository
        .findConversationByConversationId(conversation_id);

      // If the conversation does not exist, return an error
      if (!conversation) throw ApiErrorException.HTTP404Error("Conversation not found");

      // Return the deleted conversation
      await this.chatRepository.deleteConversation(conversation_id);
      return "Conversation deleted successfully";
    }
  );
};

export default ChatServices;
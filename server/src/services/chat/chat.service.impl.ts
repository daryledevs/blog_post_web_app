import IEChatRepository, {
  ChatHistoryByIdType,
  MessageDataType,
}                         from "@/repositories/chat/chat.repository";
import IChatService       from "./chat.service";
import AsyncWrapper       from "@/utils/async-wrapper.util";
import ApiErrorException  from "@/exceptions/api.exception";
import { NewMessages, SelectMessages } from "@/types/table.types";
import IEUserRepository   from "@/repositories/user/user.repository";

class ChatServices implements IChatService {
  private chatRepository: IEChatRepository;
  private userRepository: IEUserRepository;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(chatRepository: IEChatRepository, userRepository: IEUserRepository) {
    this.chatRepository = chatRepository;
    this.userRepository = userRepository;
  };

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
        .findConversationById(chatId);

      // If the chat does not exist, return an error
      if (!data) throw ApiErrorException.HTTP404Error("Chat not found");

      // Return the chat messages
      return await this.chatRepository
        .getMessagesById(chatId, listId);
    }
  );

  public newMessageAndConversation = this.wrap.serviceWrap(
    async (
      messageData: MessageDataType
    ): Promise<string> => {
      const conversation_id = messageData?.conversation_id;
      const sender_id = messageData?.sender_id;
      const receiver_id = messageData?.receiver_id;
      
      let newMessageData = messageData;

      if (!sender_id || !receiver_id) {
        throw ApiErrorException.HTTP400Error("No arguments provided");
      };
      

      if (conversation_id) {
        // Check if the conversation exists
        const conversation = await this.chatRepository
          .findConversationById(conversation_id);

        // If the conversation does not exist, return an error
        if (!conversation) throw ApiErrorException.HTTP404Error("Conversation not found");
      };

      // since the conversation_id is null or undefined, we need to check if it exists
      if (!conversation_id) {
        const user_id: number[] = [
          sender_id,
          receiver_id,
          receiver_id,
          sender_id,
        ];

        // Check if the conversation exists by users' id
        const conversation =
          await this.chatRepository.findConversationByUserId(user_id);

        newMessageData.conversation_id = conversation
          ? // If the conversation exists, return the conversation_id
            (conversation.conversation_id as number)
          : // If the conversation does not exist, create a new one
            ((await this.chatRepository.saveNewConversation({
              user_one_id: sender_id,
              user_two_id: receiver_id,
            })) as unknown as number);
      };
      
      const { receiver_id: _, ...rest } = newMessageData;
      // Save the new message
      await this.chatRepository.saveNewMessage(rest as any);
      return "Message sent successfully";
    }
  );

  public deleteConversationById = this.wrap.serviceWrap(
    async (conversation_id: number): Promise<string> => {
      // If no conversation id is provided, return an error
      if (!conversation_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // Check if the conversation exists
      const conversation = await this.chatRepository
        .findConversationById(conversation_id);

      // If the conversation does not exist, return an error
      if (!conversation) throw ApiErrorException.HTTP404Error("Conversation not found");

      // Return the deleted conversation
      await this.chatRepository.deleteConversationById(conversation_id);
      return "Conversation deleted successfully";
    }
  );
};

export default ChatServices;
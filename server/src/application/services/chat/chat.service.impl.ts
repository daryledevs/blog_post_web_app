import IChatRepository, {
  MessageDataType,
}                        from "@/domain/repositories/chat.repository";
import ChatDto           from "@/domain/dto/chat.dto";
import Conversation      from "@/domain/models/conversation.model";
import IChatService      from "./chat.service";
import ConversationDto   from "@/domain/dto/conversation.dto";
import IUserRepository   from "@/domain/repositories/user.repository";
import { plainToClass }  from "class-transformer";
import ApiErrorException from "@/application/exceptions/api.exception";

class ChatService implements IChatService {
  private chatRepository: IChatRepository;
  private userRepository: IUserRepository;

  constructor(
    chatRepository: IChatRepository,
    userRepository: IUserRepository
  ) {
    this.chatRepository = chatRepository;
    this.userRepository = userRepository;
  }

  public getChatHistory = async (
    uuid: string,
    conversationIds: string[]
  ): Promise<ConversationDto[]> => {
    // If the user is not found, return an error
    const user = await this.userRepository.findUserById(uuid);
    if (!user) {
      throw ApiErrorException.HTTP404Error("User not found");
    }

    // Return the chat history
    const conversations = await this.chatRepository.findAllConversationByUserId(
      user.getId(),
      conversationIds
    );

    return conversations.map((conversation) =>
      plainToClass(ConversationDto, conversation)
    );
  };

  public getChatMessages = async (
    uuid: string,
    messageUuids: string[]
  ): Promise<ChatDto[]> => {
    // Check if the chat exists, if does not exist, return an error
    const conversation = await this.chatRepository.findOneConversationByUuId(
      uuid
    );

    if (!conversation) {
      throw ApiErrorException.HTTP404Error("Chat not found");
    }

    // Return the chat messages
    const chats = await this.chatRepository.findAllMessagesById(
      conversation.getId(),
      messageUuids
    );

    return chats.map((chat) => plainToClass(ChatDto, chat));
  };

  public newMessageAndConversation = async ({
    conversationUuid,
    senderUuid,
    receiverUuid,
    textMessage,
  }: MessageDataType): Promise<string> => {
    // Validate sender and receiver existence in parallel
    const [sender, receiver] = await Promise.all([
      this.userRepository.findUserById(senderUuid),
      this.userRepository.findUserById(receiverUuid),
    ]);

    if (!sender || !receiver) {
      throw ApiErrorException.HTTP404Error("Sender or receiver not found");
    }

    const senderId = sender.getId();
    const receiverId = receiver.getId();

    // Fetch existing conversation or create a new one
    const conversation = await this.isConversationExist(
      conversationUuid,
      senderId,
      receiverId
    );
    
    // Get the conversation ID
    const conversationId =
      conversation?.getId() ??
      (await this.createConversation(senderId, receiverId));

    // Save the new message
    await this.chatRepository.saveNewMessage({
      conversation_id: conversationId,
      sender_id: senderId,
      text_message: textMessage,
    });

    return "Message sent successfully";
  };

  private createConversation = async (
    senderId: number,
    receiverId: number
  ): Promise<number> => {
    const conversationId = await this.chatRepository.saveNewConversation({});

    await this.chatRepository.saveMultipleChatMembers([
      { conversation_id: conversationId as number, user_id: senderId },
      { conversation_id: conversationId as number, user_id: receiverId },
    ]);

    return conversationId as number;
  };

  public deleteConversationById = async (uuid: string): Promise<string> => {
    // Check if the conversation exists
    const conversation = await this.chatRepository.findOneConversationByUuId(
      uuid
    );

    // If the conversation does not exist, return an error
    if (!conversation) {
      throw ApiErrorException.HTTP404Error("Conversation not found");
    }

    // Return the deleted conversation
    await this.chatRepository.deleteConversationById(conversation.getId());
    return "Conversation deleted successfully";
  };

  private isConversationExist = async (
    conversationUuid: string | undefined,
    senderId: number,
    receiverId: number
  ): Promise<Conversation | undefined> => {
    if (!conversationUuid) {
      // Fetch conversation by member IDs if no UUID is provided
      const conversation =
        await this.chatRepository.findOneConversationByMembersId([
          senderId,
          receiverId,
        ]);

      // If a conversation is found, throw an error
      if (conversation) {
        throw ApiErrorException.HTTP404Error(
          "The provided conversation ID is invalid or conversation not found"
        );
      }
      return undefined;
    }
    
    // Fetch conversation by UUID
    return await this.chatRepository.findOneConversationByUuId(
      conversationUuid
    );
  };
}

export default ChatService;

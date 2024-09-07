import IEChatRepository, {
  MessageDataType,
}                        from "@/domain/repositories/chat.repository";
import Chat              from "@/domain/models/chat.model";
import Conversation      from "@/domain/models/conversation.model";
import IEChatService     from "./chat.service";
import IEUserRepository  from "@/domain/repositories/user.repository";
import ApiErrorException from "@/application/exceptions/api.exception";

class ChatServices implements IEChatService {
  private chatRepository: IEChatRepository;
  private userRepository: IEUserRepository;

  constructor(
    chatRepository: IEChatRepository,
    userRepository: IEUserRepository
  ) {
    this.chatRepository = chatRepository;
    this.userRepository = userRepository;
  }

  public getChatHistory = async (
    uuid: string,
    conversationIds: string[]
  ): Promise<Conversation[]> => {
    // If the user is not found, return an error
    const user = await this.userRepository.findUserById(uuid);
    if (!user) {
      throw ApiErrorException.HTTP404Error("User not found");
    }

    // Return the chat history
    return await this.chatRepository.findAllConversationByUserId(
      user.getId(),
      conversationIds
    );
  };

  public getChatMessages = async (
    uuid: string,
    messageUuids: string[]
  ): Promise<Chat[]> => {
    // Check if the chat exists, if does not exist, return an error
    const conversation = await this.chatRepository.findOneConversationByUuId(
      uuid
    );

    if (!conversation) {
      throw ApiErrorException.HTTP404Error("Chat not found");
    }

    // Return the chat messages
    return await this.chatRepository.findAllMessagesById(
      conversation.getId(),
      messageUuids
    );
  };

  public newMessageAndConversation = async (
    messageData: MessageDataType
  ): Promise<string> => {
    // destructure the necessary properties from messageData
    const { conversation_uuid, sender_uuid, receiver_uuid, text_message } =
      messageData ?? {};

    // fetch the sender and receiver from the user repository
    const sender = await this.userRepository.findUserById(sender_uuid);

    if (!sender) {
      throw ApiErrorException.HTTP404Error("user not found");
    }

    const receiver = await this.userRepository.findUserById(receiver_uuid);

    if (!receiver) {
      throw ApiErrorException.HTTP404Error("user not found");
    }

    const sender_id = sender.getId();
    const receiver_id = receiver.getId();

    const conversation = await this.isConversationExist(
      conversation_uuid,
      sender_id,
      receiver_id
    );

    let new_conversation_id = conversation?.getId();

    // if the provided id doesn't exist, then it is a new message
    if (!new_conversation_id) {
      new_conversation_id = await this.createConversation(
        sender.getId(),
        receiver.getId()
      );
    }

    // save the new message in the chat repository
    await this.chatRepository.saveNewMessage({
      conversation_id: new_conversation_id,
      sender_id: sender_id,
      text_message,
    });

    return "message sent successfully";
  };

  private createConversation = async (
    senderId: number,
    receiverId: number
  ): Promise<number> => {
    const newConversationId = await this.chatRepository.saveNewConversation({});

    await this.chatRepository.saveMultipleChatMembers([
      { conversation_id: newConversationId as number, user_id: senderId },
      { conversation_id: newConversationId as number, user_id: receiverId },
    ]);

    return newConversationId as number;
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
    conversation_uuid: string,
    senderId: number,
    receiverId: number
  ): Promise<Conversation | undefined> => {
    if (!conversation_uuid) {
      return undefined;
    }

    // Attempt to fetch the conversation by its UUID
    const conversation = await this.chatRepository.findOneConversationByUuId(
      conversation_uuid
    );

    // If not found by UUID, try fetching by member IDs
    const conversationByMembers =
      await this.chatRepository.findOneConversationByMembersId([
        senderId,
        receiverId,
      ]);

    // If conversation fetched by members ID does not match the UUID, throw error
    if (conversationByMembers?.getUuid() !== conversation?.getId()) {
      throw ApiErrorException.HTTP404Error(
        "the provided conversation ID is invalid or conversation not found"
      );
    }

    return conversation;
  };
};

export default ChatServices;
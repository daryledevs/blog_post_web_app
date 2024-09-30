"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_dto_1 = __importDefault(require("@/domain/dto/chat.dto"));
const conversation_dto_1 = __importDefault(require("@/domain/dto/conversation.dto"));
const class_transformer_1 = require("class-transformer");
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
class ChatService {
    chatRepository;
    userRepository;
    constructor(chatRepository, userRepository) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }
    getChatHistory = async (uuid, conversationIds) => {
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(uuid);
        if (!user) {
            throw api_exception_1.default.HTTP404Error("User not found");
        }
        // Return the chat history
        const conversations = await this.chatRepository.findAllConversationByUserId(user.getId(), conversationIds);
        return conversations.map((conversation) => (0, class_transformer_1.plainToClass)(conversation_dto_1.default, conversation));
    };
    getChatMessages = async (uuid, messageUuids) => {
        // Check if the chat exists, if does not exist, return an error
        const conversation = await this.chatRepository.findOneConversationByUuId(uuid);
        if (!conversation) {
            throw api_exception_1.default.HTTP404Error("Chat not found");
        }
        // Return the chat messages
        const chats = await this.chatRepository.findAllMessagesById(conversation.getId(), messageUuids);
        return chats.map((chat) => (0, class_transformer_1.plainToClass)(chat_dto_1.default, chat));
    };
    newMessageAndConversation = async ({ conversationUuid, senderUuid, receiverUuid, textMessage, }) => {
        // Validate sender and receiver existence in parallel
        const [sender, receiver] = await Promise.all([
            this.userRepository.findUserById(senderUuid),
            this.userRepository.findUserById(receiverUuid),
        ]);
        if (!sender || !receiver) {
            throw api_exception_1.default.HTTP404Error("Sender or receiver not found");
        }
        const senderId = sender.getId();
        const receiverId = receiver.getId();
        // Fetch existing conversation or create a new one
        const conversation = await this.isConversationExist(conversationUuid, senderId, receiverId);
        // Get the conversation ID
        const conversationId = conversation?.getId() ??
            (await this.createConversation(senderId, receiverId));
        // Save the new message
        await this.chatRepository.saveNewMessage({
            conversation_id: conversationId,
            sender_id: senderId,
            text_message: textMessage,
        });
        return "Message sent successfully";
    };
    createConversation = async (senderId, receiverId) => {
        const conversationId = await this.chatRepository.saveNewConversation({});
        await this.chatRepository.saveMultipleChatMembers([
            { conversation_id: conversationId, user_id: senderId },
            { conversation_id: conversationId, user_id: receiverId },
        ]);
        return conversationId;
    };
    deleteConversationById = async (uuid) => {
        // Check if the conversation exists
        const conversation = await this.chatRepository.findOneConversationByUuId(uuid);
        // If the conversation does not exist, return an error
        if (!conversation) {
            throw api_exception_1.default.HTTP404Error("Conversation not found");
        }
        // Return the deleted conversation
        await this.chatRepository.deleteConversationById(conversation.getId());
        return "Conversation deleted successfully";
    };
    isConversationExist = async (conversationUuid, senderId, receiverId) => {
        if (!conversationUuid) {
            // Fetch conversation by member IDs if no UUID is provided
            const conversation = await this.chatRepository.findOneConversationByMembersId([
                senderId,
                receiverId,
            ]);
            // If a conversation is found, throw an error
            if (conversation) {
                throw api_exception_1.default.HTTP404Error("The provided conversation ID is invalid or conversation not found");
            }
            return undefined;
        }
        // Fetch conversation by UUID
        return await this.chatRepository.findOneConversationByUuId(conversationUuid);
    };
}
exports.default = ChatService;

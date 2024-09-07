"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
class ChatServices {
    chatRepository;
    userRepository;
    constructor(chatRepository, userRepository) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }
    getChatHistory = async (uuid, conversationIds) => {
        // If no user id is provided, return an error
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Return the chat history
        return await this.chatRepository.findAllConversationByUserId(user.getId(), conversationIds);
    };
    getChatMessages = async (uuid, messageUuids) => {
        // Check if the chat exists, if does not exist, return an error
        const conversation = await this.chatRepository.findOneConversationByUuId(uuid);
        if (!conversation) {
            throw api_exception_1.default.HTTP404Error("Chat not found");
        }
        // Return the chat messages
        return await this.chatRepository.findAllMessagesById(conversation.getId(), messageUuids);
    };
    newMessageAndConversation = async (messageData) => {
        // destructure the necessary properties from messageData
        const { conversation_uuid, sender_uuid, receiver_uuid, text_message } = messageData ?? {};
        // fetch the sender and receiver from the user repository
        const sender = await this.userRepository.findUserById(sender_uuid);
        if (!sender) {
            throw api_exception_1.default.HTTP404Error("user not found");
        }
        const receiver = await this.userRepository.findUserById(receiver_uuid);
        if (!receiver) {
            throw api_exception_1.default.HTTP404Error("user not found");
        }
        const sender_id = sender.getId();
        const receiver_id = receiver.getId();
        const conversation = await this.isConversationExist(conversation_uuid, sender_id, receiver_id);
        let new_conversation_id = conversation?.getId();
        // if the provided id doesn't exist, then it is a new message
        if (!new_conversation_id) {
            new_conversation_id = await this.createConversation(sender.getId(), receiver.getId());
        }
        // save the new message in the chat repository
        await this.chatRepository.saveNewMessage({
            conversation_id: new_conversation_id,
            sender_id: sender_id,
            text_message,
        });
        return "message sent successfully";
    };
    createConversation = async (senderId, receiverId) => {
        const newConversationId = await this.chatRepository.saveNewConversation({});
        await this.chatRepository.saveMultipleChatMembers([
            { conversation_id: newConversationId, user_id: senderId },
            { conversation_id: newConversationId, user_id: receiverId },
        ]);
        return newConversationId;
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
    isConversationExist = async (conversation_uuid, senderId, receiverId) => {
        if (!conversation_uuid) {
            return undefined;
        }
        // Attempt to fetch the conversation by its UUID
        const conversation = await this.chatRepository.findOneConversationByUuId(conversation_uuid);
        // If not found by UUID, try fetching by member IDs
        const conversationByMembers = await this.chatRepository.findOneConversationByMembersId([
            senderId,
            receiverId,
        ]);
        // If conversation fetched by members ID does not match the UUID, throw error
        if (conversationByMembers?.getUuid() !== conversation?.getId()) {
            throw api_exception_1.default.HTTP404Error("the provided conversation ID is invalid or conversation not found");
        }
        return conversation;
    };
}
;
exports.default = ChatServices;

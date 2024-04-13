"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class ChatServices {
    chatRepository;
    userRepository;
    wrap = new async_wrapper_util_1.default();
    constructor(chatRepository, userRepository) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }
    getChatHistory = this.wrap.asyncWrap(async (userId, listId) => {
        // If no user id is provided, return an error
        if (!userId)
            throw api_exception_1.default.HTTP400Error("User id is required");
        // If the user is not found, return an error
        const isUserExist = await this.userRepository.findUserById(userId);
        if (!isUserExist)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Return the chat history
        return await this.chatRepository.getUserConversationHistoryByUserId(userId, listId);
    });
    getChatMessages = this.wrap.asyncWrap(async (chatId, listId) => {
        // If no chat id is provided, return an error
        if (!chatId)
            throw api_exception_1.default.HTTP400Error("Chat id is required");
        // Check if the chat exists
        const data = await this.chatRepository
            .findConversationByConversationId(chatId);
        // If the chat does not exist, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("Chat not found");
        // Return the chat messages
        return await this.chatRepository
            .getMessagesByConversationId(chatId, listId);
    });
    newMessageAndConversation = this.wrap.asyncWrap(async (conversation_id, messageData) => {
        // If no conversation id is provided, return an error
        if (!conversation_id)
            throw api_exception_1.default.HTTP400Error("Conversation id is required");
        let newConversationId = conversation_id;
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
    });
    deleteConversation = this.wrap.asyncWrap(async (conversation_id) => {
        // If no conversation id is provided, return an error
        if (!conversation_id)
            throw api_exception_1.default.HTTP400Error("Conversation id is required");
        // Check if the conversation exists
        const conversation = await this.chatRepository
            .findConversationByConversationId(conversation_id);
        // If the conversation does not exist, return an error
        if (!conversation)
            throw api_exception_1.default.HTTP404Error("Conversation not found");
        // Return the deleted conversation
        return await this.chatRepository.deleteConversation(conversation_id);
    });
}
;
exports.default = ChatServices;

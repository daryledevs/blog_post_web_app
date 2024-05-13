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
    ;
    getChatHistory = this.wrap.serviceWrap(async (userId, listId) => {
        // If no user id is provided, return an error
        if (!userId)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const isUserExist = await this.userRepository.findUserById(userId);
        if (!isUserExist)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Return the chat history
        return await this.chatRepository.getUserConversationHistoryByUserId(userId, listId);
    });
    getChatMessages = this.wrap.serviceWrap(async (chatId, listId) => {
        // If no chat id is provided, return an error
        if (!chatId)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // Check if the chat exists
        const data = await this.chatRepository
            .findConversationById(chatId);
        // If the chat does not exist, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("Chat not found");
        // Return the chat messages
        return await this.chatRepository
            .getMessagesById(chatId, listId);
    });
    newMessageAndConversation = this.wrap.serviceWrap(async (messageData) => {
        const conversation_id = messageData?.conversation_id;
        const sender_id = messageData?.sender_id;
        const receiver_id = messageData?.receiver_id;
        let newMessageData = messageData;
        if (!sender_id || !receiver_id) {
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        }
        ;
        if (conversation_id) {
            // Check if the conversation exists
            const conversation = await this.chatRepository
                .findConversationById(conversation_id);
            // If the conversation does not exist, return an error
            if (!conversation)
                throw api_exception_1.default.HTTP404Error("Conversation not found");
        }
        ;
        // since the conversation_id is null or undefined, we need to check if it exists
        if (!conversation_id) {
            const user_id = [
                sender_id,
                receiver_id,
                receiver_id,
                sender_id,
            ];
            // Check if the conversation exists by users' id
            const conversation = await this.chatRepository.findConversationByUserId(user_id);
            newMessageData.conversation_id = conversation
                ? // If the conversation exists, return the conversation_id
                    conversation.conversation_id
                : // If the conversation does not exist, create a new one
                    (await this.chatRepository.saveNewConversation({
                        user_one_id: sender_id,
                        user_two_id: receiver_id,
                    }));
        }
        ;
        const { receiver_id: _, ...rest } = newMessageData;
        // Save the new message
        await this.chatRepository.saveNewMessage(rest);
        return "Message sent successfully";
    });
    deleteConversationById = this.wrap.serviceWrap(async (conversation_id) => {
        // If no conversation id is provided, return an error
        if (!conversation_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // Check if the conversation exists
        const conversation = await this.chatRepository
            .findConversationById(conversation_id);
        // If the conversation does not exist, return an error
        if (!conversation)
            throw api_exception_1.default.HTTP404Error("Conversation not found");
        // Return the deleted conversation
        await this.chatRepository.deleteConversationById(conversation_id);
        return "Conversation deleted successfully";
    });
}
;
exports.default = ChatServices;

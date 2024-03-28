"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = __importDefault(require("@/exception/exception"));
class ChatServices {
    constructor(chatRepository, userRepository) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }
    ;
    async getChatHistory(userId, listId) {
        if (!userId)
            throw exception_1.default.badRequest("User id is required");
        const isUserExist = await this.userRepository.findUserById(userId);
        if (!isUserExist)
            throw exception_1.default.notFound("User not found");
        return await this.chatRepository
            .getUserConversationHistoryByUserId(userId, listId);
    }
    ;
    async getChatMessages(chatId, listId) {
        if (!chatId)
            throw exception_1.default.badRequest("Chat id is required");
        const data = await this.chatRepository
            .findConversationByConversationId(chatId);
        if (!data)
            throw exception_1.default.notFound("Chat not found");
        return await this.chatRepository
            .getMessagesByConversationId(chatId, listId);
    }
    ;
    async newMessageAndConversation(conversation_id, messageData) {
        if (!conversation_id)
            throw exception_1.default.badRequest("Conversation id is required");
        let newConversationId = conversation_id;
        const conversation = await this.chatRepository
            .findConversationByConversationId(conversation_id);
        if (!conversation) {
            newConversationId = await this.chatRepository.saveNewConversation({
                user_one_id: messageData.sender_id,
                user_two_id: messageData.receiver_id,
            });
        }
        ;
        return await this.chatRepository
            .saveNewMessage(messageData);
    }
    ;
    async deleteConversation(conversation_id) {
        if (!conversation_id)
            throw exception_1.default.badRequest("Conversation id is required");
        const conversation = await this.chatRepository
            .findConversationByConversationId(conversation_id);
        if (!conversation)
            throw exception_1.default.notFound("Conversation not found");
        return await this.chatRepository
            .deleteConversation(conversation_id);
    }
    ;
}
;
exports.default = ChatServices;

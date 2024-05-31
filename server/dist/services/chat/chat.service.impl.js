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
    getChatHistory = this.wrap.serviceWrap(async (uuid, listId) => {
        // If no user id is provided, return an error
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Return the chat history
        return await this.chatRepository.findAllConversationByUserId(user.id, listId);
    });
    getChatMessages = this.wrap.serviceWrap(async (uuid, listId) => {
        // If no chat id is provided, return an error
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // Check if the chat exists
        const data = await this.chatRepository.findOneConversationById(uuid);
        // If the chat does not exist, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("Chat not found");
        // Return the chat messages
        return await this.chatRepository.findAllMessagesById(data.id, listId);
    });
    newMessageAndConversation = this.wrap.serviceWrap(async (messageData) => {
        // destructure the necessary properties from messageData
        const { conversation_id, sender_id, receiver_id, text_message } = messageData;
        // validate that sender_id and receiver_id are provided
        if (!sender_id || !receiver_id) {
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        }
        // fetch the sender and receiver from the user repository
        const sender = await this.userRepository.findUserById(sender_id);
        if (!sender)
            throw api_exception_1.default.HTTP404Error("User not found");
        const receiver = await this.userRepository.findUserById(receiver_id);
        if (!receiver)
            throw api_exception_1.default.HTTP404Error("User not found");
        let conversation;
        if (conversation_id) {
            // if conversation_id is provided, fetch the conversation by its ID
            conversation = await this.chatRepository.findOneConversationById(conversation_id);
            // if the conversation doesn't exists, throw an error
            if (!conversation)
                throw api_exception_1.default.HTTP404Error("Conversation not found");
        }
        else {
            // if conversation_id is not provided, fetch the conversation by the member IDs
            conversation = await this.chatRepository.findOneConversationByMembersId([sender.id, receiver.id]);
        }
        // determine the conversation ID, creating a new conversation if necessary
        const newConversationId = conversation
            ? conversation.id
            : await this.createConversation(sender.id, receiver.id);
        // save the new message in the chat repository
        await this.chatRepository.saveNewMessage({
            conversation_id: newConversationId,
            sender_id: sender.id,
            text_message,
        });
        return "Message sent successfully";
    });
    createConversation = this.wrap.serviceWrap(async (senderId, receiverId) => {
        const newConversationId = (await this.chatRepository.saveNewConversation({}));
        await this.chatRepository.saveMultipleChatMembers([
            { conversation_id: newConversationId, user_id: senderId },
            { conversation_id: newConversationId, user_id: receiverId },
        ]);
        return newConversationId;
    });
    deleteConversationById = this.wrap.serviceWrap(async (uuid) => {
        // If no conversation id is provided, return an error
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // Check if the conversation exists
        const conversation = await this.chatRepository.findOneConversationById(uuid);
        // If the conversation does not exist, return an error
        if (!conversation)
            throw api_exception_1.default.HTTP404Error("Conversation not found");
        // Return the deleted conversation
        await this.chatRepository.deleteConversationById(conversation.id);
        return "Conversation deleted successfully";
    });
}
;
exports.default = ChatServices;

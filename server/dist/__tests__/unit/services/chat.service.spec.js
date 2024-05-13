"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_service_impl_1 = __importDefault(require("@/services/chat/chat.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const chat_repository_impl_1 = __importDefault(require("@/repositories/chat/chat.repository.impl"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
const generate_data_util_1 = __importDefault(require("../../utils/generate-data.util"));
const vitest_1 = require("vitest");
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
vitest_1.vi.mock("@/repositories/chat/chat.repository.impl");
(0, vitest_1.describe)("ChatService", () => {
    // Test variables
    let chatRepository;
    let userRepository;
    let ChatService;
    // Error messages
    const error = {
        noArgsMsg: api_exception_1.default.HTTP400Error("No arguments provided"),
        userNotFoundMsg: api_exception_1.default.HTTP400Error("User not found"),
        chatNotFound: api_exception_1.default.HTTP404Error("Chat not found"),
        conversationNotFound: api_exception_1.default.HTTP404Error("Conversation not found"),
    };
    // Create a mock of the user service
    const users = generate_data_util_1.default.createUserList(10);
    const existingUser = users[0];
    const nonExistingUser = generate_data_util_1.default.createUser();
    // Create a mock of the chat service
    const conversations = generate_data_util_1.default.generateMockData(false, users, generate_data_util_1.default.createConversation);
    const chats = [
        generate_data_util_1.default.createMessage(conversations[0].conversation_id, conversations[0].user_one_id),
        generate_data_util_1.default.createMessage(conversations[0].conversation_id, conversations[0].user_two_id),
    ];
    (0, vitest_1.beforeEach)(() => {
        chatRepository = new chat_repository_impl_1.default();
        userRepository = new user_repository_impl_1.default();
        ChatService = new chat_service_impl_1.default(chatRepository, userRepository);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    afterAll(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("getChatHistory (Get the lists of conversation with other people)", () => {
        (0, vitest_1.test)("should return a list of conversations", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            chatRepository.getUserConversationHistoryByUserId = vitest_1.vi
                .fn()
                .mockResolvedValue(conversations);
            const result = await ChatService.getChatHistory(existingUser.user_id, []);
            (0, vitest_1.expect)(result).toEqual(conversations);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(chatRepository.getUserConversationHistoryByUserId).toHaveBeenCalledWith(existingUser.user_id, []);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            chatRepository.getUserConversationHistoryByUserId = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.getChatHistory(undefined, []))
                .rejects.toThrowError(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.getUserConversationHistoryByUserId).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when the user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            chatRepository.getUserConversationHistoryByUserId = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.getChatHistory(nonExistingUser.user_id, [])).rejects.toThrowError(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(nonExistingUser.user_id);
            (0, vitest_1.expect)(chatRepository.getUserConversationHistoryByUserId).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("getChatMessages (Get the messages of a conversation)", () => {
        (0, vitest_1.test)("should return a list of messages", async () => {
            chatRepository.findConversationById = vitest_1.vi
                .fn()
                .mockResolvedValue(conversations[0]);
            chatRepository.getMessagesById = vitest_1.vi
                .fn()
                .mockResolvedValue(chats);
            const result = await ChatService.getChatMessages(conversations[0].conversation_id, []);
            (0, vitest_1.expect)(result).toEqual(chats);
            (0, vitest_1.expect)(chatRepository.findConversationById).toHaveBeenCalledWith(conversations[0].conversation_id);
            (0, vitest_1.expect)(chatRepository.getMessagesById).toHaveBeenCalledWith(conversations[0].conversation_id, []);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            chatRepository.findConversationById = vitest_1.vi.fn();
            chatRepository.getMessagesById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.getChatMessages(undefined, [])).rejects.toThrowError(error.noArgsMsg);
            (0, vitest_1.expect)(chatRepository.findConversationById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.getMessagesById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when the chat is not found", async () => {
            chatRepository.findConversationById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            chatRepository.getMessagesById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.getChatMessages(conversations[0].conversation_id, [])).rejects.toThrowError(error.chatNotFound);
            (0, vitest_1.expect)(chatRepository.findConversationById).toHaveBeenCalledWith(conversations[0].conversation_id);
            (0, vitest_1.expect)(chatRepository.getMessagesById).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("newMessageAndConversation (Create a new message and conversation)", () => {
        (0, vitest_1.test)("should return a success message", async () => {
            chatRepository.findConversationById = vitest_1.vi
                .fn()
                .mockResolvedValue(conversations[0]);
            chatRepository.saveNewConversation = vitest_1.vi
                .fn()
                .mockResolvedValue(conversations[0].conversation_id);
            chatRepository.saveNewMessage = vitest_1.vi
                .fn()
                .mockResolvedValue("Message sent successfully");
            const result = await ChatService.newMessageAndConversation(conversations[0].conversation_id, chats[0]);
            (0, vitest_1.expect)(result).toEqual("Message sent successfully");
            (0, vitest_1.expect)(chatRepository.findConversationById).toHaveBeenCalledWith(conversations[0].conversation_id);
            (0, vitest_1.expect)(chatRepository.saveNewConversation).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.saveNewMessage).toHaveBeenCalledWith(chats[0]);
        });
        (0, vitest_1.test)("should create a new conversation and return a success message", async () => {
            chatRepository.findConversationById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            chatRepository.saveNewConversation = vitest_1.vi
                .fn()
                .mockResolvedValue(conversations[0].conversation_id);
            chatRepository.saveNewMessage = vitest_1.vi
                .fn()
                .mockResolvedValue("Message sent successfully");
            const result = await ChatService.newMessageAndConversation(conversations[0].conversation_id, chats[0]);
            (0, vitest_1.expect)(result).toEqual("Message sent successfully");
            (0, vitest_1.expect)(chatRepository.findConversationById).toHaveBeenCalledWith(conversations[0].conversation_id);
            (0, vitest_1.expect)(chatRepository.saveNewConversation).toHaveBeenCalledWith({
                user_one_id: chats[0].sender_id,
                user_two_id: chats[0].receiver_id,
            });
            (0, vitest_1.expect)(chatRepository.saveNewMessage).toHaveBeenCalledWith(chats[0]);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            chatRepository.findConversationById = vitest_1.vi.fn();
            chatRepository.saveNewConversation = vitest_1.vi.fn();
            chatRepository.saveNewMessage = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.newMessageAndConversation(undefined, chats[0])).rejects.toThrowError(error.noArgsMsg);
            (0, vitest_1.expect)(chatRepository.findConversationById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.saveNewConversation).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.saveNewMessage).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("deleteConversationById (Delete user's conversation)", () => {
        (0, vitest_1.test)("should return a success message", async () => {
            chatRepository.findConversationById = vitest_1.vi
                .fn()
                .mockResolvedValue(conversations[0]);
            chatRepository.deleteConversationById = vitest_1.vi.fn();
            const result = await ChatService.deleteConversationById(conversations[0].conversation_id);
            (0, vitest_1.expect)(result).toEqual("Conversation deleted successfully");
            (0, vitest_1.expect)(chatRepository.findConversationById).toHaveBeenCalledWith(conversations[0].conversation_id);
            (0, vitest_1.expect)(chatRepository.deleteConversationById).toHaveBeenCalledWith(conversations[0].conversation_id);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            chatRepository.findConversationById = vitest_1.vi.fn();
            chatRepository.deleteConversationById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.deleteConversationById(undefined)).rejects.toThrowError(error.noArgsMsg);
            (0, vitest_1.expect)(chatRepository.findConversationById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.deleteConversationById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when the conversation is not found", async () => {
            chatRepository.findConversationById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            chatRepository.deleteConversationById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.deleteConversationById(conversations[0].conversation_id)).rejects.toThrowError(error.conversationNotFound);
            (0, vitest_1.expect)(chatRepository.findConversationById).toHaveBeenCalledWith(conversations[0].conversation_id);
            (0, vitest_1.expect)(chatRepository.deleteConversationById).not.toHaveBeenCalled();
        });
    });
});

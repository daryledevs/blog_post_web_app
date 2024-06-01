"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_service_impl_1 = __importDefault(require("@/services/chat/chat.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const chat_repository_impl_1 = __importDefault(require("@/repositories/chat/chat.repository.impl"));
const generate_data_util_1 = __importDefault(require("../../utils/generate-data.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
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
    const otherExistingUser = users[1];
    const nonExistingUser = generate_data_util_1.default.createUser();
    // Create a mock of the chat service
    const conversations = generate_data_util_1.default.generateMockData(false, users, generate_data_util_1.default.createConversation);
    const messages = [
        generate_data_util_1.default.createMessage(conversations[0].id, existingUser.id),
        generate_data_util_1.default.createMessage(conversations[0].id, otherExistingUser.id),
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
            chatRepository.findAllConversationByUserId = vitest_1.vi
                .fn()
                .mockResolvedValue(conversations);
            const result = await ChatService.getChatHistory(existingUser.uuid, []);
            (0, vitest_1.expect)(result).toEqual(conversations);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(chatRepository.findAllConversationByUserId).toHaveBeenCalledWith(existingUser.id, []);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            chatRepository.findAllConversationByUserId = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.getChatHistory(undefined, []))
                .rejects.toThrowError(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.findAllConversationByUserId).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when the user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            chatRepository.findAllConversationByUserId = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.getChatHistory(nonExistingUser.uuid, [])).rejects.toThrowError(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(nonExistingUser.uuid);
            (0, vitest_1.expect)(chatRepository.findAllConversationByUserId).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("getChatMessages (Get the messages of a conversation)", () => {
        (0, vitest_1.test)("should return a list of messages", async () => {
            chatRepository.findOneConversationById = vitest_1.vi
                .fn()
                .mockResolvedValue(conversations[0]);
            chatRepository.findAllMessagesById = vitest_1.vi
                .fn()
                .mockResolvedValue(messages);
            const result = await ChatService.getChatMessages(messages[0].uuid, []);
            (0, vitest_1.expect)(result).toEqual(messages);
            (0, vitest_1.expect)(chatRepository.findOneConversationById).toHaveBeenCalledWith(messages[0].uuid);
            (0, vitest_1.expect)(chatRepository.findAllMessagesById).toHaveBeenCalledWith(conversations[0].id, []);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            chatRepository.findOneConversationById = vitest_1.vi.fn();
            chatRepository.findAllMessagesById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.getChatMessages(undefined, [])).rejects.toThrowError(error.noArgsMsg);
            (0, vitest_1.expect)(chatRepository.findOneConversationById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.findAllMessagesById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when the chat is not found", async () => {
            chatRepository.findOneConversationById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            chatRepository.findAllMessagesById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.getChatMessages(conversations[0].uuid, [])).rejects.toThrowError(error.chatNotFound);
            (0, vitest_1.expect)(chatRepository.findOneConversationById).toHaveBeenCalledWith(conversations[0].uuid);
            (0, vitest_1.expect)(chatRepository.findAllMessagesById).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("newMessageAndConversation (Create a new message and conversation)", () => {
        (0, vitest_1.test)("should return a success message", async () => {
            const newMessage = {
                conversation_id: conversations[0].uuid,
                sender_id: existingUser.uuid,
                receiver_id: otherExistingUser.uuid,
                text_message: messages[0].text_message,
            };
            const saveMessage = {
                text_message: newMessage.text_message,
                conversation_id: conversations[0].id,
                sender_id: existingUser.id,
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUser))
                .mockImplementationOnce(() => Promise.resolve(otherExistingUser));
            chatRepository.findOneConversationById = vitest_1.vi
                .fn()
                .mockResolvedValue(conversations[0]);
            chatRepository.findOneConversationByMembersId = vitest_1.vi.fn();
            chatRepository.saveNewConversation = vitest_1.vi.fn();
            chatRepository.saveNewMessage = vitest_1.vi
                .fn()
                .mockResolvedValue("Message sent successfully");
            const result = await ChatService.newMessageAndConversation(newMessage);
            (0, vitest_1.expect)(result).toEqual("Message sent successfully");
            (0, vitest_1.expect)(chatRepository.findOneConversationById).toHaveBeenCalledWith(newMessage.conversation_id);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(chatRepository.findOneConversationByMembersId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.saveNewConversation).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.saveNewMessage).toHaveBeenCalledWith(saveMessage);
        });
        (0, vitest_1.test)("should create a new conversation and return a success message", async () => {
            const members = [existingUser.id, otherExistingUser.id];
            const saveMultipleMembers = [
                { conversation_id: conversations[0].id, user_id: existingUser.id },
                { conversation_id: conversations[0].id, user_id: otherExistingUser.id },
            ];
            const newMessage = {
                conversation_id: null,
                sender_id: existingUser.uuid,
                receiver_id: otherExistingUser.uuid,
                text_message: messages[0].text_message,
            };
            const saveMessage = {
                conversation_id: conversations[0].id,
                sender_id: existingUser.id,
                text_message: newMessage.text_message,
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUser))
                .mockImplementationOnce(() => Promise.resolve(otherExistingUser));
            chatRepository.findOneConversationById = vitest_1.vi.fn();
            chatRepository.findOneConversationByMembersId = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            chatRepository.saveNewConversation = vitest_1.vi
                .fn()
                .mockResolvedValue(conversations[0].id);
            chatRepository.saveMultipleChatMembers = vitest_1.vi.fn();
            chatRepository.saveNewMessage = vitest_1.vi
                .fn()
                .mockResolvedValue("Message sent successfully");
            const result = await ChatService.newMessageAndConversation(newMessage);
            (0, vitest_1.expect)(result).toEqual("Message sent successfully");
            (0, vitest_1.expect)(chatRepository.findOneConversationByMembersId).toHaveBeenCalledWith(members);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(chatRepository.findOneConversationById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.saveNewConversation).toHaveBeenCalledWith({});
            (0, vitest_1.expect)(chatRepository.saveMultipleChatMembers).toHaveBeenCalledWith(saveMultipleMembers);
            (0, vitest_1.expect)(chatRepository.saveNewMessage).toHaveBeenCalledWith(saveMessage);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            chatRepository.findOneConversationById = vitest_1.vi.fn();
            chatRepository.findOneConversationByMembersId = vitest_1.vi.fn();
            chatRepository.saveNewConversation = vitest_1.vi.fn();
            chatRepository.saveNewMessage = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.newMessageAndConversation(undefined)).rejects.toThrowError(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled;
            (0, vitest_1.expect)(chatRepository.findOneConversationById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.findOneConversationByMembersId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.saveNewConversation).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.saveNewMessage).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("deleteConversationById (Delete user's conversation)", () => {
        (0, vitest_1.test)("should return a success message", async () => {
            chatRepository.findOneConversationById = vitest_1.vi
                .fn()
                .mockResolvedValue(conversations[0]);
            chatRepository.deleteConversationById = vitest_1.vi.fn();
            const result = await ChatService.deleteConversationById(conversations[0].uuid);
            (0, vitest_1.expect)(result).toEqual("Conversation deleted successfully");
            (0, vitest_1.expect)(chatRepository.findOneConversationById).toHaveBeenCalledWith(conversations[0].uuid);
            (0, vitest_1.expect)(chatRepository.deleteConversationById).toHaveBeenCalledWith(conversations[0].id);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            chatRepository.findOneConversationById = vitest_1.vi.fn();
            chatRepository.deleteConversationById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.deleteConversationById(undefined)).rejects.toThrowError(error.noArgsMsg);
            (0, vitest_1.expect)(chatRepository.findOneConversationById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.deleteConversationById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when the conversation is not found", async () => {
            chatRepository.findOneConversationById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            chatRepository.deleteConversationById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.deleteConversationById(conversations[0].uuid)).rejects.toThrowError(error.conversationNotFound);
            (0, vitest_1.expect)(chatRepository.findOneConversationById).toHaveBeenCalledWith(conversations[0].uuid);
            (0, vitest_1.expect)(chatRepository.deleteConversationById).not.toHaveBeenCalled();
        });
    });
});

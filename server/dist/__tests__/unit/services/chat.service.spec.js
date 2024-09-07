"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const vitest_1 = require("vitest");
const user_dto_1 = __importDefault(require("@/domain/dto/user.dto"));
const chat_service_impl_1 = __importDefault(require("@/application/services/chat/chat.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const chat_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/chat.repository.impl"));
const conversation_dto_1 = __importDefault(require("@/domain/dto/conversation.dto"));
const generate_data_util_1 = __importDefault(require("@/__tests__/utils/generate-data.util"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const class_transformer_1 = require("class-transformer");
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
    const existingUserDto = (0, class_transformer_1.plainToInstance)(user_dto_1.default, existingUser);
    const otherExistingUser = users[1];
    const otherExistingUserDto = (0, class_transformer_1.plainToInstance)(user_dto_1.default, otherExistingUser);
    const nonExistingUser = generate_data_util_1.default.createUser();
    const nonExistingUserDto = (0, class_transformer_1.plainToInstance)(user_dto_1.default, nonExistingUser);
    // Create a mock of the chat service
    const conversations = generate_data_util_1.default.generateMockData(false, users, generate_data_util_1.default.createConversation);
    const conversationDto = (0, class_transformer_1.plainToInstance)(conversation_dto_1.default, conversations);
    const existingConversationDto = (0, class_transformer_1.plainToInstance)(conversation_dto_1.default, conversationDto);
    const messages = [
        generate_data_util_1.default.createMessage(existingConversationDto.getUuid(), existingUserDto.getId()),
        generate_data_util_1.default.createMessage(existingConversationDto.getUuid(), otherExistingUserDto.getId()),
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
                .mockResolvedValue(existingUserDto);
            chatRepository.findAllConversationByUserId = vitest_1.vi
                .fn()
                .mockResolvedValue(conversations);
            const result = await ChatService.getChatHistory(existingUserDto.getUuid(), []);
            (0, vitest_1.expect)(result).toEqual(conversations);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUserDto.getUuid());
            (0, vitest_1.expect)(chatRepository.findAllConversationByUserId).toHaveBeenCalledWith(existingUserDto.getUuid(), []);
        });
        (0, vitest_1.test)("should throw an error when the user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            chatRepository.findAllConversationByUserId = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.getChatHistory(nonExistingUserDto.getUuid(), [])).rejects.toThrowError(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(nonExistingUserDto.getUuid());
            (0, vitest_1.expect)(chatRepository.findAllConversationByUserId).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("getChatMessages (Get the messages of a conversation)", () => {
        (0, vitest_1.test)("should return a list of messages", async () => {
            chatRepository.findOneConversationByUuId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingConversationDto);
            chatRepository.findAllMessagesById = vitest_1.vi
                .fn()
                .mockResolvedValue(messages);
            const result = await ChatService.getChatMessages(messages[0].uuid, []);
            (0, vitest_1.expect)(result).toEqual(messages);
            (0, vitest_1.expect)(chatRepository.findOneConversationByUuId).toHaveBeenCalledWith(messages[0].uuid);
            (0, vitest_1.expect)(chatRepository.findAllMessagesById).toHaveBeenCalledWith(existingConversationDto.getUuid(), []);
        });
        (0, vitest_1.test)("should throw an error when the chat is not found", async () => {
            chatRepository.findOneConversationByUuId = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            chatRepository.findAllMessagesById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.getChatMessages(existingConversationDto.getUuid(), [])).rejects.toThrowError(error.chatNotFound);
            (0, vitest_1.expect)(chatRepository.findOneConversationByUuId).toHaveBeenCalledWith(existingConversationDto.getUuid());
            (0, vitest_1.expect)(chatRepository.findAllMessagesById).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("newMessageAndConversation (Create a new message and conversation)", () => {
        (0, vitest_1.test)("should return a success message", async () => {
            const newMessage = {
                conversation_uuid: existingConversationDto.getUuid(),
                sender_uuid: existingUserDto.getUuid(),
                receiver_uuid: otherExistingUserDto.getUuid(),
                text_message: messages[0].text_message,
            };
            const saveMessage = {
                text_message: newMessage.text_message,
                conversation_uuid: existingConversationDto.getUuid(),
                sender_uuid: existingUserDto.getUuid(),
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUserDto))
                .mockImplementationOnce(() => Promise.resolve(otherExistingUserDto));
            chatRepository.findOneConversationByUuId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingConversationDto);
            chatRepository.findOneConversationByMembersId = vitest_1.vi.fn();
            chatRepository.saveNewConversation = vitest_1.vi.fn();
            chatRepository.saveNewMessage = vitest_1.vi
                .fn()
                .mockResolvedValue("Message sent successfully");
            const result = await ChatService.newMessageAndConversation(newMessage);
            (0, vitest_1.expect)(result).toEqual("Message sent successfully");
            (0, vitest_1.expect)(chatRepository.findOneConversationByUuId).toHaveBeenCalledWith(newMessage.conversation_uuid);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(chatRepository.findOneConversationByMembersId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.saveNewConversation).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.saveNewMessage).toHaveBeenCalledWith(saveMessage);
        });
        (0, vitest_1.test)("should create a new conversation and return a success message", async () => {
            const members = [existingUserDto.getUuid(), otherExistingUserDto.getId()];
            const saveMultipleMembers = [
                { conversation_uuid: existingConversationDto.getUuid(), user_id: existingUserDto.getUuid() },
                { conversation_uuid: existingConversationDto.getUuid(), user_id: otherExistingUserDto.getId() },
            ];
            const newMessage = {
                conversation_uuid: null,
                sender_uuid: existingUserDto.getUuid(),
                receiver_uuid: otherExistingUserDto.getUuid(),
                text_message: messages[0].text_message,
            };
            const saveMessage = {
                conversation_uuid: existingConversationDto.getUuid(),
                sender_uuid: existingUserDto.getUuid(),
                text_message: newMessage.text_message,
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUserDto))
                .mockImplementationOnce(() => Promise.resolve(otherExistingUser));
            chatRepository.findOneConversationByUuId = vitest_1.vi.fn();
            chatRepository.findOneConversationByMembersId = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            chatRepository.saveNewConversation = vitest_1.vi
                .fn()
                .mockResolvedValue(existingConversationDto.getUuid());
            chatRepository.saveMultipleChatMembers = vitest_1.vi.fn();
            chatRepository.saveNewMessage = vitest_1.vi
                .fn()
                .mockResolvedValue("Message sent successfully");
            const result = await ChatService.newMessageAndConversation(newMessage);
            (0, vitest_1.expect)(result).toEqual("Message sent successfully");
            (0, vitest_1.expect)(chatRepository.findOneConversationByMembersId).toHaveBeenCalledWith(members);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(chatRepository.findOneConversationByUuId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(chatRepository.saveNewConversation).toHaveBeenCalledWith({});
            (0, vitest_1.expect)(chatRepository.saveMultipleChatMembers).toHaveBeenCalledWith(saveMultipleMembers);
            (0, vitest_1.expect)(chatRepository.saveNewMessage).toHaveBeenCalledWith(saveMessage);
        });
    });
    (0, vitest_1.describe)("deleteConversationById (Delete user's conversation)", () => {
        (0, vitest_1.test)("should return a success message", async () => {
            chatRepository.findOneConversationByUuId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingConversationDto);
            chatRepository.deleteConversationById = vitest_1.vi.fn();
            const result = await ChatService.deleteConversationById(existingConversationDto.getUuid());
            (0, vitest_1.expect)(result).toEqual("Conversation deleted successfully");
            (0, vitest_1.expect)(chatRepository.findOneConversationByUuId).toHaveBeenCalledWith(existingConversationDto.getUuid());
            (0, vitest_1.expect)(chatRepository.deleteConversationById).toHaveBeenCalledWith(existingConversationDto.getUuid());
        });
        (0, vitest_1.test)("should throw an error when the conversation is not found", async () => {
            chatRepository.findOneConversationByUuId = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            chatRepository.deleteConversationById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(ChatService.deleteConversationById(existingConversationDto.getUuid())).rejects.toThrowError(error.conversationNotFound);
            (0, vitest_1.expect)(chatRepository.findOneConversationByUuId).toHaveBeenCalledWith(existingConversationDto.getUuid());
            (0, vitest_1.expect)(chatRepository.deleteConversationById).not.toHaveBeenCalled();
        });
    });
});

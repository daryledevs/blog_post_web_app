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
});

import ChatServices                                          from "@/services/chat/chat.service.impl";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import ChatsRepository                                       from "@/repositories/chat/chat.repository.impl";
import ApiErrorException                                     from "@/exceptions/api.exception";
import GenerateMockData                                      from "../../utils/generate-data.util";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/repositories/user/user.repository.impl");

vi.mock("@/repositories/chat/chat.repository.impl");

describe("ChatService", () => {
  // Test variables
  let chatRepository: ChatsRepository;
  let userRepository: UserRepository;
  let ChatService: ChatServices;

  // Error messages
  const error = {
    noArgsMsg: ApiErrorException.HTTP400Error("No arguments provided"),
    userNotFoundMsg: ApiErrorException.HTTP400Error("User not found"),
  };

  // Create a mock of the user service
  const users = GenerateMockData.createUserList(10);
  const existingUser = users[0]!;
  const nonExistingUser = GenerateMockData.createUser();

  // Create a mock of the chat service
  const conversations = GenerateMockData.generateMockData(
    false,
    users,
    GenerateMockData.createConversation
  );

  const chats = [
    GenerateMockData.createMessage(
      conversations[0]!.conversation_id,
      conversations[0]!.user_one_id,
    ),
    GenerateMockData.createMessage(
      conversations[0]!.conversation_id,
      conversations[0]!.user_two_id,
    ),
  ];

  beforeEach(() => {
    chatRepository = new ChatsRepository();
    userRepository = new UserRepository();
    ChatService = new ChatServices(chatRepository, userRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("getChatHistory (Get the lists of conversation with other people)", () => {
    test("should return a list of conversations", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);
      
      chatRepository.getUserConversationHistoryByUserId = vi  
        .fn()
        .mockResolvedValue(conversations);

      const result = await ChatService.getChatHistory(existingUser.user_id, []);

      expect(result).toEqual(conversations);
      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(
        chatRepository.getUserConversationHistoryByUserId
      ).toHaveBeenCalledWith(existingUser.user_id, []);
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      chatRepository.getUserConversationHistoryByUserId = vi.fn();

      await expect(
        ChatService.getChatHistory(undefined, []))
      .rejects.toThrowError(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(
        chatRepository.getUserConversationHistoryByUserId
      ).not.toHaveBeenCalled();
    });

    test("should throw an error when the user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      chatRepository.getUserConversationHistoryByUserId = vi.fn();

      await expect(
        ChatService.getChatHistory(nonExistingUser.user_id, [])
      ).rejects.toThrowError(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(nonExistingUser.user_id);
      expect(
        chatRepository.getUserConversationHistoryByUserId
      ).not.toHaveBeenCalled();
    });
  });
});
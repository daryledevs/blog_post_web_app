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
    chatNotFound: ApiErrorException.HTTP404Error("Chat not found"),
    conversationNotFound: ApiErrorException.HTTP404Error(
      "Conversation not found"
    ),
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

      expect(userRepository.findUserById).toHaveBeenCalledWith(
        nonExistingUser.user_id
      );

      expect(
        chatRepository.getUserConversationHistoryByUserId
      ).not.toHaveBeenCalled();
    });
  });

  describe("getChatMessages (Get the messages of a conversation)", () => {
    test("should return a list of messages", async () => {
      chatRepository.findConversationByConversationId = vi
        .fn()
        .mockResolvedValue(conversations[0]);

      chatRepository.getMessagesByConversationId = vi
        .fn()
        .mockResolvedValue(chats);

      const result = await ChatService.getChatMessages(conversations[0].conversation_id, []);

      expect(result).toEqual(chats);

      expect(
        chatRepository.findConversationByConversationId
      ).toHaveBeenCalledWith(conversations[0].conversation_id);

      expect(chatRepository.getMessagesByConversationId).toHaveBeenCalledWith(
        conversations[0].conversation_id,
        []
      );
    });

    test("should throw an error when no args are provided", async () => {
      chatRepository.findConversationByConversationId = vi.fn();
      chatRepository.getMessagesByConversationId = vi.fn();

      await expect(
        ChatService.getChatMessages(undefined, [])
      ).rejects.toThrowError(error.noArgsMsg);

      expect(chatRepository.findConversationByConversationId).not.toHaveBeenCalled();
      expect(chatRepository.getMessagesByConversationId).not.toHaveBeenCalled();
    });

    test("should throw an error when the chat is not found", async () => {
      chatRepository.findConversationByConversationId = vi
        .fn()
        .mockResolvedValue(undefined);

      chatRepository.getMessagesByConversationId = vi.fn();

      await expect(
        ChatService.getChatMessages(conversations[0].conversation_id, [])
      ).rejects.toThrowError(error.chatNotFound);

      expect(
        chatRepository.findConversationByConversationId
      ).toHaveBeenCalledWith(conversations[0].conversation_id);

      expect(chatRepository.getMessagesByConversationId).not.toHaveBeenCalled();
    });
  });

  describe("newMessageAndConversation (Create a new message and conversation)", () => {
    test("should return a success message", async () => {
      chatRepository.findConversationByConversationId = vi
        .fn()
        .mockResolvedValue(conversations[0]);

      chatRepository.saveNewConversation = vi
        .fn()
        .mockResolvedValue(conversations[0].conversation_id);

      chatRepository.saveNewMessage = vi
        .fn()
        .mockResolvedValue("Message sent successfully");

      const result = await ChatService.newMessageAndConversation(
        conversations[0].conversation_id,
        chats[0]
      );

      expect(result).toEqual("Message sent successfully");

      expect(
        chatRepository.findConversationByConversationId
      ).toHaveBeenCalledWith(conversations[0].conversation_id);

      expect(chatRepository.saveNewConversation).not.toHaveBeenCalled();
      expect(chatRepository.saveNewMessage).toHaveBeenCalledWith(chats[0]);
    });

    test("should create a new conversation and return a success message", async () => {
      chatRepository.findConversationByConversationId = vi
        .fn()
        .mockResolvedValue(undefined);

      chatRepository.saveNewConversation = vi
        .fn()
        .mockResolvedValue(conversations[0].conversation_id);

      chatRepository.saveNewMessage = vi
        .fn()
        .mockResolvedValue("Message sent successfully");

      const result = await ChatService.newMessageAndConversation(
        conversations[0].conversation_id,
        chats[0]
      );

      expect(result).toEqual("Message sent successfully");

      expect(
        chatRepository.findConversationByConversationId
      ).toHaveBeenCalledWith(conversations[0].conversation_id);

      expect(chatRepository.saveNewConversation).toHaveBeenCalledWith({
        user_one_id: chats[0].sender_id,
        user_two_id: chats[0].receiver_id,
      });

      expect(chatRepository.saveNewMessage).toHaveBeenCalledWith(chats[0]);
    });

    test("should throw an error when no args are provided", async () => {
      chatRepository.findConversationByConversationId = vi.fn();
      chatRepository.saveNewConversation = vi.fn();
      chatRepository.saveNewMessage = vi.fn();

      await expect(
        ChatService.newMessageAndConversation(undefined, chats[0])
      ).rejects.toThrowError(error.noArgsMsg);

      expect(chatRepository.findConversationByConversationId).not.toHaveBeenCalled();
      expect(chatRepository.saveNewConversation).not.toHaveBeenCalled();
      expect(chatRepository.saveNewMessage).not.toHaveBeenCalled();
    });
  });

  describe("deleteConversation (Delete user's conversation)", () => {
    test("should return a success message", async () => {
      chatRepository.findConversationByConversationId = vi
        .fn()
        .mockResolvedValue(conversations[0]);

      chatRepository.deleteConversation = vi.fn();

      const result = await ChatService.deleteConversation(conversations[0].conversation_id);

      expect(result).toEqual("Conversation deleted successfully");
      expect(
        chatRepository.findConversationByConversationId
      ).toHaveBeenCalledWith(conversations[0].conversation_id);

      expect(chatRepository.deleteConversation).toHaveBeenCalledWith(
        conversations[0].conversation_id
      );
    });

    test("should throw an error when no args are provided", async () => {
      chatRepository.findConversationByConversationId = vi.fn();
      chatRepository.deleteConversation = vi.fn();

      await expect(
        ChatService.deleteConversation(undefined)
      ).rejects.toThrowError(error.noArgsMsg);

      expect(chatRepository.findConversationByConversationId).not.toHaveBeenCalled();
      expect(chatRepository.deleteConversation).not.toHaveBeenCalled();
    });

    test("should throw an error when the conversation is not found", async () => {
      chatRepository.findConversationByConversationId = vi
        .fn()
        .mockResolvedValue(undefined);

      chatRepository.deleteConversation = vi.fn();

      await expect(
        ChatService.deleteConversation(conversations[0].conversation_id)
      ).rejects.toThrowError(error.conversationNotFound);

      expect(
        chatRepository.findConversationByConversationId
      ).toHaveBeenCalledWith(conversations[0].conversation_id);

      expect(chatRepository.deleteConversation).not.toHaveBeenCalled();
    });
  });
});
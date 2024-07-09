import ChatServices                                          from "@/application/services/chat/chat.service.impl";
import IEChatService                                         from "@/application/services/chat/chat.service";
import UserRepository                                        from "@/infrastructure/repositories/user.repository.impl";
import ChatsRepository                                       from "@/infrastructure/repositories/chat.repository.impl";
import GenerateMockData                                      from "@/__tests__/utils/generate-data.util";
import IEChatRepository                                      from "@/domain/repositories/chat.repository";
import IEUserRepository                                      from "@/domain/repositories/user.repository";
import ApiErrorException                                     from "@/application/exceptions/api.exception";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/repositories/user/user.repository.impl");

vi.mock("@/repositories/chat/chat.repository.impl");

describe("ChatService", () => {
  // Test variables
  let chatRepository: IEChatRepository;
  let userRepository: IEUserRepository;
  let ChatService:    IEChatService;

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
  const otherExistingUser = users[1]!;
  const nonExistingUser = GenerateMockData.createUser();

  // Create a mock of the chat service
  const conversations = GenerateMockData.generateMockData(
    false,
    users,
    GenerateMockData.createConversation
  );

  const messages = [
    GenerateMockData.createMessage(
      conversations[0]!.id,
      existingUser.id
    ),
    GenerateMockData.createMessage(
      conversations[0]!.id,
      otherExistingUser.id,
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
      
      chatRepository.findAllConversationByUserId = vi  
        .fn()
        .mockResolvedValue(conversations);

      const result = await ChatService.getChatHistory(existingUser.uuid, []);

      expect(result).toEqual(conversations);
      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
      expect(chatRepository.findAllConversationByUserId).toHaveBeenCalledWith(
        existingUser.id,
        []
      );
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      chatRepository.findAllConversationByUserId = vi.fn();

      await expect(
        ChatService.getChatHistory(undefined, []))
      .rejects.toThrowError(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();

      expect(
        chatRepository.findAllConversationByUserId
      ).not.toHaveBeenCalled();
    });

    test("should throw an error when the user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      chatRepository.findAllConversationByUserId = vi.fn();

      await expect(
        ChatService.getChatHistory(nonExistingUser.uuid, [])
      ).rejects.toThrowError(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(
        nonExistingUser.uuid
      );

      expect(
        chatRepository.findAllConversationByUserId
      ).not.toHaveBeenCalled();
    });
  });

  describe("getChatMessages (Get the messages of a conversation)", () => {
    test("should return a list of messages", async () => {
      chatRepository.findOneConversationById = vi
        .fn()
        .mockResolvedValue(conversations[0]);

      chatRepository.findAllMessagesById = vi
        .fn()
        .mockResolvedValue(messages);

      const result = await ChatService.getChatMessages(messages[0]!.uuid, []);

      expect(result).toEqual(messages);

      expect(chatRepository.findOneConversationById).toHaveBeenCalledWith(
        messages[0]!.uuid
      );

      expect(chatRepository.findAllMessagesById).toHaveBeenCalledWith(
        conversations[0].id,
        []
      );
    });

    test("should throw an error when no args are provided", async () => {
      chatRepository.findOneConversationById = vi.fn();
      chatRepository.findAllMessagesById = vi.fn();

      await expect(
        ChatService.getChatMessages(undefined, [])
      ).rejects.toThrowError(error.noArgsMsg);

      expect(chatRepository.findOneConversationById).not.toHaveBeenCalled();
      expect(chatRepository.findAllMessagesById).not.toHaveBeenCalled();
    });

    test("should throw an error when the chat is not found", async () => {
      chatRepository.findOneConversationById = vi
        .fn()
        .mockResolvedValue(undefined);

      chatRepository.findAllMessagesById = vi.fn();

      await expect(
        ChatService.getChatMessages(conversations[0].uuid, [])
      ).rejects.toThrowError(error.chatNotFound);

      expect(
        chatRepository.findOneConversationById
      ).toHaveBeenCalledWith(conversations[0].uuid);

      expect(chatRepository.findAllMessagesById).not.toHaveBeenCalled();
    });
  });

  describe("newMessageAndConversation (Create a new message and conversation)", () => {
    test("should return a success message", async () => {
      const newMessage = {
        conversation_id: conversations[0].uuid,
        sender_id: existingUser.uuid,
        receiver_id: otherExistingUser.uuid,
        text_message: messages[0]!.text_message,
      };

      const saveMessage = {
        text_message: newMessage.text_message,
        conversation_id: conversations[0].id,
        sender_id: existingUser.id,
      };

      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUser))
        .mockImplementationOnce(() => Promise.resolve(otherExistingUser));
      
      chatRepository.findOneConversationById = vi
        .fn()
        .mockResolvedValue(conversations[0]);
      
      chatRepository.findOneConversationByMembersId = vi.fn();

      chatRepository.saveNewConversation = vi.fn()

      chatRepository.saveNewMessage = vi
        .fn()
        .mockResolvedValue("Message sent successfully");

      const result = await ChatService.newMessageAndConversation(newMessage);

      expect(result).toEqual("Message sent successfully");

      expect(
        chatRepository.findOneConversationById
      ).toHaveBeenCalledWith(newMessage.conversation_id);
      
      expect(userRepository.findUserById).toHaveBeenCalledTimes(2);
      expect(chatRepository.findOneConversationByMembersId).not.toHaveBeenCalled();
      expect(chatRepository.saveNewConversation).not.toHaveBeenCalled();
      expect(chatRepository.saveNewMessage).toHaveBeenCalledWith(saveMessage);
    });

    test("should create a new conversation and return a success message", async () => {
      const members = [existingUser.id, otherExistingUser.id];

      const saveMultipleMembers = [
        { conversation_id: conversations[0].id, user_id: existingUser.id },
        { conversation_id: conversations[0].id, user_id: otherExistingUser.id },
      ];

      const newMessage = {
        conversation_id: null as any,
        sender_id: existingUser.uuid,
        receiver_id: otherExistingUser.uuid,
        text_message: messages[0]!.text_message,
      };

      const saveMessage = {
        conversation_id: conversations[0].id,
        sender_id: existingUser.id,
        text_message: newMessage.text_message,
      };

      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUser))
        .mockImplementationOnce(() => Promise.resolve(otherExistingUser));

      chatRepository.findOneConversationById = vi.fn()
      
      chatRepository.findOneConversationByMembersId = vi
        .fn()
        .mockResolvedValue(undefined);

      chatRepository.saveNewConversation = vi
        .fn()
        .mockResolvedValue(conversations[0].id);

      chatRepository.saveMultipleChatMembers = vi.fn()

      chatRepository.saveNewMessage = vi
        .fn()
        .mockResolvedValue("Message sent successfully");

      const result = await ChatService.newMessageAndConversation(newMessage);

      expect(result).toEqual("Message sent successfully");

      expect(
        chatRepository.findOneConversationByMembersId
      ).toHaveBeenCalledWith(members);
      expect(userRepository.findUserById).toHaveBeenCalledTimes(2);
      expect(chatRepository.findOneConversationById).not.toHaveBeenCalled();
      expect(chatRepository.saveNewConversation).toHaveBeenCalledWith({});
      expect(chatRepository.saveMultipleChatMembers).toHaveBeenCalledWith(saveMultipleMembers);
      expect(chatRepository.saveNewMessage).toHaveBeenCalledWith(saveMessage);
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      chatRepository.findOneConversationById = vi.fn();
      chatRepository.findOneConversationByMembersId = vi.fn();
      chatRepository.saveNewConversation = vi.fn();
      chatRepository.saveNewMessage = vi.fn();

      await expect(
        ChatService.newMessageAndConversation(undefined)
      ).rejects.toThrowError(error.noArgsMsg);
      
      expect(userRepository.findUserById).not.toHaveBeenCalled;
      expect(chatRepository.findOneConversationById).not.toHaveBeenCalled();
      expect(chatRepository.findOneConversationByMembersId).not.toHaveBeenCalled();
      expect(chatRepository.saveNewConversation).not.toHaveBeenCalled();
      expect(chatRepository.saveNewMessage).not.toHaveBeenCalled();
    });
  });

  describe("deleteConversationById (Delete user's conversation)", () => {
    test("should return a success message", async () => {
      chatRepository.findOneConversationById = vi
        .fn()
        .mockResolvedValue(conversations[0]);

      chatRepository.deleteConversationById = vi.fn();

      const result = await ChatService.deleteConversationById(conversations[0].uuid);

      expect(result).toEqual("Conversation deleted successfully");
      expect(
        chatRepository.findOneConversationById
      ).toHaveBeenCalledWith(conversations[0].uuid);

      expect(chatRepository.deleteConversationById).toHaveBeenCalledWith(
        conversations[0].id
      );
    });

    test("should throw an error when no args are provided", async () => {
      chatRepository.findOneConversationById = vi.fn();
      chatRepository.deleteConversationById = vi.fn();

      await expect(
        ChatService.deleteConversationById(undefined)
      ).rejects.toThrowError(error.noArgsMsg);

      expect(chatRepository.findOneConversationById).not.toHaveBeenCalled();
      expect(chatRepository.deleteConversationById).not.toHaveBeenCalled();
    });

    test("should throw an error when the conversation is not found", async () => {
      chatRepository.findOneConversationById = vi
        .fn()
        .mockResolvedValue(undefined);

      chatRepository.deleteConversationById = vi.fn();

      await expect(
        ChatService.deleteConversationById(conversations[0].uuid)
      ).rejects.toThrowError(error.conversationNotFound);

      expect(
        chatRepository.findOneConversationById
      ).toHaveBeenCalledWith(conversations[0].uuid);

      expect(chatRepository.deleteConversationById).not.toHaveBeenCalled();
    });
  });
});
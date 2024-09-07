import "reflect-metadata";
import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
}                          from "vitest";
import UserDto             from "@/domain/dto/user.dto";
import ChatServices        from "@/application/services/chat/chat.service.impl";
import IEChatService       from "@/application/services/chat/chat.service";
import UserRepository      from "@/infrastructure/repositories/user.repository.impl";
import ChatsRepository     from "@/infrastructure/repositories/chat.repository.impl";
import ConversationDto     from "@/domain/dto/conversation.dto";
import GenerateMockData    from "@/__tests__/utils/generate-data.util";
import IEChatRepository    from "@/domain/repositories/chat.repository";
import IEUserRepository    from "@/domain/repositories/user.repository";
import ApiErrorException   from "@/application/exceptions/api.exception";
import { plainToInstance } from "class-transformer";

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
  const existingUserDto = plainToInstance(UserDto, existingUser as Object);
  const otherExistingUser = users[1]!;
  const otherExistingUserDto = plainToInstance(UserDto, otherExistingUser);
  const nonExistingUser = GenerateMockData.createUser();
  const nonExistingUserDto = plainToInstance(UserDto, nonExistingUser);

  // Create a mock of the chat service
  const conversations = GenerateMockData.generateMockData(
    false,
    users,
    GenerateMockData.createConversation
  );

  const conversationDto = plainToInstance(ConversationDto, conversations);
  const existingConversationDto = plainToInstance(ConversationDto, conversationDto as Object);

  const messages = [
    GenerateMockData.createMessage(
      existingConversationDto.getUuid(),
      existingUserDto.getId()
    ),
    GenerateMockData.createMessage(
      existingConversationDto.getUuid(),
      otherExistingUserDto.getId(),
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
        .mockResolvedValue(existingUserDto);
      
      chatRepository.findAllConversationByUserId = vi  
        .fn()
        .mockResolvedValue(conversations);

      const result = await ChatService.getChatHistory(existingUserDto.getUuid(), []);

      expect(result).toEqual(conversations);
      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUserDto.getUuid());
      expect(chatRepository.findAllConversationByUserId).toHaveBeenCalledWith(
        existingUserDto.getUuid(),
        []
      );
    });

    test("should throw an error when the user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      chatRepository.findAllConversationByUserId = vi.fn();

      await expect(
        ChatService.getChatHistory(nonExistingUserDto.getUuid(), [])
      ).rejects.toThrowError(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(
        nonExistingUserDto.getUuid()
      );

      expect(
        chatRepository.findAllConversationByUserId
      ).not.toHaveBeenCalled();
    });
  });

  describe("getChatMessages (Get the messages of a conversation)", () => {
    test("should return a list of messages", async () => {
      chatRepository.findOneConversationByUuId = vi
        .fn()
        .mockResolvedValue(existingConversationDto);

      chatRepository.findAllMessagesById = vi
        .fn()
        .mockResolvedValue(messages);

      const result = await ChatService.getChatMessages(messages[0]!.uuid, []);

      expect(result).toEqual(messages);

      expect(chatRepository.findOneConversationByUuId).toHaveBeenCalledWith(
        messages[0]!.uuid
      );

      expect(chatRepository.findAllMessagesById).toHaveBeenCalledWith(
        existingConversationDto.getUuid(),
        []
      );
    });

    test("should throw an error when the chat is not found", async () => {
      chatRepository.findOneConversationByUuId = vi
        .fn()
        .mockResolvedValue(undefined);

      chatRepository.findAllMessagesById = vi.fn();

      await expect(
        ChatService.getChatMessages(existingConversationDto.getUuid(), [])
      ).rejects.toThrowError(error.chatNotFound);

      expect(
        chatRepository.findOneConversationByUuId
      ).toHaveBeenCalledWith(existingConversationDto.getUuid(),);

      expect(chatRepository.findAllMessagesById).not.toHaveBeenCalled();
    });
  });

  describe("newMessageAndConversation (Create a new message and conversation)", () => {
    test("should return a success message", async () => {
      const newMessage = {
        conversation_uuid: existingConversationDto.getUuid(),
        sender_uuid: existingUserDto.getUuid(),
        receiver_uuid: otherExistingUserDto.getUuid(),
        text_message: messages[0]!.text_message,
      };

      const saveMessage = {
        text_message: newMessage.text_message,
        conversation_uuid: existingConversationDto.getUuid(),
        sender_uuid: existingUserDto.getUuid(),
      };

      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUserDto))
        .mockImplementationOnce(() => Promise.resolve(otherExistingUserDto));
      
      chatRepository.findOneConversationByUuId = vi
        .fn()
        .mockResolvedValue(existingConversationDto);
      
      chatRepository.findOneConversationByMembersId = vi.fn();

      chatRepository.saveNewConversation = vi.fn()

      chatRepository.saveNewMessage = vi
        .fn()
        .mockResolvedValue("Message sent successfully");

      const result = await ChatService.newMessageAndConversation(newMessage);

      expect(result).toEqual("Message sent successfully");

      expect(
        chatRepository.findOneConversationByUuId
      ).toHaveBeenCalledWith(newMessage.conversation_uuid);
      
      expect(userRepository.findUserById).toHaveBeenCalledTimes(2);
      expect(chatRepository.findOneConversationByMembersId).not.toHaveBeenCalled();
      expect(chatRepository.saveNewConversation).not.toHaveBeenCalled();
      expect(chatRepository.saveNewMessage).toHaveBeenCalledWith(saveMessage);
    });

    test("should create a new conversation and return a success message", async () => {
      const members = [existingUserDto.getUuid(), otherExistingUserDto.getId()];

      const saveMultipleMembers = [
        { conversation_uuid: existingConversationDto.getUuid(), user_id: existingUserDto.getUuid() },
        { conversation_uuid: existingConversationDto.getUuid(), user_id: otherExistingUserDto.getId() },
      ];

      const newMessage = {
        conversation_uuid: null as any,
        sender_uuid: existingUserDto.getUuid(),
        receiver_uuid: otherExistingUserDto.getUuid(),
        text_message: messages[0]!.text_message,
      };

      const saveMessage = {
        conversation_uuid: existingConversationDto.getUuid(),
        sender_uuid: existingUserDto.getUuid(),
        text_message: newMessage.text_message,
      };

      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUserDto))
        .mockImplementationOnce(() => Promise.resolve(otherExistingUser));

      chatRepository.findOneConversationByUuId = vi.fn()
      
      chatRepository.findOneConversationByMembersId = vi
        .fn()
        .mockResolvedValue(undefined);

      chatRepository.saveNewConversation = vi
        .fn()
        .mockResolvedValue(existingConversationDto.getUuid(),);

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
      expect(chatRepository.findOneConversationByUuId).not.toHaveBeenCalled();
      expect(chatRepository.saveNewConversation).toHaveBeenCalledWith({});
      expect(chatRepository.saveMultipleChatMembers).toHaveBeenCalledWith(saveMultipleMembers);
      expect(chatRepository.saveNewMessage).toHaveBeenCalledWith(saveMessage);
    });
  });

  describe("deleteConversationById (Delete user's conversation)", () => {
    test("should return a success message", async () => {
      chatRepository.findOneConversationByUuId = vi
        .fn()
        .mockResolvedValue(existingConversationDto);

      chatRepository.deleteConversationById = vi.fn();

      const result = await ChatService.deleteConversationById(existingConversationDto.getUuid(),);

      expect(result).toEqual("Conversation deleted successfully");
      expect(
        chatRepository.findOneConversationByUuId
      ).toHaveBeenCalledWith(existingConversationDto.getUuid(),);

      expect(chatRepository.deleteConversationById).toHaveBeenCalledWith(
        existingConversationDto.getUuid(),
      );
    });

    test("should throw an error when the conversation is not found", async () => {
      chatRepository.findOneConversationByUuId = vi
        .fn()
        .mockResolvedValue(undefined);

      chatRepository.deleteConversationById = vi.fn();

      await expect(
        ChatService.deleteConversationById(existingConversationDto.getUuid(),)
      ).rejects.toThrowError(error.conversationNotFound);

      expect(
        chatRepository.findOneConversationByUuId
      ).toHaveBeenCalledWith(existingConversationDto.getUuid(),);

      expect(chatRepository.deleteConversationById).not.toHaveBeenCalled();
    });
  });
});
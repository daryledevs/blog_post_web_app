
import IEChatService          from "@/application/services/chat/chat.service";
import {  Request, Response } from "express";

class ChatsController {
  private chatsService: IEChatService;

  constructor(chatsService: IEChatService) {
    this.chatsService = chatsService;
  }

  public getChatHistory = async (req: Request, res: Response) => {
    const userUuid: string = req.params.userUuid as string;
    const emptyData = [0];
    const conversationIds = req.body.conversationUuids || emptyData;
    const conversationListId = conversationIds.length ? conversationIds : emptyData;
    const conversations = await this.chatsService.getChatHistory(userUuid, conversationListId);
    const conversationList = conversations.map((conversation) => conversation.getConversations());
    res.status(200).send({ conversations: conversationList });
  };

  public getChatMessages = async (req: Request, res: Response) => {
    let uuid = req.params.conversationUuid!;
    const emptyData = [0];
    const messageIds = req.body.messageIds || emptyData;
    const messageListIds = messageIds.length ? messageIds : emptyData;
    const messages = await this.chatsService.getChatMessages(uuid, messageListIds);
    const messageList = messages.map((message) => message.getChats());
    res.status(200).send({ messages: messageList });
  };

  public newMessageAndConversation = async (req: Request, res: Response) => {
    const body = req.body;
    const message = await this.chatsService.newMessageAndConversation(body);
    res.status(200).send({ message });
  };

  public deleteConversationById = async (req: Request, res: Response) => {
    const uuid = req.params.uuid!;
    const message = await this.chatsService.deleteConversationById(uuid);
    res.status(200).send({ message });
  };
};

export default ChatsController;

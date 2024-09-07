
import IEChatService          from "@/application/services/chat/chat.service";
import {  Request, Response } from "express";

class ChatsController {
  private chatsService: IEChatService;

  constructor(chatsService: IEChatService) {
    this.chatsService = chatsService;
  }

  public getChatHistory = async (req: Request, res: Response) => {
    const user_uuid: string = req.query.user_uuid as string;
    const emptyData = [0];
    const conversationIds = req.body.conversationIds || emptyData;
    const listId = conversationIds.length ? conversationIds : emptyData;
    const data = await this.chatsService.getChatHistory(user_uuid, listId);
    res.status(200).send({ chats: data });
  };

  public getChatMessages = async (req: Request, res: Response) => {
    let uuid = req.params.uuid!;
    const emptyData = [0];
    const messageIds = req.body.messageIds || emptyData;
    const listIds = messageIds.length ? messageIds : emptyData;
    const messages = await this.chatsService.getChatMessages(uuid, listIds);
    res.status(200).send({ messages: messages });
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

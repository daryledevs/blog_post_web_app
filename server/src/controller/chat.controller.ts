import ChatsServices                       from "@/service/chat/chat.service.impl";
import { NextFunction, Request, Response } from "express";

class ChatsController {
  private chatsService: ChatsServices;

  constructor(chatsService: ChatsServices) {
    this.chatsService = chatsService;
  };

  public async getChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id: any = req.query.user_id;
      const conversations = req.body || [0];
      const listId = conversations.length ? conversations : [0];

      const data = await this.chatsService.getChatHistory(user_id, listId);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    };
  };

  public async getChatMessages(req: Request, res: Response, next: NextFunction) {
    try {
      let conversation_id: any = req.params.conversation_id;
      const messages = req.body.messages || [0];
      const listId = messages.length ? messages : [0];

      const data = await this.chatsService.getChatMessages(
        conversation_id,
        listId
      );

      res.status(200).send({ chats: data });
    } catch (error) {
      next(error);
    };
  };

  public async newMessageAndConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversation_id, messageData } = req.body;

      const message = await this.chatsService.newMessageAndConversation(
        conversation_id,
        messageData
      );

      res.status(200).send({ message });
    } catch (error) {
      next(error);
    };
  };

  public async deleteConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversation_id } = req.body;
      const message = await this.chatsService.deleteConversation(conversation_id);
      res.status(200).send({ message });
    } catch (error) {
      next(error);
    };
  };
};

export default ChatsController;

import ChatsServices                       from "@/services/chat/chat.service.impl";
import AsyncWrapper                        from "@/utils/async-wrapper.util";
import { NextFunction, Request, Response } from "express";

class ChatsController {
  private chatsService: ChatsServices;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(chatsService: ChatsServices) {
    this.chatsService = chatsService;
  }

  public getChatHistory = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id: any = req.query.user_id;
      const conversations = req.body || [0];
      const listId = conversations.length ? conversations : [0];

      const data = await this.chatsService.getChatHistory(user_id, listId);
      res.status(200).send(data);
    }
  );

  public getChatMessages = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      let conversation_id: any = req.params.conversation_id;
      const messages = req.body.messages || [0];
      const listId = messages.length ? messages : [0];

      const data = await this.chatsService.getChatMessages(
        conversation_id,
        listId
      );

      res.status(200).send({ chats: data });
    }
  );

  public newMessageAndConversation = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { cookieOptions, user_id, roles, ...rest } = req.body;

      const message = await this.chatsService.newMessageAndConversation(rest);

      res.status(200).send({ message });
    }
  );

  public deleteConversationById = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { conversation_id } = req.body;
      
      const message = await this.chatsService
      .deleteConversationById(conversation_id);

      res.status(200).send({ message });
    }
  );
};

export default ChatsController;

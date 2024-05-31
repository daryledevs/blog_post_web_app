
import IEChatService                       from "@/services/chat/chat.service";
import AsyncWrapper                        from "@/utils/async-wrapper.util";
import { NextFunction, Request, Response } from "express";

class ChatsController {
  private chatsService: IEChatService;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(chatsService: IEChatService) {
    this.chatsService = chatsService;
  }

  public getChatHistory = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id: string = req.query.user_id as string;
      const conversations = req.body.conversations || [0];
      const listId = conversations.length ? conversations : [0];
      const data = await this.chatsService.getChatHistory(user_id, listId);
      res.status(200).send({ chats: data });
    }
  );

  public getChatMessages = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      let uuid = req.params.uuid;
      const messages = req.body.messages || [0];
      const listId = messages.length ? messages : [0];
      const data = await this.chatsService.getChatMessages(uuid, listId);
      res.status(200).send({ messages: data });
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
      const uuid = req.params.uuid;
      const message = await this.chatsService.deleteConversationById(uuid);
      res.status(200).send({ message });
    }
  );
};

export default ChatsController;

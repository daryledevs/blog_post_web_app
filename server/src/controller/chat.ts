import Exception                           from "../exception/exception";
import ChatRepository                      from "../repository/chat-repository";
import { NextFunction, Request, Response } from "express";

const getMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let conversation_id: any = req.params.conversation_id;
    const messages = req.body.messages || [0];
    const ids = messages.length ? messages : [0];

    const data = await ChatRepository.getMessagesByConversationId(conversation_id, ids);
    if(!data.length) return next(Exception.notFound("Messages not found"));

    res.status(200).send({ chats: data });
  } catch (error) {
    next(error)
  };
};

const getUserConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id: any = req.query.user_id;
    const conversations = req.body || [];
    const ids = conversations.length ? conversations : [0];

    const data = await ChatRepository.getUserConversationHistoryByUserId(user_id, ids);
    if (!data) return res.status(200).send({ list: data });
    return res.status(200).send({ list: data });
  } catch (error) {
    next(error);
  }
};

const newMessageAndConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sender_id, receiver_id, text_message } = req.body;
    let conversation_id: any = req.params.conversation_id;
    const data = await ChatRepository.getHistoryByConversationId(conversation_id);

    if(!data) {
      conversation_id = await ChatRepository.saveNewConversation({
        user_one_id: sender_id,
        user_two_id: receiver_id,
      });
    } 
    
    const message = await ChatRepository.saveNewMessage({
      conversation_id: conversation_id,
      sender_id,
      text_message,
    });

    return res.status(200).send({ message });
  } catch (error) {
    next(error)
  };
};

export { getMessage, newMessageAndConversation, getUserConversations };

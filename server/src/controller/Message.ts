import { Request, Response } from "express";
import database from "../database";

const getAllConversation = (req: Request, res: Response) => {
  const sql = "SELECT * FROM conversations WHERE sender_id = (?)";
  
  database.query(
    sql,
    [req.params.sender_id, req.params.receiver_id],
    (error, data) => {
      if (error) res.status(500).send({ message: error });
      return res.status(200).send({ hist: data });
    }
  );
};

const newConversation = (req: Request, res: Response) => {
  const sql = "INSERT INTO conversations (`sender_id`, `receiver_id`, `time_conversation`) VALUES (?, ?, ?, ?)";
  const time_conversation = new Date();
  const { sender_id, receiver_id } = req.body;

  database.query(
    sql,
    [sender_id, receiver_id, time_conversation],
    (error, data) => {
      if (error) res.status(500).send({ message: error });
      return res.status(200).send({ message: "New conversation created" });
    }
  );
}

const getMessage = (req: Request, res: Response) => {
  const sql = "SELECT * FROM messages WHERE conversation_id = (?)";
  
  database.query(sql, [req.params.conversation_id], (error, data) => {
    if (error) res.status(500).send({ message: error });
    return res.status(200).send({ chats: data });
  });
};

const newMessage = (req: Request, res: Response) => {
  const sql = "INSERT INTO messages (`sender_id`, `text_message`, `time_send`, `conversation_id`) VALUES (?, ?, ?, ?)";
  const time_send = new Date();
  const { sender_id, text_message, conversation_id } = req.body;

  database.query(
    sql,
    [sender_id, text_message, time_send, conversation_id],
    (error, data) => {
      if (error) res.status(500).send({ message: error });
      return res.status(200).send({ message: "New message created" });
    }
  );
};


export { newConversation, getMessage, newMessage, getAllConversation };


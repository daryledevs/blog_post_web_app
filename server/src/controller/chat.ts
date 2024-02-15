import { Request, Response } from "express";
import db from "../database/query";

const getAllChatMember = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const values = Array(3).fill(user_id);
    const sql = `
      SELECT 
        C.*,
        U.USERNAME,
        U.FIRST_NAME,
        U.LAST_NAME
      FROM
        CONVERSATIONS C
      INNER JOIN
        USERS U ON U.USER_ID = 
        CASE
          WHEN C.USER_ONE = (?) THEN C.USER_TWO
          ELSE C.USER_ONE
        END
      WHERE
        C.USER_ONE = (?) OR C.USER_TWO = (?);
    `;
    const data = await db(sql, [...values]);
    res.status(200).send({ list: data });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const getAllChats = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const conversation_id = req.query.conversation_id ? (req.query.conversation_id as string).split(',') : 0;

    const sql = `
     SELECT 
      C.*, 
      U.USER_ID, 
      U.USERNAME, 
      U.FIRST_NAME, 
      U.LAST_NAME, 
      U.AVATAR_URL 
    FROM 
      CONVERSATIONS C 
      LEFT JOIN USERS U ON U.USER_ID = 
      CASE 
        WHEN C.USER_ONE = (?) THEN C.USER_TWO 
        ELSE C.USER_ONE 
      END 
    WHERE 
      CONVERSATION_ID NOT IN (?) 
    LIMIT 
      10;
    `;

    const data = await db(sql, [user_id, conversation_id]);
    if (!data) return res.status(200).send({ data: data });
    return res.status(200).send({ data });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const newConversation = async (req: Request, res: Response) => {
  try {
    const { sender_id, receiver_id } = req.body;
    const sql = "INSERT INTO CONVERSATIONS (USER_ONE, USER_TWO) VALUES (?, ?);";
    const data = await db(sql, [sender_id, receiver_id]);

    res
      .status(200)
      .send({ message: "New conversation created", data: data });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const getMessage = async (req: Request, res: Response) => {
  try {
    const sql = `
      SELECT * FROM MESSAGES 
      WHERE CONVERSATION_ID = (?);
    `;
    const data = await db(sql, [req.params.conversation_id]);
    res.status(200).send({ chats: data });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const newMessage = async (req: Request, res: Response) => {
  try {
    const sql = `
      INSERT INTO MESSAGES 
      (SENDER_ID, CONVERSATION_ID, TEXT_MESSAGE) VALUES (?, ?, ?);
    `;
    const { sender_id, text_message, conversation_id } = req.body;
    const data = await db(sql, [sender_id, conversation_id, text_message]);
    res.status(200).send({ message: "New message created" });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

export {
  getAllChats,
  newConversation,
  getMessage,
  newMessage,
  getAllChatMember,
};

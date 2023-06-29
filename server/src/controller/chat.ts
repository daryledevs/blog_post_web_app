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
    const [data] = await db(sql, [...values]);
    res.status(200).send({ list: data });
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
};

const getAllChats = async (req: Request, res: Response) => {
  try {
    let main_arr: any[] = [];
    const length: number = parseInt(req.params.length);
    const limit = length + 4;
    const values = Array(5).fill(req.params.user_id);
    const sql = 
    `
      SELECT * FROM CONVERSATIONS WHERE USER_ONE = (?) OR USER_TWO = (?);
      SELECT 
        C.CONVERSATION_ID,
        M.MESSAGE_ID,
        C.USER_ONE,
        M.SENDER_ID,
        M.TEXT_MESSAGE,
        C.USER_TWO,
        U.USERNAME,
        U.FIRST_NAME,
        U.LAST_NAME,
        M.TIME_SENT
      FROM
        MESSAGES M
      LEFT JOIN
        CONVERSATION C ON C.CONVERSATION_ID = M.CONVERSATION_ID
      INNER JOIN
        USERS U ON U.USER_ID = 
          CASE 
            WHEN C.USER_ONE = (?) THEN C.USER_TWO
            ELSE C.USER_ONE
          END 
      WHERE 
        C.USER_ONE = (?) OR C.USER_TWO = (?);
    `;
    const [data] = await db(sql, [...values]);
    if (!data.length) return res.status(200).send({ data: data });

    for (const dataOne in data[0]) {
      let sub_arr: any[] = [];
      for (const dataTwo in data[1]) {
        const isEqual = data[0][dataOne].conversation_id === data[1][dataTwo].conversation_id
        if(isEqual) sub_arr.push(data[1][dataTwo]);
      }
      main_arr.push(sub_arr);
    }
    return res.status(200).send({ data: main_arr });
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
};

const newConversation = async (req: Request, res: Response) => {
  try {
    const { sender_id, receiver_id, text_message } = req.body;
    const sql = `
      INSERT INTO CONVERSATIONS 
      (SENDER_ID, RECEIVER_ID) VALUES (?);

      INSERT INTO MESSAGES 
      (SENDER_ID, CONVERSATION_ID, TEXT_MESSAGE) VALUES (?, LAST_INSERT_ID(), ?);
    `;
    const [data] = await db(sql, [
      [sender_id, receiver_id],
      sender_id,
      text_message,
    ]);

    res
      .status(200)
      .send({ message: "New conversation created", data: data[0].insertId });
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
};

const getMessage = async (req: Request, res: Response) => {
  try {
    const sql = `
      SELECT * FROM MESSAGES 
      WHERE CONVERSATION_ID = (?);
    `;
    const [data] = await db(sql, [req.params.conversation_id]);
    res.status(200).send({ chats: data });
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
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
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
};

export {
  getAllChats,
  newConversation,
  getMessage,
  newMessage,
  getAllChatMember,
};

import { Request, Response } from "express";
import db from "../database/query";

const getMessage = async (req: Request, res: Response) => {
  try {
    const user_id: any | any[] = req.query.user_id || [];
    let conversation_id = req.params.conversation_id;
    const { messages } = req.body || [];
    const ids = messages?.length ? messages : 0;

    if(user_id.length){
      const reverse = user_id.slice().reverse();
      const args = [...user_id, ...reverse];

      const sqlFindConversationId = `
        SELECT *
        FROM CONVERSATIONS
        WHERE 
          (USER_ONE = (?) AND USER_TWO = (?))
          OR 
          (USER_ONE = (?) AND USER_TWO = (?));
      `;

      const [getConversationIdData] = await db(sqlFindConversationId, args);
      if(!getConversationIdData) return res.status(200).send({ message: "No conversation found" });
      conversation_id = getConversationIdData.CONVERSATION_ID;
    }

    const sqlGetConversation = `
      SELECT *
      FROM MESSAGES
      WHERE 
          CONVERSATION_ID = (?)
          AND CONVERSATION_ID NOT IN (?)
      LIMIT 3;
    `;
    
    const data = await db(sqlGetConversation, [conversation_id, ids]);
    res.status(200).send({ chats: data });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const getUserConversations = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;
    const { conversations } = req.body;
    const ids = conversations.length ? conversations : 0;

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

    const data = await db(sql, [user_id, ids]);
    if (!data) return res.status(200).send({ list: data });
    return res.status(200).send({ list: data });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "An error occurred", error: error.message });
  }
};

const newMessageAndConversation = async (req: Request, res: Response) => {
  try {
    const { sender_id, receiver_id, text_message, conversation_id } = req.body;
    const sqlFindConversationId = "SELECT * FROM CONVERSATIONS WHERE CONVERSATION_ID = (?);"
    const [getConversationIdData] = await db(sqlFindConversationId, [conversation_id]);

    if(!getConversationIdData) {
      const sqlInsertNewConversation = `
        INSERT INTO CONVERSATIONS (USER_ONE, USER_TWO) VALUES (?, ?);
        SET @LAST_ID_IN_CONVERSATION = LAST_INSERT_ID();
        INSERT INTO MESSAGES (SENDER_ID, CONVERSATION_ID, TEXT_MESSAGE) VALUES (?, @LAST_ID_IN_CONVERSATION, ?);
      `;
      
      await db(sqlInsertNewConversation, [sender_id, receiver_id, sender_id, text_message]);
      return res.status(200).send({ message: "New conversation and message created" });
    } else {
      const sqlInsertNewMessage = "INSERT INTO MESSAGES  (SENDER_ID, CONVERSATION_ID, TEXT_MESSAGE) VALUES (?, ?, ?);";
      await db(sqlInsertNewMessage, [sender_id, conversation_id, text_message]);
      return res.status(200).send({ message: "New message created" });
    }
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

export { getMessage, newMessageAndConversation, getUserConversations };

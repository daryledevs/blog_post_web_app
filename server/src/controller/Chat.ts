import { Request, Response } from "express";
import database from "../database";

const getAllChats = async (req: Request, res: Response) => {
  const length: number = parseInt(req.params.length);
  const getData: any[] = [];
  const limit = length + 4;
  const sql = `
              SELECT 
                  m.sender_id,
                  m.text_message,
                  c.receiver_id,
                  u.username,
                  u.first_name,
                  u.last_name,
                  c.conversation_id,
                  m.time_sent
              FROM
                  messages m
                      LEFT JOIN
                  conversations c ON c.conversation_id = m.conversation_id
                      RIGHT JOIN
                  users u ON u.user_id = c.receiver_id
              WHERE
                u.user_id != m.sender_id
              ORDER BY m.time_sent ASC;
          `;

  database.query(sql, [req.params.sender_id], (error, data) => {
    if (error) res.status(500).send({ message: error.message });
    if (data.length === 0) res.status(200).send({ data: data });

    // we provide only 5 chat's per request to divide the data and prevent the long query
    for (let i = length; i < limit; i++) {
      if (length > limit || data.length <= length + i) break;
      else getData.push(data[i]);
    }

    return res.status(200).send({ data: getData });
  });
};

const newConversation = (req: Request, res: Response) => {
  const sql = `
                INSERT INTO conversations (\`sender_id\`, \`receiver_id\`) VALUES (?);
                INSERT INTO messages (\`sender_id\`, \`conversation_id\`, \`text_message\`, \`time_sent\`) VALUES 
                (?, (SELECT LAST_INSERT_ID()), ?, ?);
              `;
  const { sender_id, receiver_id, text_message } = req.body;
  const time_sent = new Date();
  database.query(
    sql,
    [
      [sender_id, receiver_id], 
      sender_id, text_message, time_sent
    ],
    (error, data) => {
      if (error) res.status(500).send({ message: error });
      return res
        .status(200)
        .send({ message: "New conversation created", data: data[0].insertId });
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
  const sql =
    "INSERT INTO messages (`sender_id`, `conversation_id`, `text_message`, `time_sent`) VALUES (?, ?, ?, ?)";
  const time_sent = new Date();
  const { sender_id, text_message, conversation_id } = req.body;

  database.query(
    sql,
    [sender_id, conversation_id, text_message, time_sent],
    (error, data) => {
      if (error) res.status(500).send({ message: error });
      return res.status(200).send({ message: "New message created" });
    }
  );
};

export { getAllChats, newConversation, getMessage, newMessage };


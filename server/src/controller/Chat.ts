import { Request, Response } from "express";
import database from "../database";

const getAllChats = async (req: Request, res: Response) => {
  const length: number = parseInt(req.params.length);
  let getData: any[] = [];
  let main_arr: any[] = [];
  const limit = length + 4;
  const sql = `
                SELECT * FROM conversations WHERE user_one = (?) OR user_two = (?);
                SELECT 
                  c.conversation_id,
                  m.message_id,
                  c.user_one,
                  m.sender_id,
                  m.text_message,
                  c.user_two,
                  u.username,
                  u.first_name,
                  u.last_name,
                  m.time_sent
                FROM
                  messages m
                LEFT JOIN
                  conversations c ON c.conversation_id = m.conversation_id
                INNER JOIN
                  users u ON u.user_id = 
                    CASE 
                      WHEN c.user_one = (?) THEN c.user_two
                          ELSE c.user_one
                    END 
                WHERE 
                  c.user_one = (?) OR c.user_two = (?)
                ORDER BY c.conversation_id ASC;
            `;

  database.query(sql, [
    // We check to see which of the two is the user's ID place in
    req.params.user_id, req.params.user_id,
    req.params.user_id, req.params.user_id, req.params.user_id
  ], (error, data) => {
    if (error) res.status(500).send({ message: error });
    if (data.length === 0) res.status(200).send({ data: data });

    for(let i = 0; i < data[0].length; i++){
      let sub_arr: any[] = [];
      for(let j = 0; j < data[1].length; j++){
        if(data[0][i].conversation_id === data[1][j].conversation_id) sub_arr.push(data[1][j]);
      }
      main_arr.push(sub_arr);
    }
    
    return res.status(200).send({ data: main_arr });
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


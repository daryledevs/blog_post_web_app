import database from "../database";
import { Request, Response } from "express";

const getUserData = (data:any) => {
  const [user] = data;
  const { password, ...rest } = user;
  return rest;
};

const userData = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  const sql = "SELECT * FROM users WHERE user_id = (?);";

  database.query(sql, [user_id], (error, data) =>{
    if(error) return res.status(500).send({ message: error });
    if(!data.length) return res.status(404).send({ message: "User not found" });
    const rest = getUserData(data);
    res.status(200).send({ user: rest });
  })
};

const getUserFeed = (req: Request, res: Response) => {
  const { post_ids, user_id } = req.body;
  const values = post_ids.length ? post_ids : 0;

  const sql = `
              SELECT 
                  f.followed_id, 
                  f.follower_id, 
                  p.*, 
                  (SELECT 
                    COUNT(*)
                  FROM
                    likes l
                  WHERE
                    p.post_id = l.post_id
                  ) AS "count"
              FROM
                  followers f
              INNER JOIN
                  posts p ON p.user_id = f.followed_id
              WHERE
                  f.follower_id = (?) AND 
                  p.post_date > DATE_SUB(CURDATE(), INTERVAL 3 DAY) AND
                  post_id NOT IN (?) 
              ORDER BY RAND() LIMIT 3;
          `;

  database.query(sql, [user_id, values], (error, data) => {
    if(error) return res.status(500).send({ error });
    res.status(200).send({ feed: data });
  });
};

const getTotalFeed =async (req: Request, res: Response) => {
  const { user_id } = req.body;
  const sql = `
              SELECT 
                  COUNT(*)
              FROM
                  posts
              WHERE
                  post_date > DATE_SUB(CURDATE(), INTERVAL 3 DAY)
              ORDER BY RAND() LIMIT 3;
              `;

  database.query(sql, [user_id], (error, data) => {
    if(error) return res.status(500).send({ error });
    res.status(200).send({ count: data[0]["COUNT(*)"] });
  })
};

const findUser = async (req: Request, res: Response) => {
  const { searchText } = req.body;
  const sql = `
              SELECT 
                user_id,
                username,
                first_name,
                last_name
              FROM
                  users
              WHERE
                  username LIKE (?) OR 
                  first_name LIKE (?) OR 
                  CONCAT(first_name, ' ', last_name) LIKE (?);
              `;

  database.query(sql, [
      searchText + "%", 
      searchText + "%", 
      "%" + searchText + "%"
    ], (error, data) => {
    if(error) return res.status(500).send({ error });
    if(!data.length) return res.status(401).send("No results found.");
    res.status(200).send({ list: data });
  });
};

const findUsername = async (req:Request, res:Response) => {
  const { username } = req.params;
  const sql = "SELECT * FROM users WHERE username = (?);";

  database.query(sql, [username], (error, data) => {
    if(error) return res.status(500).send({ error });
    if(!data.length) return res.status(404).send({ message: "The user doesn't exist" });
    const rest = getUserData(data);
    return res.status(200).send({ user: rest });
  });
};

export {
  userData,
  findUser,
  getUserFeed,
  getTotalFeed,
  findUsername,
};

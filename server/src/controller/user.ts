import database from "../database";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import moment from "moment";

const register = async (req: Request, res: Response) => {
  const { email, username, password, first_name, last_name } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? OR username = ?";

  database.query(sql, [email, username], (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.length) return res.status(409).send({ message: "User is already exists" });

    const sql = "INSERT INTO users(`username`, `email`, `password`, `first_name`, `last_name`) VALUES (?)";
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const values = [username, email, hashPassword, first_name, last_name];

    database.query(sql, [values], (error, data) => {
      if (error) return res.status(500).send(error);
      return res.status(200).send({ message: "Registration is successful" });
    });
  });
};

const userData = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  const sql = "SELECT * FROM users WHERE user_id = (?);";

  database.query(sql, [user_id], (error, data) =>{
    if(error) return res.status(500).send({ message: error });
    if(!data.length) return res.status(404).send({ message: "User not found" });

    const [user] = data;
    const { password, ...rest } = user;
    
    res.status(200).send({ user: rest });
  })
};

const getUserFeed = (req: Request, res: Response) => {
  const { post_id_arr, user_id } = req.body;
  const values = post_id_arr.length ? post_id_arr : 0;

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

const followUser = async (req: Request, res: Response) => {
  let { followed_id, follower_id } = req.params;
  const values = [parseInt(followed_id), parseInt(follower_id)];
  const sql_get = "SELECT * FROM followers WHERE followed_id = (?) AND follower_id = (?);";
  const sql_delete = "DELETE FROM followers WHERE followed_id = (?) AND follower_id = (?);";
  const sql_create = "INSERT INTO followers (\`followed_id\`, \`follower_id\`) VALUES(?, ?);";
  
  // Get all the data from the database to see if it is already there
  database.query(sql_get, [...values], (error, data) => {
      if (error) return res.status(500).send({ message: error });

      // If it already exists, delete the data from the database
      if (data.length) {
        database.query(sql_delete, [...values],(error, data) => {
            if (error) return res .status(500).send({ message: "Unfollowed failed", error });
            return res.status(200).send({ message: "Unfollowed user" });
          }
        );
        return;
      }

      // if there is no data on database then, create one
      database.query(sql_create, [...values], (error, data) => {
        if (error) return res .status(500).send({ message: "Unfollow failed", error });
        res.status(200).send({ message: "Followed user" });
      })
    }
  );
};

const getFollowers = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const sql = `
                SELECT 
                    f.*, u.user_id, u.username, u.first_name, u.last_name, u.avatar_url
                FROM
                    followers f
                INNER JOIN
                    users u ON f.follower_id = u.user_id
                WHERE
                    f.followed_id = (?);

              SELECT 
                  f.*, u.user_id, u.username, u.first_name, u.last_name,  u.avatar_url
              FROM
                  followers f
              INNER JOIN
                  users u ON f.followed_id = u.user_id
              WHERE
                  f.follower_id = (?);
              `;

  database.query(sql, [user_id, user_id], (error, data) => {
    if(error) return res.status(500).send({ error });
    
    res.status(200).send({
      followers: data[0],
      following: data[1],
    });
  });
};

export {
  register,
  userData,
  followUser,
  getFollowers,
  findUser,
  getUserFeed,
  getTotalFeed,
};

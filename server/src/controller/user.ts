import database from "../database";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

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
                    f.*, u.user_id, u.username, u.first_name, u.last_name
                FROM
                    followers f
                INNER JOIN
                    users u ON f.follower_id = u.user_id
                WHERE
                    f.followed_id = (?);

              SELECT 
                  f.*, u.user_id, u.username, u.first_name, u.last_name
              FROM
                  followers f
              INNER JOIN
                  users u ON f.followed_id = u.user_id
              WHERE
                  f.follower_id = (?);
              `;


  database.query(sql, [user_id, user_id], (error, data) => {
    console.log("TEST")
    if(error) return res.status(500).send({ error });
    
    res
      .status(200)
      .send({
        followers: data[0].length ? data[0] : 0,
        following: data[1].length ? data[1] : 0,
      });
  });
};

export { register, userData, followUser, getFollowers };

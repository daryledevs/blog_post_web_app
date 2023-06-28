import database from "../database/database";
import { Request, Response } from "express";

const totalFollow = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const sql = `
              SELECT 
                COUNT(f.followed_id) AS \`count\`
              FROM
                followers f
              INNER JOIN
                users u ON f.follower_id = u.user_id
              WHERE
                f.followed_id = (?) GROUP BY f.followed_id;

              SELECT 
                COUNT(f.followed_id) AS \`count\`
              FROM
                followers f
              INNER JOIN
                users u ON f.followed_id = u.user_id
              WHERE
                f.follower_id = (?) GROUP BY f.follower_id;
            `;
  database.query(sql, [user_id, user_id], (error, data) => {
    if(error) return res.status(500).send({ error });
    const [followers] = data[0];
    const [following] = data[1];
    res.status(200).send({ 
      followers: followers?.count ? followers.count : 0, 
      following: following?.count ? following.count : 0,
    });
  });
};


const getFollowers = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const { follower_ids, following_ids } = req.body;

  const isEmpty = (arr: any) => (arr.length ? arr : 0);
  const followers = isEmpty(follower_ids);
  const following = isEmpty(following_ids);

  const sql = `
              SELECT 
                  f.*, 
                  u.user_id, 
                  u.username, 
                  u.first_name, 
                  u.last_name, 
                  u.avatar_url
              FROM
                followers f
              INNER JOIN
                users u ON f.follower_id = u.user_id
              WHERE
                f.followed_id = (?) AND f.follower_id NOT IN (?)
              LIMIT 3;

              SELECT 
                  f.*, 
                  u.user_id, 
                  u.username, 
                  u.first_name, 
                  u.last_name,  
                  u.avatar_url
              FROM
                  followers f
              INNER JOIN
                  users u ON f.followed_id = u.user_id
              WHERE
                  f.follower_id = (?) AND f.followed_id NOT IN (?)
              LIMIT 3;
            `;

  database.query(sql, [
      user_id, followers, 
      user_id, following
    ], 
    (error, data) => {
    if (error) return res.status(500).send({ error });

    res.status(200).send({
      followers: data[0],
      following: data[1],
    });
  });
};

const followUser = async (req: Request, res: Response) => {
  let { followed_id, follower_id } = req.params;
  const values = [parseInt(followed_id), parseInt(follower_id)];
  const sql_get = "SELECT * FROM followers WHERE followed_id = (?) AND follower_id = (?);";
  const sql_delete = "DELETE FROM followers WHERE followed_id = (?) AND follower_id = (?);";
  const sql_create = "INSERT INTO followers (`followed_id`, `follower_id`) VALUES(?, ?);";

  // Get all the data from the database to see if it is already there
  database.query(sql_get, [...values], (error, data) => {
    if (error) return res.status(500).send({ message: error });

    // If it already exists, delete the data from the database
    if (data.length) {
      return database.query(sql_delete, [...values], (error, data) => {
        if (error) return res.status(500).send({ message: "Unfollowed failed", error });
        res.status(200).send({ message: "Unfollowed user" });
      });
    }

    // if there is no data on database then, create one
    database.query(sql_create, [...values], (error, data) => {
      if (error) return res.status(500).send({ message: "Unfollow failed", error });
      res.status(200).send({ message: "Followed user" });
    });
  });
};

export { totalFollow, followUser, getFollowers };

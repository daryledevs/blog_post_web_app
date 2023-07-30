import db from "../database/query";
import { Request, Response } from "express";

const totalFollow = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const sql = 
    `
      SELECT 
        COUNT(F.FOLLOWED_ID) AS \`COUNT\`
      FROM
        FOLLOWERS F
      INNER JOIN
        USERS U ON F.FOLLOWER_ID = U.USER_ID
      WHERE
        F.FOLLOWED_ID = (?)
      GROUP BY F.FOLLOWED_ID;

      SELECT 
        COUNT(F.FOLLOWED_ID) AS \`COUNT\`
      FROM
        FOLLOWERS F
      INNER JOIN
        USERS U ON F.FOLLOWED_ID = U.USER_ID
      WHERE
        F.FOLLOWER_ID = (?)
      GROUP BY F.FOLLOWER_ID;
    `;

    const [data] = await db(sql, [user_id, user_id]);
    const followers = data[0];
    const following = data[1];

    res.status(200).send({
      followers: followers?.COUNT ? followers.COUNT : 0,
      following: following?.COUNT ? following.COUNT : 0,
    });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  }
};

const getFollowers = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const { follower_ids, following_ids } = req.body;

    const isItEmpty = (arr: any) => (arr.length ? arr : 0);
    const followers = isItEmpty(follower_ids);
    const following = isItEmpty(following_ids);

    const sql = 
    `
      SELECT 
        F.*, 
        U.USER_ID, 
        U.USERNAME, 
        U.FIRST_NAME, 
        U.LAST_NAME, 
        U.AVATAR_URL
      FROM
        FOLLOWERS F
      INNER JOIN
        USERS U ON F.FOLLOWER_ID = U.USER_ID
      WHERE
        F.FOLLOWED_ID = (?) AND F.FOLLOWER_ID NOT IN (?)
      LIMIT 3;

      SELECT 
        F.*, 
        U.USER_ID, 
        U.USERNAME, 
        U.FIRST_NAME, 
        U.LAST_NAME,  
        U.AVATAR_URL
      FROM
        FOLLOWERS F
      INNER JOIN
        USERS U ON F.FOLLOWED_ID = U.USER_ID
      WHERE
        F.FOLLOWER_ID = (?) AND F.FOLLOWED_ID NOT IN (?)
      LIMIT 3;
    `;
    const [followersData, followingData] = await db(sql, [
      user_id, followers, user_id, following,
    ]);
    res.status(200).send({ followers: followersData, following: followingData });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  }
};

const followUser = async (req: Request, res: Response) => {
  try {
    let { followed_id, follower_id } = req.params;
    const values = [parseInt(followed_id), parseInt(follower_id)];

    const sqlCreate = `
      INSERT INTO FOLLOWERS 
      (FOLLOWED_ID, FOLLOWER_ID) VALUES (?, ?);
    `;

      const sqlGet = `
      SELECT * 
      FROM FOLLOWERS 
      WHERE FOLLOWED_ID = (?) AND FOLLOWER_ID = (?);
    `;
      const sqlDelete = `
      DELETE FROM FOLLOWERS 
      WHERE FOLLOWED_ID = (?) AND FOLLOWER_ID = (?);
    `;

    // Get all the data from the database to see if it is already there
    const [data] = await db(sqlGet, [...values]);

    // If it already exists, delete the data from the database
    if (data) {
      await db(sqlDelete, [...values]);
      res.status(200).send({ message: "Unfollowed user" });
    } else {
      // if there is no data in the database, create one
      await db(sqlCreate, [...values]);
      res.status(200).send({ message: "Followed user" });
    }
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  }
};

export { totalFollow, getFollowers, followUser };

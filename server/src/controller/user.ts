import db from "../database/query";
import { Request, Response } from "express";

const getUserData = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    const { person } = req.query;

    const sqlSelectWithId = "SELECT * FROM USERS WHERE USER_ID = (?);";
    const sqlSelectPerson = 
    `
      SELECT 
          *
      FROM
          USERS
      WHERE
          USERNAME LIKE (?) OR 
          FIRST_NAME LIKE (?) OR 
          CONCAT(FIRST_NAME, ' ', LAST_NAME) LIKE (?);
    `;

    const sql = person ? sqlSelectPerson : sqlSelectWithId;
    const personArray = Array.from({ length: 3 }, () => person)
    const params = person ? personArray : [user_id];
    
    const [data] = await db(sql, params);
    if(!data) return res.status(404).send({ message: "User not found" });
    const { PASSWORD, ...rest } = data;
    res.status(200).send({ user: rest });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const searchUsersByQuery = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const sql = `
      SELECT 
          USER_ID,
          USERNAME,
          FIRST_NAME,
          LAST_NAME
      FROM
          USERS
      WHERE
          USERNAME LIKE (?) OR 
          FIRST_NAME LIKE (?) OR 
          CONCAT(FIRST_NAME, ' ', LAST_NAME) LIKE (?);
    `;

    const params = Array.from({ length: 3 }, () => search + "%");
    const data = await db(sql, params);
    if (!data.length) return res.status(404).send({ message: "User not found" });
    res.status(200).send({ users: data });
  } catch (error: any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  }
};

const getRecentSearchUser = async (req: Request, res: Response) => {
  try {
    const { method } = req.query;
    const { user_id } = req.params;

    const sqlInsert = "INSERT INTO RECENT_SEARCHES (USER_ID) VALUES (?);";
    const sqlSelect = "SELECT * FROM RECENT_SEARCHES WHERE USER_ID = (?) LIMIT 5;";

    if(method === "POST") {
      await db(sqlInsert, [user_id]);
      return res.status(200).send({ message: "User saved" });
    }

    if(method === "GET") {
      const data = await db(sqlSelect, [user_id]);
      return res.status(200).send({ users: data });
    }

    res.status(404).send({ message: "Method not found" });
  } catch (error: any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  }
};

const getFollowStats = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const sql = `
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

    const data = await db(sql, [user_id, user_id]);
    const { COUNT: followers } = data[0][0] || { COUNT: 0 };
    const { COUNT: following } = data[1][0] || { COUNT: 0 };

    res.status(200).send({ followers, following });
  } catch (error: any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  }
};

const getFollowerFollowingLists = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const { listsId } = req.body;
    const { fetch } = req.query;
    const lists = listsId.length ? listsId : 0;

    const sqlSelectFollowedId = `
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

    const sqlSelectFollowerId = `
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
    `;
    
    const sql = fetch === "followers" ? sqlSelectFollowerId : sqlSelectFollowedId;
    const data = await db(sql, [user_id, lists]);
    res.status(200).send({ lists: data });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  }
}

const toggleFollow = async (req: Request, res: Response) => {
  try {
    let { user_id, followed_id } = req.params;
    const values = [parseInt(user_id), parseInt(followed_id)];

    const sqlCreate = `
      INSERT INTO FOLLOWERS 
      (FOLLOWER_ID, FOLLOWED_ID) VALUES (?, ?);
    `;

      const sqlGet = `
      SELECT * 
      FROM FOLLOWERS 
      WHERE FOLLOWER_ID = (?) AND FOLLOWED_ID = (?);
    `;
      const sqlDelete = `
      DELETE FROM FOLLOWERS 
      WHERE FOLLOWER_ID = (?) AND FOLLOWED_ID = (?);
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

export {
  getUserData,
  searchUsersByQuery,
  getFollowStats,
  getFollowerFollowingLists,
  toggleFollow,
  getRecentSearchUser
};

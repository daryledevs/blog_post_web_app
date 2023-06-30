import db from "../database/query";
import { Request, Response } from "express";
import isEmpty from "../util/isObjEmpty";

const getUserData = (data: any) => {
  const { password, ...rest } = data;
  return rest;
};

const userData = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    const sql = "SELECT * FROM USERS WHERE USER_ID = (?);";
    const [data] = await db(sql, [user_id]);
    if(isEmpty(data)) return res.status(404).send({ message: "User not found" });
    const rest = getUserData(data);
    res.status(200).send({ user: rest });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const getUserFeed = async (req: Request, res: Response) => {
  try {
    const { post_ids, user_id } = req.body;
    const values = post_ids.length ? post_ids : 0;
    const sql = 
    `
      SELECT 
          F.FOLLOWED_ID, 
          F.FOLLOWER_ID, 
          P.*, 
          (SELECT 
            COUNT(*)
          FROM
            LIKES L
          WHERE
            P.POST_ID = L.POST_ID
          ) AS "COUNT"
      FROM
          FOLLOWERS F
      INNER JOIN
          POSTS P ON P.USER_ID = F.FOLLOWED_ID
      WHERE
          F.FOLLOWER_ID = (?) AND 
          P.POST_DATE > DATE_SUB(CURDATE(), INTERVAL 3 DAY) AND
          POST_ID NOT IN (?) 
      ORDER BY RAND() LIMIT 3;
   `;
    const data = await db(sql, [user_id, values]);
    res.status(200).send({ feed: data });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const getTotalFeed = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    const sql = `
      SELECT 
          COUNT(*)
      FROM
          POSTS
      WHERE
          POST_DATE > DATE_SUB(CURDATE(), INTERVAL 3 DAY)
      ORDER BY RAND() LIMIT 3;
    `;
    const [data] = await db(sql, [user_id]);
    res.status(200).send({ count: data["COUNT(*)"] });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const findUser = async (req: Request, res: Response) => {
  try {
    const { searchText } = req.body;
    const sql = 
    `
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
    const data = await db(sql, [
      searchText + "%",
      searchText + "%",
      "%" + searchText + "%",
    ]);
    if(isEmpty(data)) return res.status(401).send("No results found.");
    res.status(200).send({ list: data });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const findUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const sql = "SELECT * FROM USERS WHERE USERNAME = (?);";
    const [data] = await db(sql, [username]);
    if(isEmpty(data)) return res.status(404).send({ message: "The user doesn't exist" });
    const rest = getUserData(data);
    res.status(200).send({ user: rest });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

export { userData, findUser, getUserFeed, getTotalFeed, findUsername };

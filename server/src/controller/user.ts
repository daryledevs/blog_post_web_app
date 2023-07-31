import db from "../database/query";
import { Request, Response } from "express";

const getUserData = (data: any) => {
  const { password, ...rest } = data;
  return rest;
};

const userData = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    const sql = "SELECT * FROM USERS WHERE USER_ID = (?);";
    const [data] = await db(sql, [user_id]);
    if(!data) return res.status(404).send({ message: "User not found" });
    const rest = getUserData(data);
    res.status(200).send({ user: rest });
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
    if(!data) return res.status(404).send("No results found.");
    res.status(200).send({ list: data });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const findUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const sql = `
    SELECT
        U.USER_ID,
        U.USERNAME,
        U.AVATAR_URL,
        U.FIRST_NAME,
        U.LAST_NAME
      FROM
          USERS U
      WHERE
          USERNAME = (?);
    `;
    const data = await db(sql, [username]);
    res.status(200).send({ people: data });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

export { userData, findUser, findUsername };

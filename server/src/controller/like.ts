import { Response, Request } from "express";
import db from "../database/query";

const postAllLikes = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const sql = 
    `
      SELECT 
        COUNT(*) AS COUNT
      FROM
        LIKES
      WHERE
        POST_ID = ?
    `;

    const [data] = await db(sql, [post_id]);
    res.status(200).send({ count: data.COUNT });
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
};

const likeStatus = async (req: Request, res: Response) => {
  try {
    const { post_id, user_id } = req.params;
    const sql = `
      SELECT * 
      FROM LIKES 
      WHERE POST_ID = ? AND USER_ID = ?
    `;

    const [data] = await db(sql, [post_id, user_id]);
    if (!data.length) return res.status(200).send({ status: false });
    res.status(200).send({ status: true });
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
};

const likePost = async (req: Request, res: Response) => {
  try {
    const { post_id, user_id } = req.params;
    const sql_get = `
      SELECT * 
      FROM LIKES 
      WHERE POST_ID = ? AND USER_ID = ?;
    `;
    const sql_delete = `
      DELETE FROM LIKES 
      WHERE POST_ID = ? AND USER_ID = ?;
    `;
    const sql_create = `
      INSERT INTO LIKES (POST_ID, USER_ID) 
      VALUES (?, ?);
    `;

    // check to see if the user already likes the post
    const [data] = await db(sql_get, [post_id, user_id]);

    if (data.length) {
      // if the user has already liked the post, then delete or remove
      await db(sql_delete, [post_id, user_id]);
      return res.status(200).send("Removed like from a post");
    } else {
      // if the user hasn't liked the post yet, then create or insert
      await db(sql_create, [post_id, user_id]);
      return res.status(200).send("Liked post");
    }
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
};

export { likePost, postAllLikes, likeStatus };

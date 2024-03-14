import { Response, Request, NextFunction } from "express";
import * as dotenv from "dotenv";
import db from "../database/query";
import uploadAndDeleteLocal from "../config/cloudinary";
dotenv.config();

const getUserPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.query;
    const sql = 
    `
      SELECT 
        P.*,
        (
          SELECT 
            COUNT(*)
          FROM
            LIKES L
          WHERE
            P.POST_ID = L.POST_ID
        ) AS "LIKES"
      FROM
          POSTS P
      WHERE
          P.USER_ID = (?);
    `;
    const data = await db(sql, [user_id]);
    res.status(200).send({ post: data });
  } catch (error) {
    next(error)
  }
};

const getUserTotalPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.query;
    const sql = `
      SELECT 
        COUNT(*)
      FROM
          POSTS P
      WHERE
          P.USER_ID = (?);
    `;
    const [data] = await db(sql, [user_id]);
    res.status(200).send({ totalPost: data["COUNT(*)"] });
  } catch (error: any) {
    next(error)
  }
};

const newPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, caption } = req.body;
    const { img } = req.files as { [fieldname: string]: Express.Multer.File[] };
    const path = img[0].destination + "\\" + img[0].filename;
    const { image_id, image_url } = await uploadAndDeleteLocal(path);
    const values = [user_id, caption, image_id, image_url];
    const sql = 
    `
      INSERT INTO POSTS 
      (USER_ID, CAPTION, IMAGE_ID, IMAGE_URL) VALUES (?);
    `;
    await db(sql, [values]);
    res.status(200).send({ message: "Post has been posted" });
  } catch (error) {
    next(error)
  }
};

const editPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id } = req.params;
    const body = req.body;
    if(body?.user_id) return res.status(406).send({ message: "The following data cannot be changed" });
    // Get all the keys and values that are going to be changed.
    let query = ``;
    Object.keys(body).forEach(function (key, index) {
      query = `${key} = "${body[`${key}`]}"`;
    });
    
    const sql = `UPDATE POSTS SET ${query} WHERE POST_ID = (?);`;
    await db(sql, [parseInt(post_id)]);
    res.status(200).send({ message: "Edit post successfully" });
  } catch (error) {
    next(error)
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id } = req.params;
    const sql = "DELETE FROM POSTS WHERE POST_ID = (?);";
    await db(sql, [parseInt(post_id)]);
    res.status(200).send("Delete post successfully");
  } catch (error) {
    next(error)
  }
};


const getLikesCountForPost = async (req: Request, res: Response, next: NextFunction) => {
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
    next(error)
  }
};

const checkUserLikeStatusForPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id, user_id } = req.params;
    const sql = `
      SELECT * 
      FROM LIKES 
      WHERE POST_ID = ? AND USER_ID = ?
    `;

    const [data] = await db(sql, [post_id, user_id]);
    res.status(200).send({ status: data ? true : false });
  } catch (error) {
    next(error)
  }
};

const toggleUserLikeForPost = async (req: Request, res: Response, next: NextFunction) => {
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

    // Check to see if the user already likes the post.
    const [data] = await db(sql_get, [post_id, user_id]);

    if (data) {
      // If the user has already liked the post, then delete or remove.
      await db(sql_delete, [post_id, user_id]);
      return res.status(200).send("Removed like from a post");
    } else {
      // If the user hasn't liked the post yet, then create or insert.
      await db(sql_create, [post_id, user_id]);
      return res.status(200).send("Liked post");
    }
  } catch (error) {
    next(error)
  }
};

export {
  newPost,
  getUserPost,
  getUserTotalPosts,
  editPost,
  deletePost,
  getLikesCountForPost,
  checkUserLikeStatusForPost,
  toggleUserLikeForPost,
};

// Another way of getting data from a database

// const getTotalLikes = async (post_ids: any, payload: any, sql: any) => {
//   const selectLikes = async (values: any) => {
//     return new Promise((resolve, reject) => {
//       database.query(sql, values, (error, data) => {
//         if (error) reject(error);
//         const [value] = values;
//         payload.push({ post_id: value, count: data[0]["COUNT(*)"] });
//         resolve(payload);
//       });
//     });
//   };

//   for (let i = 0; i < post_ids.length; i++) await selectLikes([post_ids[i]]);
// };

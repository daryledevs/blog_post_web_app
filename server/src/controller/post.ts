import { Response, Request } from "express";
import database from "../database";
import moment from "moment";
import cloudinary from "cloudinary";
import * as dotenv from "dotenv";
import * as fs from "fs";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.STORAGE_NAME,
  api_key: process.env.STORAGE_API_KEY,
  api_secret: process.env.STORAGE_API_SECRET,
  secure: true,
});


async function uploadAndDeleteLocal(path:any) {
  const result = await cloudinary.v2.uploader.upload(path, { unique_filename: true });
  fs.unlink(path, (err) => {
    if (err) throw err;
    console.log("Delete File successfully.");
  });
  return { image_id: result.public_id, image_url: result.url };
};

const getUserPost = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const sql_posts = "SELECT * FROM posts WHERE user_id = (?);";
  const sql_likes = "SELECT COUNT(*) FROM likes WHERE post_id = (?);";
  const payload :any= []

  const selectPosts = async (payload:any, sql:any, values: any) => {
    return new Promise((resolve, reject) => {
      database.query(sql, values, (error, data) => {
        if(error) reject(error);
        payload.push(data);
        resolve(payload);
      });
    })
  };

  const selectLikes = async (payload: any, sql:any, values: any) => {
    return new Promise((resolve, reject) => {
      database.query(sql, values, (error, data) => {
        if (error) reject(error);
        const [value] = values;
        payload.push({ post_id: value, count: data[0]["COUNT(*)"] });
        resolve(payload);
      });
    });
  };

  await selectPosts(payload, sql_posts, [user_id]);
  const post_ids = payload[0].map(({ post_id }: any) => post_id);
  for(let i = 0; i < post_ids.length; i++) await selectLikes(payload, sql_likes, [post_ids[i]]);
  res.status(200).send(payload)
};

const newPost = async(req: Request, res: Response) => {
  const { user_id, caption } = req.body;
  const { img } = req.files as { [fieldname: string]: Express.Multer.File[] };
  const path = img[0].destination + "\\" + img[0].filename;
  
  const { image_id, image_url } = await uploadAndDeleteLocal(path);
  const post_date = moment(new Date(), "YYYY-MM-DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss");
  const values = [user_id, caption, image_id, image_url, post_date];
  
  
  const sql = "INSERT INTO posts (`user_id`, `caption`, `image_id`, `image_url`, `post_date`) VALUES (?);";
  database.query(sql, [values], (error, data) => {
    if(error) return res.status(500).send({ message: "Post failed", error });

    res.status(200).send({ message: "Post has been posted" });
  });
};

const editPost = async (req: Request, res: Response) => {
  const { post_id } = req.params;
  const body = req.body;
  let query = ``

  if(body.post_id || body.user_id) return res.status(406).send({ message: "The following data cannot be change" });

  Object.keys(body).forEach(function(key, index){
    query = `${key} = "${body[`${key}`]}"`;  
  });

  const sql = `UPDATE posts SET ${query} WHERE post_id = (?);`;
  
  database.query(sql, [parseInt(post_id)], (error, data) => {
    if (error) return res.status(500).send({ error });
    res.status(200).send({ message: "Edit post successfully" });
  });
}

const deletePost =async (req: Request, res: Response) => {
  const { post_id } = req.params;
  const sql = "DELETE FROM posts WHERE post_id = (?);";
  
  database.query(sql, [parseInt(post_id)], (error, data) => {
    if(error) return res.status(500).send({ error });
    res.status(200).send("Delete post successfully");
  });
}

export { newPost, getUserPost, editPost, deletePost };
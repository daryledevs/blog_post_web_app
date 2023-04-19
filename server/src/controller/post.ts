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
  const sql = "SELECT * FROM posts WHERE user_id = (?);";

  database.query(sql, [user_id], (error, data) => {
    if (error) return res.status(500).send({ error });
    if (!data.length) return res.status(204).send({ message: "No posts yet" });

    res.status(200).send({ post: data });
  });
};

const newPost = async(req: Request, res: Response) => {
  const sql = "INSERT INTO posts (`user_id`, `caption`, `image_id`, `image_url`, `post_date`) VALUES (?);";
  const { img } = req.files as { [fieldname: string]: Express.Multer.File[] };
  const { user_id, caption } = req.body;

  const path = img[0].destination + "\\" + img[0].filename;
  const { image_id, image_url } = await uploadAndDeleteLocal(path);
  const post_date = moment(new Date(), "YYYY-MM-DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss");

  const values = [user_id, caption, image_id, image_url, post_date];

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

const likePost = async (req: Request, res: Response) => {
  const { post_id, user_id } = req.params;
  const sql_get = "SELECT * FROM likes WHERE post_id = (?) AND user_id = (?);";
  const sql_delete = "DELETE FROM likes WHERE post_id = (?) AND user_id = (?);";
  const sql_create = "INSERT INTO likes (`post_id`, `user_id`) VALUES (?, ?);";

  // check to see if the user is already like the post
  database.query(sql_get, [post_id, user_id], (error, data) => {
    if(error) return res.status(500).send({ error });
    
    // if the user has already liked the post, then delete or remove
    if(data.length){
      database.query(sql_delete, [post_id, user_id], (error, data) => {
        if(error) return res.status(500).send({ message: "Delete row from likes table failed", error });
        return res.status(200).send("Remove like from a post");
      });

      return;
    }

    // if the user hasn't like the post yet, then create or insert 
    database.query(sql_create, [post_id, user_id], (error, data) => {
      if(error) return res.status(500).send({ message: "Like post failed", error });
      res.status(200).send("Liked post");
    })
  });
}

export { newPost, getUserPost, likePost, editPost };
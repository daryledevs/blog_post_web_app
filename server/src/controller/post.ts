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

const newPost = async(req: Request, res: Response) => {
  const sql = "INSERT INTO posts (`user_id`, `caption`, `image_id`, `image_url`, `post_date`) VALUES (?)";
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

export {
  newPost
}
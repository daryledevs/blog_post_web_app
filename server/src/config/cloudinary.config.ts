import cloudinary  from "cloudinary";
import * as fs     from "fs";
import * as dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.STORAGE_NAME,
  api_key: process.env.STORAGE_API_KEY,
  api_secret: process.env.STORAGE_API_SECRET,
  secure: true,
});

async function uploadAndDeleteLocal(path: any) {
  const result = await cloudinary.v2.uploader.upload(path, {
    UNIQUE_FILENAME: true,
    folder: process.env.STORAGE_FOLDER,
  });
  fs.unlink(path, (err) => {
    if (err) throw err;
    console.log("Delete File successfully.");
  });
  return { image_id: result.public_id, image_url: result.url };
}

export default uploadAndDeleteLocal;
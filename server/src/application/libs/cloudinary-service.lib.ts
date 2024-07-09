import cloudConfig from "@/config/cloudinary.config";
import cloudinary from "cloudinary";
import * as fs from "fs";

cloudinary.v2.config(cloudConfig);

class CloudinaryService {
  public uploadAndDeleteLocal = async (path: any) => {
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
}

export default CloudinaryService;

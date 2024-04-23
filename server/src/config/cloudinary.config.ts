import * as dotenv from "dotenv";
dotenv.config();

const cloudConfig = {
  cloud_name: process.env.STORAGE_NAME,
  api_key: process.env.STORAGE_API_KEY,
  api_secret: process.env.STORAGE_API_SECRET,
  secure: true,
};

export default cloudConfig;
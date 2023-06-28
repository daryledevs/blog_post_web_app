import { AES, enc } from "crypto-js";
import * as dotenv from "dotenv";
dotenv.config();

function encryptData(data: string): string {
  const secretKey = process.env.ENCRYPT_SECRET!;
  const encryptedData = AES.encrypt(data, secretKey).toString();
  return encryptedData;
};

export default encryptData;

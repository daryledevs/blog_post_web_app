import { AES, enc } from "crypto-js";
import * as dotenv from "dotenv";
dotenv.config();

function decryptData(encodedData: string): string {
  const secretKey = process.env.ENCRYPT_SECRET!;
  const decryptedData = AES.decrypt(encodedData, secretKey).toString(enc.Utf8);
  return decryptedData;
};

export default decryptData;

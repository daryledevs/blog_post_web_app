import { AES, enc } from "crypto-js";
import * as dotenv from "dotenv";
dotenv.config();

class CryptoService {
  static decryptData(encodedData: string): string {
    const secretKey = process.env.ENCRYPT_SECRET!;
    const decryptedData = AES.decrypt(encodedData, secretKey).toString(
      enc.Utf8
    );
    return decryptedData;
  };

  static encryptData(data: string): string {
    const secretKey = process.env.ENCRYPT_SECRET!;
    const encryptedData = AES.encrypt(data, secretKey).toString();
    return encryptedData;
  };
};

export default CryptoService;
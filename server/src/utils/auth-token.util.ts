import jwt         from "jsonwebtoken";
import { nanoid }  from "nanoid";
import * as dotenv from "dotenv";
dotenv.config();

const REFRESH_TOKEN_EXPIRATION = "7d";
const ACCESS_TOKEN_EXPIRATION = "15m";
const RESET_TOKEN_EXPIRATION = "1hr";

export interface IERefreshToken {
  user_id: string;
  username: string;
}

export interface IEAccessToken {
  user_id: string;
  roles: string;
}

export interface IEResetToken {
  EMAIL: string;
  user_id: string;
}

class AuthTokensUtil {
  static verifyToken = (token: any, secret: any, tokenName: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const errorField = `${tokenName}Error`;
      const decodeField = `${tokenName}Decode`;
      try {
        const decodedToken = jwt.verify(token, secret);
        resolve({ [errorField]: null, [decodeField]: decodedToken });
      } catch (error:any) {
        const decodedToken = jwt.decode(token);
        return resolve({ [errorField]: error?.name, [decodeField]: decodedToken });
      };
    });
  };

  static generateRefreshToken = ({ user_id, username }: IERefreshToken): string => {
    const REFRESH_SECRET = process.env.REFRESH_TKN_SECRET!;
    const details = { user_id: user_id, username: username };
    const expiration = { expiresIn: REFRESH_TOKEN_EXPIRATION };
    return jwt.sign(details, REFRESH_SECRET, expiration);
  };

  static generateAccessToken = ({ user_id, roles }: IEAccessToken): string => {
    const ACCESS_SECRET = process.env.ACCESS_TKN_SECRET!;
    const details = { user_id: user_id, roles: roles };
    const expiration = { expiresIn: ACCESS_TOKEN_EXPIRATION };
    return jwt.sign(details, ACCESS_SECRET, expiration);
  };

  static generateResetToken = ({ EMAIL, user_id }: IEResetToken): string =>{
    const RESET_SECRET = process.env.RESET_PWD_TKN_SECRET!;
    const details = { email: EMAIL, user_id: user_id };
    const expiration = { expiresIn: RESET_TOKEN_EXPIRATION };
    return jwt.sign(details, RESET_SECRET, expiration);
  };

  static referenceToken = async () => {
    const shortToken = nanoid(10);
    return shortToken;
  };
}

export default AuthTokensUtil;
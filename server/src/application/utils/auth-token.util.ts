import jwt         from "jsonwebtoken";
import { nanoid }  from "nanoid";
import * as dotenv from "dotenv";
import ApiErrorException from "@/application/exceptions/api.exception";
import { IResetPasswordForm } from "@/application/services/auth/auth.service";
dotenv.config();

export enum Expiration {
  REFRESH_TOKEN_EXPIRATION = "7d",
  ACCESS_TOKEN_EXPIRATION = "15m",
  RESET_TOKEN_EXPIRATION = "1hr",
};

export enum TokenSecret {
  REFRESH_SECRET = process.env.REFRESH_TKN_SECRET as any,
  ACCESS_SECRET = process.env.ACCESS_TKN_SECRET as any,
  RESET_SECRET = process.env.RESET_PWD_TKN_SECRET as any,
};

export interface IGenerateToken {
  payload: any;
  secret: TokenSecret;
  expiration: Expiration;
};

class AuthTokensUtil {
  static referenceToken = async () => nanoid(10);
  
  static generateToken = (data: IGenerateToken): string => {
    const { payload, secret, expiration } = data;
    return jwt.sign(payload, secret as any, { expiresIn: expiration });
  };

  static verifyAuthToken = (
    token: any,
    secret: any,
    tokenName: string
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const errorField = `${tokenName}Error`;
      const decodeField = `${tokenName}Decode`;
      try {
        const decodedToken = jwt.verify(token, secret);
        resolve({ [errorField]: null, [decodeField]: decodedToken });
      } catch (error: any) {
        const decodedToken = jwt.decode(token);
        return resolve({
          [errorField]: error?.name,
          [decodeField]: decodedToken,
        });
      }
    });
  };

  static verifyResetPasswordToken = (
    decryptedToken: any,
    tokenId: any
  ): Promise<IResetPasswordForm> => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        decryptedToken,
        process.env.RESET_PWD_TKN_SECRET!,
        (error: any, decode: any) => {
          // Explicitly type 'decode' as 'any'
          if (error) {
            reject(ApiErrorException.HTTP400Error("Invalid or expired token"));
          }
            
          const { email, user_uuid } = decode as { email: any; user_uuid: any };
          resolve({
            render: "resetPassword",
            data: { email, user_uuid, tokenId },
          });
        }
      );
    });
  };
}

export default AuthTokensUtil;
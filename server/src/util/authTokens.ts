import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { nanoid } from "nanoid";
dotenv.config();

const REFRESH_TOKEN_EXPIRATION = "7d";
const ACCESS_TOKEN_EXPIRATION = "15m";
const RESET_TOKEN_EXPIRATION = "1hr";

function verifyToken(token: any, secret: any): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error: any, decode: any) => {
      resolve({ error, decode });
    });
  });
};

function errorName(name: any) {
  if (name === "JsonWebTokenError") return true;
  if (name === "UnauthorizedError") return true;
  return false;
};

function generateRefreshToken({ USER_ID, USERNAME }: { USER_ID: string; USERNAME: string }): string {
  const REFRESH_SECRET = process.env.REFRESH_TKN_SECRET!;
  const details = { user_id: USER_ID, username: USERNAME };
  const expiration = { expiresIn: REFRESH_TOKEN_EXPIRATION };
  const token = jwt.sign(details, REFRESH_SECRET, expiration);
  return token;
};

function generateAccessToken({ USER_ID, ROLES }: { USER_ID: string; ROLES: string }): string {
  const ACCESS_SECRET = process.env.ACCESS_TKN_SECRET!;
  const details = { user_id: USER_ID, roles: ROLES };
  const expiration = { expiresIn: ACCESS_TOKEN_EXPIRATION };
  const token = jwt.sign(details, ACCESS_SECRET, expiration);
  return token;
};

function generateResetToken({ EMAIL, USER_ID }: { EMAIL: string; USER_ID: string }): string {
  const RESET_SECRET = process.env.RESET_PWD_TKN_SECRET!;
  const details = { email: EMAIL, user_id: USER_ID };
  const expiration = { expiresIn: RESET_TOKEN_EXPIRATION };
  const token = jwt.sign(details, RESET_SECRET, expiration);
  return token;
};

async function referenceToken() {
  const shortToken = nanoid(10);
  return shortToken;
};

export {
  verifyToken,
  errorName,
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  referenceToken,
};
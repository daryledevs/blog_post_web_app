import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { nanoid } from "nanoid";
dotenv.config();

const REFRESH_TOKEN_EXPIRATION = "7d";
const ACCESS_TOKEN_EXPIRATION = "15m";
const RESET_TOKEN_EXPIRATION = "1hr";

function generateRefreshToken({ user_id, username }: { user_id: string; username: string }): string {
  const REFRESH_SECRET = process.env.REFRESH_TKN_SECRET!;
  const details = { user_id, username };
  const expiration = { expiresIn: REFRESH_TOKEN_EXPIRATION };
  const token = jwt.sign(details, REFRESH_SECRET, expiration);
  return token;
};

function generateAccessToken({ user_id, roles }: { user_id: string; roles: string }): string {
  const ACCESS_SECRET = process.env.ACCESS_TKN_SECRET!;
  const details = { user_id, roles };
  const expiration = { expiresIn: ACCESS_TOKEN_EXPIRATION };
  const token = jwt.sign(details, ACCESS_SECRET, expiration);
  return token;
};

function generateResetToken({ email, user_id }: { email: string; user_id: string }): string {
  const RESET_SECRET = process.env.RESET_PWD_TKN_SECRET!;
  const details = { email, user_id };
  const expiration = { expiresIn: RESET_TOKEN_EXPIRATION };
  const token = jwt.sign(details, RESET_SECRET, expiration);
  return token;
};

async function referenceToken() {
  const shortToken = nanoid(10);
  return shortToken;
};

export {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  referenceToken,
};
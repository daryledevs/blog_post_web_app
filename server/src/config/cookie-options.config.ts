import * as dotenv from "dotenv";
dotenv.config();

const nodeEnvironment = (process.env.NODE_ENV || "development").trim() as
  | "development"
  | "production";

const { secure, sameSite } =
  nodeEnvironment === "development"
    ? { secure: false, sameSite: "lax" as const }
    : { secure: true, sameSite: "none" as const };

const domain = nodeEnvironment === "development" ? "localhost" : undefined;

const cookieOptions = {
  httpOnly: true,
  secure,
  sameSite,
  domain,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
};

export default cookieOptions;

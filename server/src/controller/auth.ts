import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  referenceToken,
} from "../util/authTokens";
import { Request, Response, query } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import cookieOptions from "../config/cookieOptions";
import sendEmail from "../config/nodemailer";
import encryptData from "../util/encrypt";
import decryptData from "../util/decrypt";
import db from "../database/query";
dotenv.config();

const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password, first_name, last_name } = req.body;
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const sqlSelect = "SELECT * FROM users WHERE email = ? OR username = ?";
    const sqlInsert = "INSERT INTO users(`username`, `email`, `password`, `first_name`, `last_name`) VALUES (?)";

    // Check to see if the user is already in the database.
    const [user] = await db(sqlSelect, [email, username]);
    if(user) return res.status(409).send({ message: "User is already exists" });

    // Save the user to the database
    await db(sqlInsert, [username, email, hashPassword, first_name, last_name]);
    return res.status(200).send({ message: "Registration is successful" });
  } catch (error) {
    res.status(500).send({ message: "Registration failed", error });
  };
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = (?) OR email = (?)";
    
    // Check if the user is exists.
    const [user] = await db(sql, [username, email]);
    if (!user) return res.status(404).send({ message: "User not found" });

    // Compare the password from database and from request body.
    if (bcrypt.compareSync(password, user.password)) {
      const ACCESS_TOKEN = generateAccessToken(user);
      const REFRESH_TOKEN = generateRefreshToken(user);
      res
        .cookie("REFRESH_TOKEN", REFRESH_TOKEN, cookieOptions)
        .status(200)
        .send({ message: "Login successfully", token: ACCESS_TOKEN });
      return;
    } else {
      return res.status(404).send({ message: "Password is incorrect" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Login failed", error });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const sqlSelect = "SELECT * FROM users WHERE email = ?;";
    const sqlInsert = "INSERT INTO reset_password_token (id, encrypted) VALUES (?, ?);";
    
    // Check if user exists
    const [user] = await db(sqlSelect, [email]);
    if (!user) return res.status(404).send({ message: "User doesn't exist" });
    
    // Generate tokens
    const token = generateResetToken(user);
    const shortToken = await referenceToken();
    const encryptedToken = encryptData(token);
    const encodedToken = encodeURIComponent(shortToken);

    // Save token to the database
    await db(sqlInsert, [shortToken, encryptedToken]);

    // Send reset password email
    sendEmail(email, "Reset Password", encodedToken);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).send({ message: "Forgot password failed", error });
  }
};

const resetPasswordForm =  async (req: Request, res: Response) => {
  const token = req.query.token as string;
  const decodedToken = decodeURIComponent(token);
  const sqlSelect = "SELECT * FROM reset_password_token WHERE id = (?);";

  // Check if the token (id) exists in the database.
  const [data] = await db(sqlSelect, [decodedToken]); 
  const decryptedToken = decryptData(data.encrypted);

  // then decrypt the code to check if it is still valid.
  jwt.verify(decryptedToken, process.env.RESET_PWD_TKN_SECRET!, (error, decode) => {
    if(error) return res.status(500).send({ message: "Cannot access the reset password form", error });
    const { email, user_id } = decode as { email: any, user_id:any };
    res.status(200).render("resetPassword", { email, user_id });
  });
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    const decodedToken = decodeURIComponent(token);
    const { email, user_id, password, confirmPassword } = req.body;
    if(password !== confirmPassword) return res.status(422).send({ message: "Password does not match confirm password" });
    if(password.length <= 5) return res.status(400).json({ error: "Password should be at least 5 characters long." });

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const sqlSelect = "SELECT * FROM users WHERE email = (?) AND user_id = (?);";
    const sqlUpdate = "UPDATE users SET password = (?) WHERE email = (?) AND user_id = (?);";
    const sqlDelete = "DELETE reset_password_token WHERE id = ?;";

    // Check if the user exists.
    const [user] = await db(sqlSelect, [email, user_id]);
    if(!user) return res.status(404).send({ message: "User not found" });

    // Update the user's password and delete the reset password token from the database.
    await db(sqlUpdate, [hashPassword, email, user_id]);
    await db(sqlDelete, [decodedToken]);
    res.status(200).send({ message: "Reset password successfully" });
  } catch (error) {
    res.status(500).send({ message: "Reset password failed", error });
  };
};

const logout = async (req: Request, res: Response) => {
  res
    .clearCookie("REFRESH_TOKEN", {
      sameSite: "none",
      secure: cookieOptions.secure,
      httpOnly: true,
    })
    .status(200)
    .send({ message: "Logout successfully" });
};

export {
  register,
  login,
  forgotPassword,
  resetPasswordForm,
  resetPassword, 
  logout,
};
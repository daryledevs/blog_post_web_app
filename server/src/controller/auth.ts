import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  referenceToken,
} from "../util/authTokens";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import sendEmail from "../config/nodemailer";
import encryptData from "../util/encrypt";
import decryptData from "../util/decrypt";
import db from "../database/query";
dotenv.config();

const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password, first_name, last_name } = req.body;
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const sqlSelect = "SELECT * FROM USERS WHERE EMAIL = ? OR USERNAME = ?";
    const sqlInsert = "INSERT INTO USERS (USERNAME, EMAIL, PASSWORD, FIRST_NAME, LAST_NAME) VALUES (?, ?, ?, ?, ?)";

    // Check to see if the user is already in the database.
    const [user] = await db(sqlSelect, [email, username]);
    if(user) return res.status(409).send({ message: "User is already exists" });

    // Save the user to the database
    await db(sqlInsert, [username, email, hashPassword, first_name, last_name]);
    return res.status(200).send({ message: "Registration is successful" });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const login = async (req: Request, res: Response) => {
  try {
    const { userCredential, password } = req.body;
    const isMissing = !req.body || !userCredential || !password;
    
    const sql = "SELECT * FROM USERS WHERE (USERNAME = ? OR EMAIL = ?)";
    if(isMissing) return res.status(400).send({ message: "Missing required fields" });
    
    // Check if the user is exists.
    const [user] = await db(sql, [userCredential || "", userCredential || ""]);
    if(!user) return res.status(404).send({ message: "User not found" });

    // Compare the password from database and from request body.
    if(bcrypt.compareSync(password, user.PASSWORD)) {
      const ACCESS_TOKEN = generateAccessToken(user);
      const REFRESH_TOKEN = generateRefreshToken(user);
      res
        .cookie("REFRESH_TOKEN", REFRESH_TOKEN, req.body.cookieOptions)
        .status(200)
        .send({ message: "Login successfully", token: ACCESS_TOKEN });
      return;
    } else {
      return res.status(404).send({ message: "Password is incorrect" });
    }
  } catch (error:any) {
    return res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const sqlSelect = "SELECT * FROM USERS WHERE EMAIL = ?;";
    const sqlInsert = "INSERT INTO RESET_PASSWORD_TOKEN (TOKEN_ID, ENCRYPTED) VALUES (?, ?);";
    
    // Check if user exists
    const [user] = await db(sqlSelect, [email]);
    if(!user) return res.status(404).send({ message: "User doesn't exist" });
    
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
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const resetPasswordForm =  async (req: Request, res: Response) => {
  try {  
    const token = req.query.token as string;
    const decodedToken = decodeURIComponent(token);
    const sqlSelect = "SELECT * FROM RESET_PASSWORD_TOKEN WHERE TOKEN_ID = (?);";

    // Check if the token (id) exists in the database.
    const [data] = await db(sqlSelect, [decodedToken]); 
    const decryptedToken = decryptData(data.ENCRYPTED);

    // then decrypt the code to check if it is still valid.
    jwt.verify(decryptedToken, process.env.RESET_PWD_TKN_SECRET!, (error, decode) => {
      if(error) return res.status(500).send({ message: "Cannot access the reset password form", error });
      const { email, user_id } = decode as { email: any, user_id:any };
      res.status(200).render("resetPassword", { email, user_id });
    });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { tokenId, user_id, email, password, confirmPassword } = req.body;
    if(password !== confirmPassword) return res.status(422).send({ message: "Password does not match confirm password" });
    if(password.length <= 5) return res.status(400).json({ error: "Password should be at least 5 characters long." });
    
    // Used limit here due to "safe update mode" error.
    const sqlDelete = "DELETE FROM RESET_PASSWORD_TOKEN WHERE id = (?) LIMIT 1;"; 
    const sqlUpdate = "UPDATE USERS SET PASSWORD = (?) WHERE EMAIL = (?) AND USER_ID = (?);";
    const sqlSelect = "SELECT * FROM USERS WHERE EMAIL = (?) AND USER_ID = (?);";
    const decodedTokenId = decodeURIComponent(tokenId);
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Check if the user exists.
    const [user] = await db(sqlSelect, [email, user_id]);
    if(!user) return res.status(404).send({ message: "User not found" });

    // Update the user's password and delete the reset password token from the database.
    await db(sqlUpdate, [hashPassword, email, user_id]);
    await db(sqlDelete, [decodedTokenId]);
    res.status(200).send({ message: "Reset password successfully" });
  } catch (error:any) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  };
};

const logout = async (req: Request, res: Response) => {
  res
    .clearCookie("REFRESH_TOKEN", {
      sameSite: "none",
      secure: req.body.cookieOptions.secure,
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
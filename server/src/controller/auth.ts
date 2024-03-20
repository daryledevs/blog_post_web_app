import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  referenceToken,
}                                          from "../util/authTokens";
import jwt                                 from "jsonwebtoken";
import bcrypt                              from "bcrypt";
import Exception                           from "../exception/exception";
import sendEmail                           from "../config/nodemailer";
import * as dotenv                         from "dotenv";
import encryptData                         from "../util/encrypt";
import decryptData                         from "../util/decrypt";
import UserRepository                      from "../repository/user-repository";
import AuthRepository                      from "../repository/auth-repository";
import { NextFunction, Request, Response } from "express";
dotenv.config();

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Check to see if the user is already in the database.
    const user = await UserRepository.findUserByCredentials(username, email);
    if(user) return res.status(409).send({ message: "User is already exists" });

    const { cookieOptions, ...rest } = req.body;
    // Save the user to the database
    await AuthRepository.createUser({ ...rest, password: hashPassword });
    return res.status(200).send({ message: "Registration is successful" });
  } catch (error) {
    next(error);
  };
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userCredential, password } = req.body;
    const isMissing = !req.body || !userCredential || !password;
    if(isMissing) return res.status(400).send({ message: "Missing required fields" });
    
    // Check if the user is exists.
    const user: any = await UserRepository.findUserByCredentials(userCredential, userCredential);
    if(!user) return next(Exception.notFound("User not found"));

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
    };
  } catch (error) {
    next(error);
  };
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user: any = await UserRepository.findUserByEmail(email);
    if(!user) next(Exception.notFound("User doesn't exists"));
    
    // Generate tokens
    const token = generateResetToken({ EMAIL: email, USER_ID: user.USER_ID });
    const shortToken: any = await referenceToken();
    const encryptedToken = encryptData(token);
    const encodedToken = encodeURIComponent(shortToken);

    // Save token to the database
    await AuthRepository.saveResetToken({ 
      user_id: user.USER_ID, 
      encrypted: encryptedToken 
    });

    // Send reset password email
    sendEmail(email, "Reset Password", encodedToken);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    next(error);
  };
};

const resetPasswordForm =  async (req: Request, res: Response, next: NextFunction) => {
  try {  
    const token = req.query.token as string;
    const decodedToken: any = decodeURIComponent(token);

    // Check if the token (id) exists in the database.
    const data = await AuthRepository.findResetTokenById(decodedToken)
    const decryptedToken = decryptData(data?.ENCRYPTED);

    // then decrypt the code to check if it is still valid.
    jwt.verify(decryptedToken, process.env.RESET_PWD_TKN_SECRET!, (error, decode) => {
      if(error) return next(Exception.badRequest("Invalid or expired token"));
      const { email, user_id } = decode as { email: any, user_id:any };
      res.status(200).render("resetPassword", { email, user_id });
    });
  } catch (error) {
    next(error);
  };
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tokenId, user_id, email, password, confirmPassword } = req.body;
    const isPasswordMismatch = password !== confirmPassword;
    const passwordLength = password.length <= 5;

    if(isPasswordMismatch) return next(Exception.badRequest("Password does not match"));
    if(passwordLength) return next(Exception.badRequest("Password must be at least 6 characters"));
    
    const decodedTokenId: any = decodeURIComponent(tokenId);
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Check if the user exists.
    const user = await UserRepository.findUserById(user_id);
    if(!user) return next(Exception.notFound("User not found"));

    // Update the user's password and delete the reset password token from the database.
    await UserRepository.updateUser(user_id, { PASSWORD: hashPassword })
    await AuthRepository.deleteResetToken(decodedTokenId);
    // add here confirmation email to the user that the password has been reset.
    res.status(200).send({ message: "Reset password successfully" });
  } catch (error) {
    next(error);
  };
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
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
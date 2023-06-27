import database from "../database";
import { Request, Response, query } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import cookieOptions from "../config/cookieOptions";
import sendEmail from "../config/nodemailer";
dotenv.config();

const register = async (req: Request, res: Response) => {
  const { email, username, password, first_name, last_name } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
  database.query(sql, [email, username], (err, data) => {
    if(err) return res.status(500).send(err);
    if(data.length) return res.status(409).send({ message: "User is already exists" });
    const sql = "INSERT INTO users(`username`, `email`, `password`, `first_name`, `last_name`) VALUES (?)";
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const values = [username, email, hashPassword, first_name, last_name];
    database.query(sql, [values], (error, data) => {
      if(error) return res.status(500).send(error);
      return res.status(200).send({ message: "Registration is successful" });
    });
  });
};

const login = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = (?) OR email =(?)";
  database.query(
    sql,
    [username, email],
    (error, data) =>{
      if(error) return res.status(500).send(error);
      if(!data.length) return res.status(404).send({ message: "User not found" });
      let [userDetails] = data;
      // '!' non-null assertion operator 
      const ACCESS_SECRET = process.env.ACCESS_TKN_SECRET!;
      const REFRESH_SECRET = process.env.REFRESH_TKN_SECRET!;
      if(bcrypt.compareSync(password, userDetails.password)){

        const ACCESS_TOKEN = jwt.sign(
          { user_id: userDetails.user_id, roles: userDetails.roles },
          ACCESS_SECRET,
          { expiresIn: "15m" }
        );
        const REFRESH_TKN = jwt.sign(
          { user_id: userDetails.user_id, username: userDetails.username },
          REFRESH_SECRET,
          { expiresIn: "7d" }
        );
        
        res
          .cookie("REFRESH_TOKEN", REFRESH_TKN, cookieOptions)
          .status(200)
          .send({ message: "Login successfully", token: ACCESS_TOKEN });

        return; 
      } else {
        return res.status(404).send({ message: "Password is incorrect" });
      }
    }
  );
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const sql = "SELECT * FROM users WHERE email = (?);";
  database.query(sql, [email], (error, data) => {
    if(error) return res.status(500).send({ error, message: "Forgot password failed" });
    if(!data.length) return res.status(404).send({ error, message: "User doesn't exists" });
    let [user] = data;
    const token = jwt.sign(
      { email: user.email, user_id: user.user_id },
      process.env.RESET_PWD_TKN_SECRET!,
      { expiresIn: "1hr", }
    );
    sendEmail(email, "Reset Password", token);
    res.json({ message: "Password reset email sent" });
  });
};

const resetPasswordForm =  async (req: Request, res: Response) => {
  // need this because of the query parameter can be a single value or an array of values
  const token: string | string[] | undefined = req.query.token as string;
  jwt.verify(token, process.env.RESET_PWD_TKN_SECRET!, (error, decode) => {
    if(error) return res.status(500).send({ message: "Cannot access the reset password form", error });
    const { email, user_id } = decode as { email: any, user_id:any };
    res.status(200).render("resetPassword", { email, user_id });
  });
};

const resetPassword = async (req: Request, res: Response) => {
  const { email, user_id, password, confirmPassword } = req.body;
  const isMatch = password !== confirmPassword;
  const errMsg = "Password does not match confirm password";
  if(isMatch) return res.status(401).send({ message: errMsg });
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const sql = `
    SELECT * FROM users WHERE email = (?) AND user_id = (?);
    UPDATE users SET password = (?) WHERE email = (?) AND user_id = (?);
  `;
  database.query(sql, [
    email, user_id,
    hashPassword, email, user_id
  ], (error, data) => {
    if(error) return res.status(500).send({ message: "Reset password failed", error });
    if(!data.length) return res.status(404).send({ message: "User not found" });
    res.status(200).send({ message: "Reset password successfully" });
  });
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
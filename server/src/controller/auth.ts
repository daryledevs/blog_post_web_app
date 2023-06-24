import database from "../database";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import cookieOptions from "../config/cookieOptions";
dotenv.config();

interface ICheckToken {
  user_id: number;
  username: string;
}

const register = async (req: Request, res: Response) => {
  const { email, username, password, first_name, last_name } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? OR username = ?";

  database.query(sql, [email, username], (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.length)
      return res.status(409).send({ message: "User is already exists" });

    const sql =
      "INSERT INTO users(`username`, `email`, `password`, `first_name`, `last_name`) VALUES (?)";
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const values = [username, email, hashPassword, first_name, last_name];

    database.query(sql, [values], (error, data) => {
      if (error) return res.status(500).send(error);
      return res.status(200).send({ message: "Registration is successful" });
    });
  });
};

const login = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? OR email = ?";

  database.query(
    sql,
    [username, email],
    (error, data) =>{
      if(error) return res.status(500).send(error);
      if(!data.length) return res.status(404).send({ message: "User not found" });

      let userDetails;
      // '!' non-null assertion operator 
      const ACCESS_SECRET = process.env.ACCESS_TKN_SECRET!;
      const REFRESH_SECRET = process.env.REFRESH_TKN_SECRET!;
      [userDetails] = data;

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

export { register, login, logout };
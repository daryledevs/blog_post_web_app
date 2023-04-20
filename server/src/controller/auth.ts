import database from "../database";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface ICheckToken {
  user_id: number;
  username: string;
}

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
          { expiresIn: "1hr" }
        );

        const REFRESH_TKN = jwt.sign(
          { user_id: userDetails.user_id, username: userDetails.username },
          REFRESH_SECRET,
          { expiresIn: "7d" }
        );

        res
          .cookie("REFRESH_TOKEN", REFRESH_TKN, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week (days, hours, mins, milliseconds)
          })
          .status(200)
          .send({ message: "Login successfully", token: ACCESS_TOKEN });

        return; 
      } else {
        return res.status(404).send({ message: "Password is incorrect" });
      }
    }
  );
};

const checkToken = (req: Request, res: Response) => {
  if (!req.cookies?.REFRESH_TOKEN) return res.status(401).send({ message: "Unauthorized" });

  jwt.verify(
    req.cookies?.REFRESH_TOKEN,
    process.env.REFRESH_TKN_SECRET!,
    async (err: any, decoded: any) => {
      if (err) return res.status(500).send({ error: err });

      const { user_id, username } = decoded as ICheckToken;
      const sql = "SELECT * FROM users WHERE user_id = ?";

      database.query(sql, [user_id], (error, data) => {
        if (error) return res.status(500).send(error);
        if (!data.length) return res.status(404).send({ message: "User not found" });

        let [userDetails] = data;
        const ACCESS_SECRET = process.env.ACCESS_TKN_SECRET!;

         const ACCESS_TOKEN = jwt.sign(
           { user_id: userDetails.user_id, roles: userDetails.roles },
           ACCESS_SECRET,
           { expiresIn: "1d" }
         );

        res
          .status(200)
          .send({ message: "Token is valid", token: ACCESS_TOKEN });
      });
    }
  );
};

const logout = async (req: Request, res: Response) => {
  res
    .clearCookie("REFRESH_TOKEN", {
      sameSite: "none",
      // secure: true, // not https yet, so comment this out for now
      httpOnly: true,
    })
    .status(200)
    .send({ message: "Logout successfully" });
};

export { login, logout, checkToken };
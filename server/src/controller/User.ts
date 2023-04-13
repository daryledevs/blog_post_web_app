import database from "../database";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const register = async (req: Request, res: Response) => {
  const { email, username, password, first_name, last_name } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? OR username = ?";

  database.query(sql, [email, username], (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.length)
      return res.status(409).send({ message: "User is already exists" });

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const values = [username, email, hashPassword, first_name, last_name];

    const sql =
      "INSERT INTO users(`username`, `email`, `password`, `first_name`, `last_name`) VALUES (?)";

    database.query(sql, [values], (error, data) => {
      if (error) return res.status(500).send(error);
      return res.status(200).send({ message: "Registration is successful" });
    });
  });
};

const userData = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  const sql = "SELECT * FROM users WHERE user_id = (?);";

  database.query(sql, [user_id], (error, data) =>{
    if(error) return res.status(500).send({ message: error });
    if(!data.length) return res.status(404).send({ message: "User not found" });

    const [user] = data;
    const { password, ...rest } = user;
    
    res.status(200).send({ user: rest });
  })
};

export {
  register,
  userData
}
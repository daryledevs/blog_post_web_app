import { ErrorRequestHandler, Request, Response } from "express";
import database from "../database";
import jwt from "jsonwebtoken";

interface ICheckToken {
  user_id: number,
  roles: string,
}

const ErrorHandler : ErrorRequestHandler = (err, req, res, next) => {
  if(err.name === "UnauthorizedError") return res.status(401).send({ error: err, message: "Token is not valid"});
  return res.status(500).json({ message: err });
};

// If the client able to receive it, then the token from cookie is valid
// Otherwise, the user will receive the response from above
const checkToken = (req: Request, res: Response) => {
  const token = req.cookies.authorization_key;
  const { user_id, roles } = jwt.decode(token, { json: true }) as ICheckToken;
  
  const sql = "SELECT * FROM users WHERE user_id = ?";

  database.query(sql, [user_id], (error, data) =>{
    if(error) return res.status(500).send(error);
    if(!data.length) return res.status(404).send({ message: "User not found" });

    let [userDetails] = data;
    const { password, ...rest } = userDetails;

    
  res.status(200).send({ message: "Token is valid", user_data: rest });
  });
};

export {
  ErrorHandler,
  checkToken,
};
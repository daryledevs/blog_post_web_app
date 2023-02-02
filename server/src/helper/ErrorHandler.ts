import { ErrorRequestHandler, Request, Response } from "express";

const ErrorHandler : ErrorRequestHandler = (err, req, res, next) => {
  if(err.name === "UnauthorizedError") return res.status(401).send({ error: err, message: "Token is not valid"});
  return res.status(500).json({ message: err });
};

// If the client able to receive it, then the token from cookie is valid
// Otherwise, the user will receive the response from above
const checkToken = (req: Request, res: Response) => {
  res.status(200).send({ message: "Token is valid" });
};

export {
  ErrorHandler,
  checkToken,
};
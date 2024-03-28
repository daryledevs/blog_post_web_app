import * as dotenv                         from "dotenv";
import AuthService                         from "@/service/auth/auth.service.impl";
import { NextFunction, Request, Response } from "express";
dotenv.config();

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cookieOptions, ...rest } = req.body;
      const result = await this.authService.register(rest);
      res.status(201).send({ message: result });
    } catch (error) {
      next(error);
    };
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userCredential, password } = req.body;
      const result = await this.authService.login(userCredential, password);
      res
        .cookie("REFRESH_TOKEN", result.refreshToken, req.body.cookieOptions)
        .status(200)
        .send({ message: result.message, token: result.token });
    } catch (error) {
      next(error);
    };
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.forgotPassword(req.body);
      res.status(200).send({ message: result });
    } catch (error) {
      next(error);
    };
  };

  public resetPasswordForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.resetPasswordForm(req.body);
      res.status(201).render(result.render, result.data);
    } catch (error) {
      next(error);
    };
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.resetPassword(req.body);
      res.status(200).send({ message: result });
    } catch (error) {
      next(error);
    };
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .clearCookie("REFRESH_TOKEN", {
          sameSite: "none",
          secure: req.body.cookieOptions.secure,
          httpOnly: true,
        })
        .status(200)
        .send({ message: "Logout successfully" });
    } catch (error) {
      next(error);
    };
  };
};

export default AuthController;
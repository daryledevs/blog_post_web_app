import * as dotenv                         from "dotenv";
import AuthService                         from "@/services/auth/auth.service.impl";
import AsyncWrapper                        from "@/utils/async-wrapper.util";
import { NextFunction, Request, Response } from "express";
dotenv.config();

class AuthController {
  private authService: AuthService;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { cookieOptions, ...rest } = req.body;
      const result = await this.authService.register(rest);
      res.status(201).send({ message: result });
    }
  );

  public login = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { userCredential, password } = req.body;
      const result = await this.authService.login(userCredential, password);
      res
        .cookie("REFRESH_TOKEN", result.refreshToken, req.body.cookieOptions)
        .status(200)
        .send({ message: result.message, token: result.token });
    }
  );

  public forgotPassword = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.authService.forgotPassword(req.body);
      res.status(200).send({ message: result });
    }
  );

  public resetPasswordForm = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.authService.resetPasswordForm(req.body);
      res.status(201).render(result.render, result.data);
    }
  );

  public resetPassword = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.authService.resetPassword(req.body);
      res.status(200).send({ message: result });
    }
  );

  public logout = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      res
        .clearCookie("REFRESH_TOKEN", {
          sameSite: "none",
          secure: req.body.cookieOptions.secure,
          httpOnly: true,
        })
        .status(200)
        .send({ message: "Logout successfully" });
    }
  );
};

export default AuthController;
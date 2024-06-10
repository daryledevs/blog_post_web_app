import UserDto                             from "@/dto/user.dto";
import * as dotenv                         from "dotenv";
import AsyncWrapper                        from "@/utils/async-wrapper.util";
import IEAuthService                       from "@/services/auth/auth.service";
import { plainToInstance }                 from "class-transformer";
import { NextFunction, Request, Response } from "express";
dotenv.config();

class AuthController {
  private authService: IEAuthService;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(authService: IEAuthService) {
    this.authService = authService;
  }

  public register = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { cookieOptions, ...rest } = req.body;
      const userDto = plainToInstance(UserDto, rest as object);
      const result = await this.authService.register(userDto);
      res.status(201).send(result);
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
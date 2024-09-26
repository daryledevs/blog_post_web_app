import UserDto               from "@/domain/dto/user.dto";
import * as dotenv           from "dotenv";
import cookieOptions         from "@/config/cookie-options.config";
import IEAuthService         from "@/application/services/auth/auth.service";
import { plainToInstance }   from "class-transformer";
import { Request, Response } from "express";
dotenv.config();

class AuthController {
  private authService: IEAuthService;

  constructor(authService: IEAuthService) {
    this.authService = authService;
  }

  public register = async (req: Request, res: Response) => {
    const data = req.body;
    const userDto = plainToInstance(UserDto, data as object);
    const result = await this.authService.register(userDto);
    res.status(201).send({ message: result.message, user: result.user?.getUserDetails() });
  };

  public login = async (req: Request, res: Response) => {
    const { userCredentials, password } = req.body;
    const result = await this.authService.login(userCredentials, password);
    res
      .cookie("REFRESH_TOKEN", result.refreshToken, cookieOptions)
      .status(200)
      .send({ message: result.message, token: result.token });
  };

  public forgotPassword = async (req: Request, res: Response) => {
    const result = await this.authService.forgotPassword(req.body?.email);
    res.status(200).send({ message: result });
  };

  public resetPasswordForm = async (req: Request, res: Response) => {
    const query = req.query.token as string;
    const result = await this.authService.resetPasswordForm(query);
    res.status(201).render(result.render, result.data);
  };

  public resetPassword = async (req: Request, res: Response) => {
    const result = await this.authService.resetPassword(req.body);
    res.status(200).send({ message: result });
  };

  public logout = async (req: Request, res: Response) => {
    res
      .clearCookie("REFRESH_TOKEN", {
        sameSite: "none",
        secure: cookieOptions.secure,
        httpOnly: true,
      })
      .status(200)
      .send({ message: "Logout successfully" });
  };
};

export default AuthController;
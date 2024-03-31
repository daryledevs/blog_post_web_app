import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  referenceToken,
}                                                      from "@/util/authTokens";
import jwt                                             from "jsonwebtoken";
import bcrypt                                          from "bcrypt";
import Exception                                       from "@/exception/exception";
import sendEmail                                       from "@/config/nodemailer";
import encryptData                                     from "@/util/encrypt";
import decryptData                                     from "@/util/decrypt";
import { NewUsers }                                    from "@/types/table.types";
import AuthRepository                                  from "@/repository/auth/auth.repository.impl";
import UserRepository                                  from "@/repository/user/user.repository.impl";
import IAuthService, { IResetPasswordForm, LoginType } from "./auth.service";

class AuthService implements IAuthService {
  private authRepository: AuthRepository;
  private userRepository: UserRepository;

  constructor(authRepository: AuthRepository, userRepository: UserRepository) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
  }

  public async register(data: NewUsers): Promise<string> {
    try {
      const { email, username, password } = data;
      const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

      if(!email || !username || !password) throw Exception.badRequest("All fields are required");
      if(password.length <= 5) throw Exception.badRequest("Password must be at least 6 characters");

      // Check to see if the user is already in the database.
      const userByEmail    = await this.userRepository.findUserByEmail(email);
      const userByUsername = await this.userRepository.findUserByUsername(username);

      if (userByUsername) throw Exception.conflict("Username already exists");
      if(userByEmail) throw Exception.conflict("Email already exists");

      // Save the user to the database
      await this.authRepository.createUser({ ...data, password: hashPassword });
      return "Registration is successful";
    } catch (error) {
      throw error;
    };
  };

  public async login(userCredential: string, password: string): Promise<LoginType> {
    try {
      const user: any = await this.userRepository.findUserByCredentials(userCredential);

      if (!user) throw Exception.notFound("User not found");

      const isPasswordMatch = bcrypt.compareSync(password, user.password);
      if (!isPasswordMatch) throw Exception.unauthorized("Invalid password");

      const ACCESS_TOKEN = generateAccessToken(user);
      const REFRESH_TOKEN = generateRefreshToken(user);
      return { message: "Login successfully", token: ACCESS_TOKEN, refreshToken: REFRESH_TOKEN, };
    } catch (error) {
      throw error;
    };
  };

  public async forgotPassword(data: any) {
    try {
      const user = await this.userRepository.findUserByEmail(data.email);
      if (!user) throw Exception.notFound("User not found");

      // Generate tokens
      const resetToken = generateResetToken({
        EMAIL: data.email,
        user_id: user.user_id as any,
      });

      const shortToken: any = await referenceToken();
      const encryptedToken = encryptData(resetToken);
      const encodedToken = encodeURIComponent(shortToken);

      // Save token to the database
      await this.authRepository.saveResetToken({
        user_id: user.user_id,
        encrypted: encryptedToken,
      });

      // Send reset password email
      sendEmail(data.email, "Reset Password", encodedToken);
      return "Token sent to your email";
    } catch (error) {
      throw error;
    };
  };

  public async resetPasswordForm(tokenId: string): Promise<IResetPasswordForm> {
    try {
      const decodedToken: any = decodeURIComponent(tokenId);

      // Check if the token (id) exists in the database.
      const data = await this.authRepository.findResetTokenById(decodedToken);
      if (!data) throw Exception.badRequest("Invalid or expired token");
      const decryptedToken = decryptData(data.encrypted as any);

      // then decrypt the code to check if it is still valid.
      return new Promise((resolve, reject) => {
        jwt.verify(
          decryptedToken,
          process.env.RESET_PWD_TKN_SECRET!,
          (error, decode) => {
            if (error) reject(Exception.badRequest("Invalid or expired token"));
            const { email, user_id } = decode as { email: any; user_id: any };
            resolve({
              render: "resetPassword",
              data: { email, user_id, tokenId },
            });
          }
        );
      });
    } catch (error) {
      throw error;
    };
  };

  public async resetPassword(data: any): Promise<string> {
    try {
      const { tokenId, user_id, email, password, confirmPassword } = data;
      const isPasswordMismatch = password !== confirmPassword;
      const passwordLength = password.length <= 5;

      if (isPasswordMismatch) throw Exception.badRequest("Password does not match");
      if (passwordLength) throw Exception.badRequest("Password must be at least 6 characters");

      const decodedTokenId: any = decodeURIComponent(tokenId);
      const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

      // Check if the user exists.
      const user = await this.userRepository.findUserById(user_id);
      if (!user) throw Exception.notFound("User not found");

      // Update the user's password and delete the reset password token from the database.
      await this.userRepository.updateUser(user_id, { password: hashPassword });
      await this.authRepository.deleteResetToken(decodedTokenId);

      // add here confirmation email to the user that the password has been reset.
      return "Reset password successfully";
    } catch (error) {
      throw error;
    };
  };
};

export default AuthService;
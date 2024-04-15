import jwt                                             from "jsonwebtoken";
import bcrypt                                          from "bcrypt";
import sendEmail                                       from "@/utils/send-email.util";
import CryptoUtil                                      from "@/utils/crypto.util";
import AsyncWrapper                                    from "@/utils/async-wrapper.util";
import { NewUsers }                                    from "@/types/table.types";
import AuthRepository                                  from "@/repositories/auth/auth.repository.impl";
import UserRepository                                  from "@/repositories/user/user.repository.impl";
import AuthTokensUtil, { Expiration, TokenSecret }                                  from "@/utils/auth-token.util";
import ErrorException                                  from "@/exceptions/api.exception";
import IAuthService, { IResetPasswordForm, LoginType } from "./auth.service";

class AuthService implements IAuthService {
  private authRepository: AuthRepository;
  private userRepository: UserRepository;
  private wrap = new AsyncWrapper();

  constructor(authRepository: AuthRepository, userRepository: UserRepository) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
  }

  public register = this.wrap.serviceWrap(
    async (data: NewUsers): Promise<string> => {
      const { email, username, password } = data;
      const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

      // Check if the user has provided all the required fields
      if (!email || !username || !password) throw ErrorException
        .HTTP400Error("All fields are required");

      // Check if the password is less than 6 characters
      if (password.length <= 5) throw ErrorException
        .HTTP400Error("Password must be at least 6 characters");

      // Check to see if the user is already in the database.
      const userByEmail = await this.userRepository.findUserByEmail(email);
      const userByUsername = await this.userRepository
        .findUserByUsername(username);

      if (userByUsername) throw ErrorException
        .HTTP409Error("Username already exists");
        
      if (userByEmail) throw ErrorException
        .HTTP409Error("Email already exists");

      // Save the user to the database
      await this.authRepository.createUser({ ...data, password: hashPassword });
      return "Registration is successful";
    }
  );

  public login = this.wrap.serviceWrap(
    async (userCredential: string, password: string): Promise<LoginType> => {
      // Check if the user exists in the database
      const user: any = await this.userRepository.findUserByCredentials(
        userCredential
      );

      // If the user does not exist, return an error
      if (!user) throw ErrorException.HTTP404Error("User not found");

      // Check if the password is correct
      const isPasswordMatch = bcrypt.compareSync(password, user.password);

      // If the password is incorrect, return an error
      if (!isPasswordMatch) throw ErrorException
        .HTTP401Error("Invalid password");

      const args = {
        accessToken: {
          payload: { user_id: user.user_id, roles: user.roles },
          secret: TokenSecret.ACCESS_SECRET,
          expiration: Expiration.ACCESS_TOKEN_EXPIRATION,
        },

        refreshToken: {
          payload: { user_id: user.user_id, username: user.username },
          secret: TokenSecret.REFRESH_SECRET,
          expiration: Expiration.REFRESH_TOKEN_EXPIRATION,
        },
      };

      // Generate tokens
      const ACCESS_TOKEN = AuthTokensUtil.generateToken(args.accessToken);
      const REFRESH_TOKEN = AuthTokensUtil.generateToken(args.refreshToken);

      return {
        message: "Login successfully",
        token: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN,
      };
    }
  );

  public forgotPassword = this.wrap.serviceWrap(
    async (data: any): Promise<string> => {
      // If the user is not found, return an error
      const user = await this.userRepository.findUserByEmail(data.email);
      if (!user) throw ErrorException.HTTP404Error("User not found");

      const args = {
        payload: {
          email: data.email,
          user_id: user.user_id as any,
        },
        secret: TokenSecret.RESET_SECRET,
        expiration: Expiration.RESET_TOKEN_EXPIRATION,
      };

      // Generate tokens
      const resetToken = AuthTokensUtil.generateToken(args);

      const shortToken: any = await AuthTokensUtil.referenceToken();
      const encryptedToken = CryptoUtil.encryptData(resetToken);
      const encodedToken = encodeURIComponent(shortToken);

      // Save token to the database
      await this.authRepository.saveResetToken({
        user_id: user.user_id,
        encrypted: encryptedToken,
      });

      // Send reset password email
      sendEmail(data.email, "Reset Password", encodedToken);
      return "Token sent to your email";
    }
  );

  public resetPasswordForm = this.wrap.serviceWrap(
    async (tokenId: string): Promise<IResetPasswordForm> => {
      const decodedToken: any = decodeURIComponent(tokenId);

      // Check if the token (id) exists in the database.
      const data = await this.authRepository.findResetTokenById(decodedToken);
      if (!data) throw ErrorException.HTTP400Error("Invalid or expired token");
      const decryptedToken = CryptoUtil.decryptData(data.encrypted as any);

      // then decrypt the code to check if it is still valid.
      return AuthTokensUtil.verifyResetPasswordToken(decryptedToken, tokenId);
    }
  );

  public resetPassword = this.wrap.serviceWrap(
    async (data: any): Promise<string> => {
      const { tokenId, user_id, email, password, confirmPassword } = data;
      const isPasswordMismatch = password !== confirmPassword;
      const passwordLength = password.length <= 5;

      // Check if the password and confirm password match
      if (isPasswordMismatch) throw ErrorException
        .HTTP400Error("Password does not match");

      // Check if the password is less than 6 characters
      if (passwordLength) throw ErrorException
        .HTTP400Error("Password must be at least 6 characters");

      // Decrypt the token
      const decodedTokenId: any = decodeURIComponent(tokenId);
      const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

      // If the user is not found, return an error
      const user = await this.userRepository.findUserById(user_id);
      if (!user) throw ErrorException.HTTP404Error("User not found");

      // Update the user's password and delete the reset password token from the database.
      await this.userRepository.updateUser(user_id, { password: hashPassword });
      await this.authRepository.deleteResetToken(decodedTokenId);

      // add here confirmation email to the user that the password has been reset.
      return "Reset password successfully";
    }
  );
};

export default AuthService;
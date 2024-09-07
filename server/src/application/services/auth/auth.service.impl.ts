import User                                             from "@/domain/models/user.model";
import bcrypt                                           from "bcrypt";
import UserDto                                          from "@/domain/dto/user.dto";
import CryptoUtil                                       from "@/application/libs/crypto-service.lib";
import EmailService                                     from "@/application/libs/email-service.lib";
import IEAuthRepository                                 from "@/domain/repositories/auth.repository";
import IEUserRepository                                 from "@/domain/repositories/user.repository";
import ApiErrorException                                from "@/application/exceptions/api.exception";
import { plainToInstance }                              from "class-transformer";
import AuthTokensUtil, { Expiration, TokenSecret }      from "@/application/utils/auth-token.util";
import IEAuthService, { IResetPasswordForm, LoginType } from "./auth.service";

class AuthService implements IEAuthService {
  private authRepository: IEAuthRepository;
  private userRepository: IEUserRepository;

  constructor(
    authRepository: IEAuthRepository,
    userRepository: IEUserRepository
  ) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
  }

  public register = async (
    userDto: UserDto
  ): Promise<{ message: string; user: UserDto | undefined }> => {
    // check to see if the user is already in the database.
    const isEmailExist = await this.userRepository.findUserByEmail(
      userDto.getEmail()
    );

    // if the email is already in the exists, return an error
    if (isEmailExist) {
      throw ApiErrorException.HTTP409Error("Email already exists");
    }

    // check to see if the username is already in the database.
    const isUsernameExist = await this.userRepository.findUserByUsername(
      userDto.getUsername()
    );

    // if the username is already in the database, return an error
    if (isUsernameExist) {
      throw ApiErrorException.HTTP409Error("Username already exists");
    }

    const hashPassword = bcrypt.hashSync(
      userDto.getPassword(),
      bcrypt.genSaltSync(10)
    );

    userDto.setPassword(hashPassword);

    const userInstance = plainToInstance(User, userDto);
    const newUser = userInstance.save();

    // Save the user to the database
    const user = await this.authRepository.createUser(newUser);
    if (!user) {
      throw ApiErrorException.HTTP400Error("User not created");
    }

    const newUserDto = plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });

    return { message: "Registration is successful", user: newUserDto };
  };

  public login = async (
    userCredential: string,
    password: string
  ): Promise<LoginType> => {
    // Check if the user exists in the database
    const user: any = await this.userRepository.findUserByCredentials(
      userCredential
    );

    // If the user does not exist, return an error
    if (!user) {
      throw ApiErrorException.HTTP404Error("User not found");
    }

    // Check if the password is correct
    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    // If the password is incorrect, return an error
    if (!isPasswordMatch) {
      throw ApiErrorException.HTTP401Error("Invalid password");
    }

    const args = {
      accessToken: {
        payload: { tkn_user_uuid: user.uuid, roles: user.roles },
        secret: TokenSecret.ACCESS_SECRET,
        expiration: Expiration.ACCESS_TOKEN_EXPIRATION,
      },

      refreshToken: {
        payload: { tkn_user_uuid: user.uuid, username: user.username },
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
  };

  public forgotPassword = async (email: any): Promise<string> => {
    const user = await this.userRepository.findUserByEmail(email);
    // If the user is not found, return an error
    if (!user) {
      throw ApiErrorException.HTTP404Error("User not found");
    }

    const args = {
      payload: {
        email: user.getEmail(),
        user_uuid: user.getUuid(),
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
      reference_token: shortToken,
      encrypted: encryptedToken,
    });

    // Send reset password email
    EmailService.sendEmail(user.getEmail(), "Reset Password", encodedToken);
    return "Token sent to your email";
  };

  public resetPasswordForm = async (
    token_id: string
  ): Promise<IResetPasswordForm> => {
    const decodedToken: any = decodeURIComponent(token_id);

    // Check if the token (id) exists in the database.
    const data = await this.authRepository.findResetTokenById(decodedToken);
    if (!data) throw ApiErrorException.HTTP400Error("Invalid or expired token");

    const decryptedToken = CryptoUtil.decryptData(data.encrypted as any);

    // then decrypt the code to check if it is still valid.
    return AuthTokensUtil.verifyResetPasswordToken(decryptedToken, token_id);
  };

  public resetPassword = async (data: any): Promise<string> => {
    const { 
      referenceToken, 
      user_uuid, 
      email, 
      password, 
    } = data;
    // Check if the user exists in the database
    const isEmailExist = await this.userRepository.findUserByEmail(email);

    if (!isEmailExist) {
      throw ApiErrorException.HTTP404Error("User not found");
    }

    // Decrypt the token
    const decodedTokenId: any = decodeURIComponent(referenceToken);
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const referenceTkn = await this.authRepository.findResetTokenById(
      decodedTokenId
    );

    if (!referenceTkn) {
      throw ApiErrorException.HTTP400Error("Token not found");
    }

    // If the user is not found, return an error
    const user = await this.userRepository.findUserById(user_uuid);
    
    if (!user) {
      throw ApiErrorException.HTTP404Error("User not found");
    }

    // Update the user's password and delete the reset password token from the database.
    await this.userRepository.updateUserById(user_uuid, {
      password: hashPassword,
    });

    await this.authRepository.deleteResetToken(decodedTokenId);

    // add here confirmation email to the user that the password has been reset.
    return "Reset password successfully";
  };
};

export default AuthService;
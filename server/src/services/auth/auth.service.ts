import UserDto from "@/dto/user.dto";

export type LoginType = {
  message: string;
  token: string;
  refreshToken: string;
};

export type IResetPasswordForm = {
  render: string;
  data: { 
    email: string; 
    user_id: any; 
    tokenId: string 
  };
};

interface IEAuthService {
  register: (userDto: UserDto) => Promise<{ message: string; user: UserDto | undefined }>;

  login: (userCredential: string, password: string) => Promise<LoginType>;

  forgotPassword: (email: string) => Promise<string>;

  resetPasswordForm: (tokenId: string) => Promise<IResetPasswordForm>;

  resetPassword: (data: any) => Promise<string>;
};

export default IEAuthService;
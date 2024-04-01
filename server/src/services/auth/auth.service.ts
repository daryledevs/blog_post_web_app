import { NewUsers } from "@/types/table.types";

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

interface IAuthService {
  register: (data: NewUsers) => Promise<string>;

  login: (userCredential: string, password: string) => Promise<LoginType>;

  forgotPassword: (email: string) => Promise<string>;
  
  resetPasswordForm: (tokenId: string) => Promise<IResetPasswordForm>;

  resetPassword: (data:any) => Promise<string>;
};

export default IAuthService;
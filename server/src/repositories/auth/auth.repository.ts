import { NewResetPasswordToken, NewUsers, SelectResetPasswordToken, SelectUsers } from "@/types/table.types";

interface IAuthRepository {
  createUser: (user: NewUsers) => Promise<SelectUsers | undefined>;

  findResetTokenById: (token_id: number) => Promise<SelectResetPasswordToken | undefined>;

  saveResetToken: (token: NewResetPasswordToken) => Promise<void>;

  deleteResetToken: (token_id: number) => Promise<void>;
};

export default IAuthRepository;
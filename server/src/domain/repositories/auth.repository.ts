import {
  NewResetPasswordToken,
  NewUsers,
  SelectResetPasswordToken,
}           from "@/domain/types/table.types";
import User from "@/domain/models/user.model";


interface IAuthRepository {
  createUser: (user: NewUsers) => Promise<User | undefined>;

  findResetTokenById: (token_id: string) => Promise<SelectResetPasswordToken | undefined>;

  saveResetToken: (token: NewResetPasswordToken) => Promise<void>;

  deleteResetToken: (token_id: string) => Promise<void>;
};

export default IAuthRepository;
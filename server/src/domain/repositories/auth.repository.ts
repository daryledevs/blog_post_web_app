import {
  NewResetPasswordToken,
  NewUsers,
  SelectResetPasswordToken,
}           from "@/domain/types/table.types";
import User from "@/domain/models/user.model";


interface IEAuthRepository {
  createUser: (user: NewUsers) => Promise<User | undefined>;

  findResetTokenById: (token_id: number) => Promise<SelectResetPasswordToken | undefined>;

  saveResetToken: (token: NewResetPasswordToken) => Promise<void>;

  deleteResetToken: (token_id: number) => Promise<void>;
};

export default IEAuthRepository;
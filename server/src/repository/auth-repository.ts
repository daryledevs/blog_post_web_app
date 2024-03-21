import {
  NewResetPasswordToken,
  NewUsers,
  SelectResetPasswordToken,
  SelectUsers,
}                                                    from "../types/table.types";
import db                                            from "../database/database";
import UserRepository                                from "./user-repository";
import DatabaseException                             from "../exception/database";

class AuthRepository {

  static async createUser(user: NewUsers): Promise<SelectUsers | undefined> {
    try {
      const { insertId } = await db
        .insertInto("users")
        .values(user)
        .executeTakeFirstOrThrow();

      return await UserRepository.findUserById(Number(insertId));
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async findResetTokenById(token_id:number): Promise<SelectResetPasswordToken | undefined> {
    try {
      return await db
        .selectFrom("reset_password_token")
        .selectAll()
        .where("token_id", "=", token_id)
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async saveResetToken(token: NewResetPasswordToken): Promise<string> {
    try {
      await db
        .insertInto("reset_password_token")
        .values(token)
        .execute();

      return "Reset token is saved successfully";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async deleteResetToken(token_id:number): Promise<string> {
    try {
      await db
        .deleteFrom("reset_password_token")
        .where("token_id", "=", token_id)
        .execute();

      return "Reset token is saved successfully";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };
};

export default AuthRepository;
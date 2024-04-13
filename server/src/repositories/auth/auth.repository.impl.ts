import {
  NewResetPasswordToken,
  NewUsers,
  SelectResetPasswordToken,
  SelectUsers,
}                        from "@/types/table.types";
import db                from "@/database/db.database";
import { DB }            from "@/types/schema.types";
import { Kysely }        from "kysely";
import UserRepository    from "../user/user.repository.impl";
import IAuthRepository   from "./auth.repository";
import DatabaseException from "@/exceptions/database.exception";

class AuthRepository implements IAuthRepository {
  private database: Kysely<DB>;
  private userRepository: UserRepository;

  constructor() { 
    this.database = db;
    this.userRepository = new UserRepository();
  };

  async createUser(user: NewUsers): Promise<SelectUsers | undefined> {
    try {
      const { insertId } = await this.database
        .insertInto("users")
        .values(user)
        .executeTakeFirstOrThrow();

      return await this.userRepository.findUserById(Number(insertId));
    } catch (error) {
      throw DatabaseException.error(error);
    }
  }

  async findResetTokenById(token_id: number): Promise<SelectResetPasswordToken | undefined> {
    try {
      return await this.database
        .selectFrom("reset_password_token")
        .selectAll()
        .where("token_id", "=", token_id)
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.error(error);
    }
  }

  async saveResetToken(token: NewResetPasswordToken): Promise<string> {
    try {
      await this.database.insertInto("reset_password_token").values(token).execute();

      return "Reset token is saved successfully";
    } catch (error) {
      throw DatabaseException.error(error);
    }
  }

  async deleteResetToken(token_id: number): Promise<string> {
    try {
      await this.database
        .deleteFrom("reset_password_token")
        .where("token_id", "=", token_id)
        .execute();

      return "Reset token is saved successfully";
    } catch (error) {
      throw DatabaseException.error(error);
    }
  }
};

export default AuthRepository;
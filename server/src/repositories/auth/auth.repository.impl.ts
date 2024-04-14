import {
  NewResetPasswordToken,
  NewUsers,
  SelectResetPasswordToken,
  SelectUsers,
}                        from "@/types/table.types";
import db                from "@/database/db.database";
import { DB }            from "@/types/schema.types";
import { Kysely }        from "kysely";
import AsyncWrapper      from "@/utils/async-wrapper.util";
import UserRepository    from "../user/user.repository.impl";
import IAuthRepository   from "./auth.repository";

class AuthRepository implements IAuthRepository {
  private database: Kysely<DB>;
  private userRepository: UserRepository;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() {
    this.database = db;
    this.userRepository = new UserRepository();
  };

  public createUser = this.wrap.repoWrap(
    async (user: NewUsers): Promise<SelectUsers | undefined> => {
      const { insertId } = await this.database
        .insertInto("users")
        .values(user)
        .executeTakeFirstOrThrow();

      return await this.userRepository.findUserById(Number(insertId));
    }
  );

  public findResetTokenById = this.wrap.repoWrap(
    async (token_id: number): Promise<SelectResetPasswordToken | undefined> => {
      return await this.database
        .selectFrom("reset_password_token")
        .selectAll()
        .where("token_id", "=", token_id)
        .executeTakeFirst();
    }
  );

  public saveResetToken = this.wrap.repoWrap(
    async (token: NewResetPasswordToken): Promise<void> => {
      await this.database
        .insertInto("reset_password_token")
        .values(token)
        .execute();
    }
  );

  public deleteResetToken = this.wrap.repoWrap(
    async (token_id: number): Promise<void> => {
      await this.database
        .deleteFrom("reset_password_token")
        .where("token_id", "=", token_id)
        .execute();
    }
  );
};

export default AuthRepository;
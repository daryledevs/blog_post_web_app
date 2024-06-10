import {
  SelectResetPasswordToken, 
  NewResetPasswordToken,
  SelectUsers,
  NewUsers,
}                       from "@/types/table.types";
import db               from "@/database/db.database";
import User             from "@/model/user.model";
import { DB }           from "@/types/schema.types";
import AsyncWrapper     from "@/utils/async-wrapper.util";
import { Kysely, sql }  from "kysely";
import IEAuthRepository from "./auth.repository";

class AuthRepository implements IEAuthRepository {
  private database: Kysely<DB>;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() { this.database = db; };

  public createUser = this.wrap.repoWrap(
    async (user: NewUsers): Promise<User | undefined> => {
      const { insertId } = await this.database
        .insertInto("users")
        .values(user)
        .executeTakeFirst();

      const newUser = await this.database
        .selectFrom("users")
        .select([
          "id",
          sql`BIN_TO_UUID(uuid)`.as("uuid"),
          "username",
          "email",
          "password",
          "roles",
          "avatar_url",
          "first_name",
          "last_name",
          "birthday",
          "age",
          "created_at",
        ])
        .where("id", "=", insertId as any)
        .executeTakeFirst();
      
      return this.userClass(newUser);
    }
  );

  public findResetTokenById = this.wrap.repoWrap(
    async (token_id: number): Promise<SelectResetPasswordToken | undefined> => {
      return await this.database
        .selectFrom("reset_password_token")
        .select([
          "id",
          sql`BIN_TO_UUID(uuid)`.as("uuid"),
          "encrypted",
          "user_id",
          "created_at",
        ])
        .where("id", "=", token_id)
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
        .where("id", "=", token_id)
        .execute();
    }
  );

  private userClass = this.wrap.repoWrap(
    async (user: SelectUsers): Promise<User | undefined> => {
      return user ? new User(user) : undefined;
    }
  );
};

export default AuthRepository;
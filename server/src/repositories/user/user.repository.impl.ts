import db                           from "@/database/db.database";
import { DB }                       from "@/types/schema.types";
import AsyncWrapper                 from "@/utils/async-wrapper.util";
import { Kysely, sql }              from "kysely";
import IUserRepository              from "./user.repository";
import { SelectUsers, UpdateUsers } from "@/types/table.types";

class UserRepository implements IUserRepository {
  private database: Kysely<DB>;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() { this.database = db; };

  public findUserById = this.wrap.repoWrap(
    async (uuid: string): Promise<SelectUsers | undefined> => {
      return await this.database
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
        .where("uuid", "=", sql`UUID_TO_BIN(${uuid})` as any)
        .executeTakeFirst();
    }
  );

  public findUserByUsername = this.wrap.repoWrap(
    async (username: string): Promise<SelectUsers | undefined> => {
      return await this.database
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
        .select([sql`BIN_TO_UUID(uuid)`.as("uuid")])
        .where("username", "like", username + "%")
        .executeTakeFirst();
    }
  );

  public searchUsersByQuery = this.wrap.repoWrap(
    async (search: string): Promise<SelectUsers[]> => {
      return await this.database
        .selectFrom("users")
        .select([
          "id",
          sql`BIN_TO_UUID(users.uuid)`.as("uuid"),
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
        .where((eb) =>
          eb.or([
            eb("username", "like", search + "%"),
            eb("first_name", "like", search + "%"),
            eb("last_name", "like", search + "%"),
            eb(
              sql<string>`
                concat(
                  ${eb.ref("first_name")}, "", 
                  ${eb.ref("last_name")}
                )
              `,
              "like",
              search + "%"
            ),
          ])
        )
        .execute();
    }
  );

  public findUserByEmail = this.wrap.repoWrap(
    async (email: string): Promise<SelectUsers | undefined> => {
      return await this.database
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
        .where("email", "=", email)
        .executeTakeFirst();
    }
  );

  public findUserByCredentials = this.wrap.repoWrap(
    async (userCredential: string): Promise<SelectUsers | undefined> => {
      return await this.database
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
        .where((eb) =>
          eb.or([
            eb("email", "=", userCredential),
            eb("username", "=", userCredential),
          ])
        )
        .executeTakeFirst();
    }
  );

  public updateUserById = this.wrap.repoWrap(
    async (uuid: string, user: UpdateUsers): Promise<UpdateUsers> => {
      return (await this.database
        .updateTable("users")
        .set(user)
        .where("uuid", "=", uuid)
        .executeTakeFirstOrThrow()) as UpdateUsers;
    }
  );

  public deleteUserById = this.wrap.repoWrap(
    async (uuid: string): Promise<void> => {
      await this.database
        .deleteFrom("users")
        .where("uuid", "=", uuid)
        .execute();
    }
  );
};

export default UserRepository;
import db                            from "@/infrastructure/database/db.database";
import User                          from "@/domain/models/user.model";
import { DB }                        from "@/domain/types/schema.types";
import IUserRepository               from "@/domain/repositories/user.repository";
import { plainToInstance }           from "class-transformer";
import { SelectUsers, UpdateUsers }  from "@/domain/types/table.types";
import { Kysely, UpdateResult, sql } from "kysely";

class UserRepository implements IUserRepository {
  private database: Kysely<DB>;

  constructor() { this.database = db; }

  public findUserById = async (uuid: string): Promise<User | undefined> => {
    const user = await this.database
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
      .where("uuid", "=", sql`UUID_TO_BIN(${uuid})`)
      .executeTakeFirst();

    return this.plainToModel(user);
  };

  public findUserByUsername = async (
    username: string
  ): Promise<User | undefined> => {
    const user = await this.database
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
      .where("username", "=", username)
      .executeTakeFirst();

    return this.plainToModel(user);
  };

  public searchUsersByQuery = async (search: string): Promise<User[]> => {
    const users = await this.database
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

    return users.map((user) => plainToInstance(User, user));
  };

  public findUserByEmail = async (email: string): Promise<User | undefined> => {
    const user = await this.database
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

    return this.plainToModel(user);
  };

  public findUserByCredentials = async (
    userCredential: string
  ): Promise<User | undefined> => {
    const user = await this.database
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

    return this.plainToModel(user);
  };

  public updateUserById = async (
    uuid: string,
    user: UpdateUsers
  ): Promise<User> => {
    const updatedUser = await this.database
      .updateTable("users")
      .set(user)
      .where("uuid", "=", sql`UUID_TO_BIN(${uuid})`)
      .executeTakeFirstOrThrow();

    return this.plainToModel(updatedUser) as User;
  };

  public deleteUserById = async (id: number): Promise<void> => {
    await this.database.deleteFrom("users").where("id", "=", id).execute();
  };

  private plainToModel = (
    user: SelectUsers | UpdateResult | undefined
  ): User | undefined => {
    return user ? plainToInstance(User, user) : undefined;
  };
};

export default UserRepository;
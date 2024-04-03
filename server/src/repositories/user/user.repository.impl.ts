import db                           from "@/database/db.database";
import { DB }                       from "@/types/schema.types";
import { Kysely, sql }              from "kysely";
import IUserRepository              from "./user.repository";
import DatabaseException            from "@/exceptions/database.exception";
import { SelectUsers, UpdateUsers } from "@/types/table.types";

class UserRepository implements IUserRepository {
  private database: Kysely<DB>;

  constructor() { this.database = db; };

  async findUserById(user_id: number): Promise<SelectUsers | undefined> {
    try {
      const result = await this.database
        .selectFrom("users")
        .where("user_id", "=", user_id)
        .selectAll()
        .executeTakeFirst();

      return result;
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async findUserByUsername(username: string): Promise<SelectUsers | undefined> {
    try {
      return await this.database
        .selectFrom("users")
        .where("username", "like", username + "%")
        .selectAll()
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async searchUsersByQuery(search: string): Promise<SelectUsers[]> {
    try {
      return await this.database
        .selectFrom("users")
        .where((eb) =>
          eb.or([
            eb("username", "=", search + "%"),
            eb("first_name", "=", search + "%"),
            eb("last_name", "=", search + "%"),
            eb(
              sql<string>`
                concat(
                  ${eb.ref("first_name")}, "", 
                  ${eb.ref("last_name")}
                )
              `,
              "=",
              search + "%"
            ),
          ])
        )
        .selectAll()
        .execute();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async findUserByEmail(email: string): Promise<SelectUsers | undefined> {
    try {
      return await this.database
        .selectFrom("users")
        .where("email", "=", email)
        .selectAll()
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async findUserByCredentials(userCredential: string): Promise<SelectUsers | undefined> {
  try {
      return await this.database
        .selectFrom("users")
        .selectAll()
        .where((eb) =>
          eb.or([
            eb("email", "=", userCredential),
            eb("username", "=", userCredential),
          ])
        )
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async updateUser(user_id: number, user: UpdateUsers): Promise<SelectUsers | undefined> {
    try {
      await this.database
        .updateTable("users")
        .set(user)
        .where("user_id", "=", user_id)
        .executeTakeFirstOrThrow();

      return await this.findUserById(user_id);
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async deleteUser(user_id: number): Promise<void> {
    try {
      await this.database
        .deleteFrom("users")
        .where("user_id", "=", user_id)
        .execute();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }
};

export default UserRepository;
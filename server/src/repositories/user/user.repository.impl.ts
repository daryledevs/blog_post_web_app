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
      throw DatabaseException.error(error);
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
      throw DatabaseException.error(error);
    }
  }

  async searchUsersByQuery(search: string): Promise<SelectUsers[]> {
    try {
      return await this.database
        .selectFrom("users")
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
        .selectAll()
        .execute();
    } catch (error) {
      throw DatabaseException.error(error);
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
      throw DatabaseException.error(error);
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
      throw DatabaseException.error(error);
    }
  }

  async updateUser(user_id: number, user: UpdateUsers): Promise<UpdateUsers> {
    try {
      return await this.database
        .updateTable("users")
        .set(user)
        .where("user_id", "=", user_id)
        .executeTakeFirstOrThrow() as UpdateUsers;
    } catch (error) {
      throw DatabaseException.error(error);
    }
  }

  async deleteUser(user_id: number): Promise<void> {
    try {
      await this.database
        .deleteFrom("users")
        .where("user_id", "=", user_id)
        .execute();
    } catch (error) {
      throw DatabaseException.error(error);
    }
  }
};

export default UserRepository;
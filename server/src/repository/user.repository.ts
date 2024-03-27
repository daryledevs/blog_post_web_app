import db                           from "../database/database";
import { sql }                      from "kysely";
import DatabaseException            from "../exception/database";
import { SelectUsers, UpdateUsers } from "../types/table.types";

class UserRepository {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async findUserById(user_id: number): Promise<SelectUsers | undefined> {
    try {
      return await db
        .selectFrom("users")
        .where("user_id", "=", user_id)
        .selectAll()
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async findUserByUsername(username: string): Promise<SelectUsers | undefined> {
    try {
      return await db
        .selectFrom("users")
        .where("username", "like", username + "%")
        .selectAll()
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async searchUsersByQuery(search: string): Promise<SelectUsers[] | undefined> {
    try {
      return await db
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
      return await db
        .selectFrom("users")
        .where("email", "=", email)
        .selectAll()
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async findUserByCredentials(
    username: string,
    email: string
  ): Promise<SelectUsers | undefined> {
    try {
      return await db
        .selectFrom("users")
        .selectAll()
        .where((eb) =>
          eb.or([eb("email", "=", email), eb("username", "=", username)])
        )
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async updateUser(
    user_id: number,
    user: UpdateUsers
  ): Promise<SelectUsers | undefined> {
    try {
      await db
        .updateTable("users")
        .set(user)
        .where("user_id", "=", user_id)
        .executeTakeFirstOrThrow();

      return await this.userRepository.findUserById(user_id);
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async deleteUser(user_id: number): Promise<string | undefined> {
    try {
      await db.deleteFrom("users").where("user_id", "=", user_id).execute();

      return "User deleted successfully";
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }
};

export default UserRepository;
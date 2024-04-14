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
    async (user_id: number): Promise<SelectUsers | undefined> => {
      return await this.database
        .selectFrom("users")
        .where("user_id", "=", user_id)
        .selectAll()
        .executeTakeFirst();
    }
  );

  public findUserByUsername = this.wrap.repoWrap(
    async (username: string): Promise<SelectUsers | undefined> => {
      return await this.database
        .selectFrom("users")
        .where("username", "like", username + "%")
        .selectAll()
        .executeTakeFirst();
    }
  );

  public searchUsersByQuery = this.wrap.repoWrap(
    async (search: string): Promise<SelectUsers[]> => {
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
    }
  );

  public findUserByEmail = this.wrap.repoWrap(
    async (email: string): Promise<SelectUsers | undefined> => {
      return await this.database
        .selectFrom("users")
        .where("email", "=", email)
        .selectAll()
        .executeTakeFirst();
    }
  );

  public findUserByCredentials = this.wrap.repoWrap(
    async (userCredential: string): Promise<SelectUsers | undefined> => {
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
    }
  );

  public updateUser = this.wrap.repoWrap(
    async (user_id: number, user: UpdateUsers): Promise<UpdateUsers> => {
      return (await this.database
        .updateTable("users")
        .set(user)
        .where("user_id", "=", user_id)
        .executeTakeFirstOrThrow()) as UpdateUsers;
    }
  );

  public deleteUser = this.wrap.repoWrap(
    async (user_id: number): Promise<void> => {
      await this.database
        .deleteFrom("users")
        .where("user_id", "=", user_id)
        .execute();
    }
  );
};

export default UserRepository;
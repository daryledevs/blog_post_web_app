import { db }                        from "../database/database";
import { sql }                       from "kysely";
import DatabaseException             from "../exception/database";
import { Follower, NewFollower }     from "../types/followers";
import { User, NewUser, UpdateUser } from "../types/users-table";

class UserRepository {
  static async findUserById(user_id: number): Promise<User | undefined> {
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

  static async findUserByUsername(username: string): Promise<User | undefined> {
    try {
      return await db
        .selectFrom("users")
        .where("username", "like", username + "%")
        .selectAll()
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async searchUsersByQuery(search: string): Promise<User[] | undefined> {
    try {
      return await db
        .selectFrom("users")
        .where((eb) =>
          eb.or([
            eb("username", "=", search + "%"),
            eb("first_name", "=", search + "%"),
            eb("last_name", "=", search + "%"),
            eb(
              sql<string>`concat(${eb.ref("first_name")}, "", ${eb.ref(
                "last_name"
              )})`,
              "=",
              search + "%"
            ),
          ])
        )
        .selectAll()
        .execute();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      return await db
        .selectFrom("users")
        .where("email", "=", email)
        .selectAll()
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async createUser(user: NewUser): Promise<User | undefined> {
    try {
      const { insertId } = await db
        .insertInto("users")
        .values(user)
        .executeTakeFirstOrThrow();

      return await UserRepository.findUserById(Number(insertId!));
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async getRecentSearches(user_id: number): Promise<User[] | undefined> {
    try {
      return await db
        .selectFrom("recentSearches")
        .innerJoin("users", "users.user_id", "recentSearches.search_user_id")
        .where("recentSearches.user_id", "=", user_id)
        .limit(10)
        .selectAll()
        .execute();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async saveRecentSearches(user_id: number, search_user_id: number): Promise<string | undefined> {
    try {
      // Check if the user exists
      const isUsersExists = await db
        .selectFrom("users")
        .where((eb) =>
          eb.and([
            eb("user_id", "=", user_id),
            eb("user_id", "=", search_user_id),
          ])
        )
        .executeTakeFirst();

      // If the user does not exist, return an error
      if (!isUsersExists) return "User not found";

      // Check if the user is already saved
      const isRecentExists = await db
        .selectFrom("recentSearches")
        .where((eb) =>
          eb.and([
            eb("user_id", "=", user_id),
            eb("search_user_id", "=", search_user_id),
          ])
        )
        .executeTakeFirst();

      // If the user is already saved, return an error
      if (isRecentExists) return "User already saved";

      await db
        .insertInto("recentSearches")
        .values({ user_id, search_user_id })
        .execute();

      return "User saved successfully";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async deleteRecentSearches(recent_id: number): Promise<string | undefined> {
    try {
      // Check if the user exists
      const recent = await db
        .selectFrom("recentSearches")
        .where("recent_id", "=", recent_id)
        .executeTakeFirst();

      // If the user does not exist, return an error
      if (!recent) return "User not found";

      await db
        .deleteFrom("recentSearches")
        .where("recent_id", "=", recent_id)
        .execute();

      return "User deleted successfully";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async updateUser( user_id: number, user: UpdateUser): Promise<User | undefined> {
    try {
      // Check if the user exists
      const person = await UserRepository.findUserById(user_id);
      // If the user does not exist, return an error
      if (!person) return undefined;

      await db
        .updateTable("users")
        .set(user)
        .where("user_id", "=", user_id)
        .executeTakeFirstOrThrow();

      return await UserRepository.findUserById(user_id);
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async deleteUser(user_id: number): Promise<string | undefined> {
    try {
      // Check if the user exists
      const person = await UserRepository.findUserById(user_id);
      // If the user does not exist, return an error
      if (!person) return "User not found";
      await db.deleteFrom("users").where("user_id", "=", user_id).execute();
      return "User deleted successfully";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async getFollowsStats(user_id: number): Promise<{ followers: number, following: number }> {
    try {
      const queryFollowers = db
        .selectFrom("followers")
        .innerJoin("users", "followers.followed_id", "users.user_id")
        .select((eb) => [eb.fn.count<number>("followed_id").as("followers")])
        .where("followers.followed_id", "=", user_id)
        .groupBy("followers.followed_id");

      const queryFollowing = db
        .selectFrom("followers")
        .innerJoin("users", "followers.follower_id", "users.user_id")
        .select((eb) => eb.fn.count<number>("followers.follower_id").as("following"))
        .where("followers.follower_id", "=", user_id)
        .groupBy("followers.follower_id");


      const { followers, following } = await db
        .selectNoFrom((eb) => [
          eb.fn.coalesce(queryFollowers, eb.lit(0)).as("followers"),
          eb.fn.coalesce(queryFollowing, eb.lit(0)).as("following"),
        ])
        .executeTakeFirstOrThrow();

      return { followers, following };
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async getFollowerFollowingLists(user_id: number, fetch: string, listsId: number[]): Promise<any> {
    try {
      const listIdsToExclude = listsId?.length ? listsId : [0];
      const myId = fetch === "followers" ? "followed_id" : "follower_id";
      const otherId = fetch !== "followers" ? "followed_id" : "follower_id";
      
      const result = await db
        .selectFrom("followers")
        .innerJoin("users", `followers.${otherId}`, "users.user_id")
        .where((eb) =>
          eb.and([
            eb(`followers.${myId}`, "=", user_id),
            eb(`followers.${otherId}`, "not in", listIdsToExclude),
          ])
        )
        .selectAll()
        .limit(10)
        .execute();

      return result;
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async isFollowUser (identifier: Follower): Promise<boolean> {
    try {
      const result = await db
        .selectFrom("followers")
        .selectAll()
        .where((eb) =>
          eb.and([
            eb("follower_id", "=", identifier.follower_id),
            eb("followed_id", "=", identifier.followed_id),
          ])
        )
        .executeTakeFirst();

      return !!result;
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  static async followUser(identifier: NewFollower): Promise<string | undefined> {
    const { follower_id, followed_id } = identifier;

    await db
      .insertInto("followers")
      .values({ follower_id, followed_id })
      .execute();
    
    return "User followed successfully";
  };

  static async unfollowUser(identifier: Follower): Promise<string | undefined> {
    try {
      const { follower_id, followed_id } = identifier;

      await db
        .deleteFrom("followers")
        .where((eb) =>
          eb.and([
            eb("follower_id", "=", follower_id),
            eb("followed_id", "=", followed_id),
          ])
        )
        .execute();

      return "User unfollowed successfully";
    } catch (error) {
      console.log(error)
      throw DatabaseException.fromError(error);
    };
  };
};

export default UserRepository;
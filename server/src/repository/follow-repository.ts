import db                                from "../database/database";
import DatabaseException                 from "../exception/database";
import { NewFollowers, SelectFollowers } from "../types/table.types";

class FollowRepository {
  
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

  static async isFollowUser (identifier: SelectFollowers): Promise<boolean> {
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

  static async followUser(identifier: NewFollowers): Promise<string | undefined> {
    await db
      .insertInto("followers")
      .values(identifier)
      .execute();
    
    return "User followed successfully";
  };

  static async unfollowUser(identifier: SelectFollowers): Promise<string | undefined> {
    try {
      await db
        .deleteFrom("followers")
        .where((eb) =>
          eb.and([
            eb("follower_id", "=", identifier.follower_id),
            eb("followed_id", "=", identifier.followed_id),
          ])
        )
        .execute();

      return "User unfollowed successfully";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };
};

export default FollowRepository;

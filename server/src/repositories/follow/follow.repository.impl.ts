import db                                     from "@/database/db.database";
import { DB }                                 from "@/types/schema.types";
import { Kysely }                             from "kysely";
import DatabaseException                      from "@/exceptions/database.exception";
import { NewFollowers, SelectFollowers }      from "@/types/table.types";
import IFollowRepository, { FollowStatsType } from "./follow.repository";

class FollowRepository implements IFollowRepository {
  private database: Kysely<DB>;

  constructor() { this.database = db; };

  async getFollowStats(user_id: number): Promise<FollowStatsType> {
    try {
      const queryFollowers = this.database
        .selectFrom("followers")
        .innerJoin("users", "followers.followed_id", "users.user_id")
        .select((eb) => [eb.fn.count<number>("followed_id").as("followers")])
        .where("followers.followed_id", "=", user_id)
        .groupBy("followers.followed_id");

      const queryFollowing = this.database
        .selectFrom("followers")
        .innerJoin("users", "followers.follower_id", "users.user_id")
        .select((eb) =>
          eb.fn.count<number>("followers.follower_id").as("following")
        )
        .where("followers.follower_id", "=", user_id)
        .groupBy("followers.follower_id");

      const { followers, following } = await this.database
        .selectNoFrom((eb) => [
          eb.fn.coalesce(queryFollowers, eb.lit(0)).as("followers"),
          eb.fn.coalesce(queryFollowing, eb.lit(0)).as("following"),
        ])
        .executeTakeFirstOrThrow();

      return { followers, following };
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async getFollowersLists(user_id: number, listsId: number[]): Promise<any> {
    try {
      const result = await this.database
        .selectFrom("followers")
        .innerJoin("users", "followers.follower_id", "users.user_id")
        .where((eb) =>
          eb.and([
            eb("followers.followed_id", "=", user_id),
            eb("followers.follower_id", "not in", listsId),
          ])
        )
        .selectAll()
        .limit(10)
        .execute();

      return result;
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async getFollowingLists(user_id: number, listsId: number[]): Promise<any> {
    try {
      const result = await this.database
        .selectFrom("followers")
        .innerJoin("users", "followers.followed_id", "users.user_id")
        .where((eb) =>
          eb.and([
            eb("followers.follower_id", "=", user_id),
            eb("followers.followed_id", "not in", listsId),
          ])
        )
        .selectAll()
        .limit(10)
        .execute();

      return result;
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }

  async isFollowUser(identifier: SelectFollowers): Promise<boolean> {
    try {
      const result = await this.database
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
    }
  }

  async followUser(identifier: NewFollowers): Promise<void> {
    await this.database
      .insertInto("followers")
      .values(identifier)
      .execute();
  };

  async unfollowUser(identifier: SelectFollowers): Promise<void> {
    try {
      await this.database
        .deleteFrom("followers")
        .where((eb) =>
          eb.and([
            eb("follower_id", "=", identifier.follower_id),
            eb("followed_id", "=", identifier.followed_id),
          ])
        )
        .execute();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  }
};

export default FollowRepository;

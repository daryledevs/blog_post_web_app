import db                                      from "@/infrastructure/database/db.database";
import { DB }                                  from "@/domain/types/schema.types";
import Follower                                from "@/domain/models/follower.model";
import Following                               from "@/domain/models/following.model";
import { Kysely, sql }                         from "kysely";
import { NewFollowers }                        from "@/domain/types/table.types";
import { plainToInstance }                     from "class-transformer";
import IFollowRepository, { FollowStatsType } from "@/domain/repositories/follow.repository";

class FollowRepository implements IFollowRepository {
  private database: Kysely<DB>;

  constructor() { this.database = db; }

  public findUserFollowStatsById = async (
    id: number
  ): Promise<FollowStatsType> => {
    const queryFollowers = this.database
      .selectFrom("followers")
      .innerJoin("users", "followers.followed_id", "users.id")
      .select((eb) => [eb.fn.count<number>("followed_id").as("followers")])
      .where("followers.followed_id", "=", id)
      .groupBy("followers.followed_id");

    const queryFollowing = this.database
      .selectFrom("followers")
      .innerJoin("users", "followers.follower_id", "users.id")
      .select((eb) =>
        eb.fn.count<number>("followers.follower_id").as("following")
      )
      .where("followers.follower_id", "=", id)
      .groupBy("followers.follower_id");

    const { followers, following } = await this.database
      .selectNoFrom((eb) => [
        eb.fn.coalesce(queryFollowers, eb.lit(0)).as("followers"),
        eb.fn.coalesce(queryFollowing, eb.lit(0)).as("following"),
      ])
      .executeTakeFirstOrThrow();

    return { followers, following };
  };

  public findAllFollowersById = async (
    id: number,
    followIds: number[]
  ): Promise<Follower[]> => {
    const data = await this.database
      .selectFrom("followers")
      .leftJoin("users", "followers.follower_id", "users.id")
      .select([
        "followers.follower_id",
        sql`BIN_TO_UUID(users.uuid)`.as("follower_uuid"),
        "users.username",
        "users.first_name",
        "users.last_name",
        "users.avatar_url",
        "followers.created_at",
      ])
      .where((eb) =>
        eb.and([
          eb("followers.followed_id", "=", id),
          eb("followers.follower_id", "not in", followIds),
        ])
      )
      .limit(10)
      .execute();

    return plainToInstance(Follower, data);
  };

  public findAllFollowingById = async (
    id: number,
    followIds: number[]
  ): Promise<Following[]> => {
    const data = await this.database
      .selectFrom("followers")
      .leftJoin("users", "followers.followed_id", "users.id")
      .select([
        "followers.followed_id",
        sql`BIN_TO_UUID(users.uuid)`.as("followed_uuid"),
        "users.username",
        "users.first_name",
        "users.last_name",
        "users.avatar_url",
        "followers.created_at",
      ])
      .where((eb) =>
        eb.and([
          eb("followers.follower_id", "=", id),
          eb("followers.followed_id", "not in", followIds),
        ])
      )
      .limit(10)
      .execute();

    return plainToInstance(Following, data);
  };

  public isUserFollowing = async (
    identifier: NewFollowers
  ): Promise<boolean> => {
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
  };

  public followUser = async (identifier: NewFollowers): Promise<void> => {
    await this.database.insertInto("followers").values(identifier).execute();
  };

  public unfollowUser = async (identifier: NewFollowers): Promise<void> => {
    await this.database
      .deleteFrom("followers")
      .where((eb) =>
        eb.and([
          eb("follower_id", "=", identifier.follower_id),
          eb("followed_id", "=", identifier.followed_id),
        ])
      )
      .execute();
  };
};

export default FollowRepository;

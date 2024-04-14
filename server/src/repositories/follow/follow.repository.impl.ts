import db                                     from "@/database/db.database";
import { DB }                                 from "@/types/schema.types";
import { Kysely }                             from "kysely";
import AsyncWrapper                           from "@/utils/async-wrapper.util";
import { NewFollowers, SelectFollowers }      from "@/types/table.types";
import IFollowRepository, { FollowStatsType } from "./follow.repository";

class FollowRepository implements IFollowRepository {
  private database: Kysely<DB>;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() { this.database = db; };

  public getFollowStats = this.wrap.repoWrap(
    async (user_id: number): Promise<FollowStatsType> => {
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
    }
  );

  public getFollowersLists = this.wrap.repoWrap(
    async (user_id: number, listsId: number[]): Promise<SelectFollowers[]> => {
      return await this.database
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
    }
  );

  public getFollowingLists = this.wrap.repoWrap(
    async (user_id: number, listsId: number[]): Promise<SelectFollowers[]> => {
      return await this.database
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
    }
  );

  public isFollowUser = this.wrap.repoWrap(
    async (identifier: NewFollowers): Promise<boolean> => {
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
    }
  );

  public followUser = this.wrap.repoWrap(
    async (identifier: NewFollowers): Promise<void> => {
      await this.database
        .insertInto("followers")
        .values(identifier)
        .execute();
    }
  );

  public unfollowUser = this.wrap.repoWrap(
    async (identifier: NewFollowers): Promise<void> => {
      await this.database
        .deleteFrom("followers")
        .where((eb) =>
          eb.and([
            eb("follower_id", "=", identifier.follower_id),
            eb("followed_id", "=", identifier.followed_id),
          ])
        )
        .execute();
    }
  );
};

export default FollowRepository;

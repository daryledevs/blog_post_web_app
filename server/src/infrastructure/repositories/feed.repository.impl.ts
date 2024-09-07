import db               from "@/infrastructure/database/db.database";
import { DB }           from "@/domain/types/schema.types";
import sqlUuidsToBin    from "@/application/utils/uuid-to-bin";
import { Kysely, sql }  from "kysely";
import { SelectPosts }  from "@/domain/types/table.types";
import IEFeedRepository from "@/domain/repositories/feed.repository";

class FeedRepository implements IEFeedRepository {
  private database: Kysely<DB>;

  constructor() { this.database = db; }

  public getTotalFeed = async (): Promise<number> => {
    const query = this.database
      .selectFrom("posts")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where((eb) =>
        eb("created_at", ">", sql<Date>`DATE_SUB(CURDATE(), INTERVAL 3 DAY)`)
      );

    const { count } = await this.database
      .selectNoFrom((eb) => [eb.fn.coalesce(query, eb.lit(0)).as("count")])
      .executeTakeFirstOrThrow();

    return count;
  };

  public getUserFeed = async (
    user_id: number,
    post_uuids: string[]
  ): Promise<SelectPosts[]> => {
    const postUuidsToBinQuery = sqlUuidsToBin(post_uuids);

    return await this.database
      .selectFrom("followers")
      .innerJoin("posts", "followers.followed_id", "posts.user_id")
      .innerJoin("users", "users.id", "posts.user_id")
      .select((eb) => [
        "posts.id",
        sql`BIN_TO_UUID(posts.uuid)`.as("uuid"),
        "posts.image_id",
        "posts.image_url",
        "posts.user_id",
        "users.id",
        sql`BIN_TO_UUID(users.uuid)`.as("uuid"),
        "users.username",
        "users.first_name",
        "users.last_name",
        "users.avatar_url",
        "posts.caption",
        "posts.privacy_level",
        "posts.created_at",
        eb
          .selectFrom("likes")
          .select((eb) => eb.fn.count("likes.post_id").as("count"))
          .whereRef("posts.id", "=", "likes.post_id")
          .as("count"),
      ])
      .where((eb) =>
        eb.and([
          eb("followers.follower_id", "=", user_id),
          eb(
            "posts.created_at",
            ">",
            sql<Date>`DATE_SUB(CURDATE(), INTERVAL 3 DAY)`
          ),
          eb("posts.uuid", "not in", postUuidsToBinQuery),
        ])
      )
      .orderBy(sql`"RAND()"`)
      .limit(3)
      .execute();
  };

  public getExploreFeed = async (user_id: number): Promise<any[]> => {
    return await this.database
      .selectFrom("posts")
      .innerJoin("users", "users.id", "posts.user_id")
      .leftJoin("followers", (join) =>
        join.on((eb) =>
          eb.and([
            eb("followers.followed_id", "=", eb.ref("users.id")),
            eb("followers.follower_id", "=", user_id),
          ])
        )
      )
      .select((eb) => [
        "posts.id",
        sql`BIN_TO_UUID(posts.uuid)`.as("uuid"),
        "posts.image_id",
        "posts.image_url",
        "posts.user_id",
        "users.id",
        "users.username",
        "users.first_name",
        "users.last_name",
        "users.avatar_url",
        "posts.caption",
        "posts.privacy_level",
        "posts.created_at",
        eb
          .selectFrom("likes")
          .select((eb) => eb.fn.count("likes.post_id").as("count"))
          .whereRef("posts.id", "=", "likes.post_id")
          .as("count"),
      ])
      .where((eb) =>
        eb.and([
          eb(
            "posts.created_at",
            ">",
            sql<Date>`DATE_SUB(CURDATE(), INTERVAL 3 DAY)`
          ),
          eb("followers.follower_id", "is", eb.lit(null)),
          eb("users.id", "!=", user_id),
        ])
      )
      .orderBy(sql`"RAND()"`)
      .limit(30)
      .execute();
  };
};

export default FeedRepository;
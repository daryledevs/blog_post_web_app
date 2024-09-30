import db                  from "@/infrastructure/database/db.database";
import Like                from "@/domain/models/like.model";
import { DB }              from "@/domain/types/schema.types";
import { NewLikes }        from "@/domain/types/table.types";
import AsyncWrapper        from "@/application/utils/async-wrapper.util";
import { Kysely, sql }     from "kysely";
import ILikeRepository    from "@/domain/repositories/like.repository";
import { plainToInstance } from "class-transformer";

class LikeRepository implements ILikeRepository {
  private database: Kysely<DB>;

  constructor() {
    this.database = db;
  }

  public findPostsLikeCount = async (postId: number): Promise<number> => {
    const query = this.database
      .selectFrom("likes")
      .select((eb) => eb.fn.count<number>("likes.post_id").as("count"))
      .where("likes.post_id", "=", postId);

    const { count } = await this.database
      .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
      .executeTakeFirstOrThrow();

    return count;
  };

  public isUserLikePost = async (
    userId: number,
    postId: number
  ): Promise<Like | undefined> => {
    const data = await this.database
      .selectFrom("likes")
      .select([
        "likes.id",
        "likes.post_id",
        sql`BIN_TO_UUID(posts.uuid)`.as("post_uuid"),
        "likes.user_id",
        sql`BIN_TO_UUID(users.uuid)`.as("user_uuid"),
        "likes.created_at",
      ])
      .leftJoin("posts", "likes.post_id", "posts.id")
      .leftJoin("users", "likes.user_id", "users.id")
      .where((eb) =>
        eb.and([
          eb("likes.user_id", "=", userId),
          eb("likes.post_id", "=", postId),
        ])
      )
      .executeTakeFirst();

    return plainToInstance(Like, data);
  };

  public likeUsersPostById = async (like: NewLikes): Promise<void> => {
    await this.database.insertInto("likes").values(like).execute();
  };

  public dislikeUsersPostById = async (id: number): Promise<void> => {
    await this.database.deleteFrom("likes").where("id", "=", id).execute();
  };
};

export default LikeRepository;
import {
  NewLikes,
  SelectLikes,
}                        from "@/types/table.types";
import db                from "@/database/db.database";
import { DB }            from "@/types/schema.types";
import AsyncWrapper      from "@/utils/async-wrapper.util";
import { Kysely, sql }   from "kysely";
import IELikeRepository  from "./like.repository";

class LikeRepository implements IELikeRepository {
  private database: Kysely<DB>;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() { this.database = db; };

  public findPostsLikeCount = this.wrap.repoWrap(
    async (post_id: number): Promise<number> => {
      const query = this.database
        .selectFrom("likes")
        .select((eb) => eb.fn.count<number>("likes.post_id").as("count"))
        .where("likes.post_id", "=", post_id);

      const { count } = await this.database
        .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
        .executeTakeFirstOrThrow();

      return count;
    }
  );

  public isUserLikePost = this.wrap.repoWrap(
    async (user_id: number, post_id: number): Promise<SelectLikes | undefined> => {
      return await this.database
        .selectFrom("likes")
        .select([
          "id",
          sql`BIN_TO_UUID(uuid)`.as("uuid"),
          "user_id",
          "post_id",
          "created_at",
        ])
        .where((eb) =>
          eb.and([
            eb("likes.user_id", "=", user_id),
            eb("likes.post_id", "=", post_id),
          ])
        )
        .executeTakeFirst();
    }
  );

  public likeUsersPostById = this.wrap.repoWrap(
    async (like: NewLikes): Promise<void> => {
      await this.database
        .insertInto("likes")
        .values(like)
        .execute();
    }
  );

  public dislikeUsersPostById = this.wrap.repoWrap(
    async (id: number): Promise<void> => {
      await this.database
        .deleteFrom("likes")
        .where("id", "=", id)
        .execute();
    }
  );
};

export default LikeRepository;
import {
  NewPosts,
  SelectLikes,
  SelectPosts,
  UpdatePosts,
}                        from "@/types/table.types";
import db                from "@/database/db.database";
import { DB }            from "@/types/schema.types";
import { Kysely }        from "kysely";
import cloudinary        from "cloudinary";
import AsyncWrapper      from "@/utils/async-wrapper.util";
import IPostRepository   from "./post.repository";
import ApiErrorException from "@/exceptions/api.exception";

class PostRepository implements IPostRepository {
  private database: Kysely<DB>;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() { this.database = db; };

  public findPostsByPostId = this.wrap.repoWrap(
    async (post_id: number): Promise<SelectPosts | undefined> => {
      return this.database
        .selectFrom("posts")
        .selectAll()
        .where("posts.post_id", "=", post_id)
        .executeTakeFirst();
    }
  );

  public getUserPosts = this.wrap.repoWrap(
    async (user_id: number): Promise<SelectPosts[]> => {
      return await this.database
        .selectFrom("posts")
        .innerJoin("users", "posts.user_id", "users.user_id")
        .leftJoin("likes", "posts.post_id", "likes.post_id")
        .select((eb) => [
          "posts.post_id",
          "posts.image_id",
          "posts.image_url",
          "posts.user_id",
          "users.username",
          "users.first_name",
          "users.last_name",
          "posts.caption",
          "posts.privacy_level",
          "posts.created_at",
          eb.fn.count<number>("likes.post_id").as("count"),
        ])
        .where("posts.user_id", "=", user_id)
        .orderBy("posts.created_at", "desc")
        .groupBy("posts.post_id")
        .execute();
    }
  );

  public getUserTotalPosts = this.wrap.repoWrap(
    async (user_id: number): Promise<string | number | bigint> => {
      const query = this.database
        .selectFrom("posts")
        .select((eb) => eb.fn.count<number>("posts.post_id").as("count"))
        .where("user_id", "=", user_id);

      const { count } = await this.database
        .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
        .executeTakeFirstOrThrow();

      return count;
    }
  );

  public newPost = this.wrap.repoWrap(async (post: NewPosts): Promise<void> => {
    await this.database.insertInto("posts").values(post).execute();
  });

  public editPost = this.wrap.repoWrap(
    async (post_id: number, post: UpdatePosts): Promise<void> => {
      await this.database
        .updateTable("posts")
        .set(post)
        .where("post_id", "=", post_id)
        .executeTakeFirst();
    }
  );

  public deletePost = this.wrap.repoWrap(
    async (post_id: number): Promise<void> => {
      const { image_id } = (await this.database
        .selectFrom("posts")
        .select(["image_id"])
        .where("post_id", "=", post_id)
        .executeTakeFirst()) as { image_id: string };

      const status = await cloudinary.v2.uploader.destroy(image_id);
      if (status.result !== "ok")
        throw ApiErrorException.HTTP400Error("Delete image failed");

      await this.database
        .deleteFrom("posts")
        .where("post_id", "=", post_id)
        .executeTakeFirst();
    }
  );

  public getLikesCountForPost = this.wrap.repoWrap(
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
    async (like: SelectLikes): Promise<SelectLikes | undefined> => {
      return await this.database
        .selectFrom("likes")
        .selectAll()
        .where((eb) =>
          eb.and([
            eb("likes.post_id", "=", like.post_id),
            eb("likes.user_id", "=", like.user_id),
          ])
        )
        .executeTakeFirst();
    }
  );

  public toggleUserLikeForPost = this.wrap.repoWrap(
    async (like: SelectLikes): Promise<void> => {
      await this.database
        .insertInto("likes")
        .values(like)
        .execute();
    }
  );

  public removeUserLikeForPost = this.wrap.repoWrap(
    async (like: SelectLikes): Promise<void> => {
      await this.database
        .deleteFrom("likes")
        .where((eb) =>
          eb.and([
            eb("likes.post_id", "=", like.post_id),
            eb("likes.user_id", "=", like.user_id),
          ])
        )
        .execute();
    }
  );
};

export default PostRepository;
import {
  NewLikes,
  NewPosts,
  SelectLikes,
  SelectPosts,
  UpdatePosts,
}                        from "@/types/table.types";
import db                from "@/database/db.database";
import { DB }            from "@/types/schema.types";
import cloudinary        from "cloudinary";
import AsyncWrapper      from "@/utils/async-wrapper.util";
import { Kysely, sql }   from "kysely";
import IEPostRepository  from "./post.repository";
import ApiErrorException from "@/exceptions/api.exception";

class PostRepository implements IEPostRepository {
  private database: Kysely<DB>;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() { this.database = db; };

  public findPostsByPostId = this.wrap.repoWrap(
    async (uuid: string): Promise<SelectPosts | undefined> => {
      return this.database
        .selectFrom("posts")
        .select([
          "id",
          sql`BIN_TO_UUID(uuid)`.as("uuid"),
          "user_id",
          "caption",
          "image_id",
          "image_url",
          "privacy_level",
          "created_at",
        ])
        .where("uuid", "=", uuid)
        .executeTakeFirst();
    }
  );

  public findAllPostsByUserId = this.wrap.repoWrap(
    async (user_id: number): Promise<SelectPosts[]> => {
      return await this.database
        .selectFrom("posts")
        .innerJoin("users", "posts.user_id", "users.id")
        .leftJoin("likes", "posts.id", "likes.post_id")
        .select((eb) => [
          "posts.id",
          sql`BIN_TO_UUID(posts.uuid)`.as("uuid"),
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
        .groupBy("posts.id")
        .execute();
    }
  );

  public findUserTotalPostsByUserId = this.wrap.repoWrap(
    async (user_id: number): Promise<string | number | bigint> => {
      const query = this.database
        .selectFrom("posts")
        .select((eb) => eb.fn.count<number>("posts.id").as("count"))
        .where("user_id", "=", user_id);

      const { count } = await this.database
        .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
        .executeTakeFirstOrThrow();

      return count;
    }
  );

  public createNewPost = this.wrap.repoWrap(
    async (post: NewPosts): Promise<void> => {
      await this.database
        .insertInto("posts")
        .values(post)
        .execute();
    }
  );

  public editPostByPostId = this.wrap.repoWrap(
    async (uuid: string, post: UpdatePosts): Promise<void> => {
      await this.database
        .updateTable("posts")
        .set(post)
        .where("uuid", "=", uuid)
        .executeTakeFirst();
    }
  );

  public deletePostById = this.wrap.repoWrap(
    async (post_id: number): Promise<void> => {
      const { image_id } = (await this.database
        .selectFrom("posts")
        .select(["image_id"])
        .where("id", "=", post_id)
        .executeTakeFirst()) as { image_id: string };

      // deletes the image associated with a user's post from the cloud storage
      const status = await cloudinary.v2.uploader.destroy(image_id);

      // throws an error if the image deletion was not successful
      if (status.result !== "ok") {
        throw ApiErrorException.HTTP400Error("Delete image failed");
      }

      await this.database
        .deleteFrom("posts")
        .where("id", "=", post_id)
        .executeTakeFirst();
    }
  );

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

export default PostRepository;
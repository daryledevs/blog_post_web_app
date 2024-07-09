import {
  NewPosts,
  SelectPosts,
  UpdatePosts,
}                          from "@/domain/types/table.types";
import db                  from "@/infrastructure/database/db.database";
import Post                from "@/domain/models/post.model";
import { DB }              from "@/domain/types/schema.types";
import cloudinary          from "cloudinary";
import AsyncWrapper        from "@/application/utils/async-wrapper.util";
import { Kysely, sql }     from "kysely";
import IEPostRepository    from "@/domain/repositories/post.repository";
import ApiErrorException   from "@/application/exceptions/api.exception";
import { plainToInstance } from "class-transformer";

class PostRepository implements IEPostRepository {
  private database: Kysely<DB>;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor() { this.database = db; };

  public findPostsByPostId = this.wrap.repoWrap(
    async (uuid: string): Promise<Post | undefined> => {
      const data = await this.database
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

      return this.plainToModel(data);
    }
  );

  public findAllPostsByUserId = this.wrap.repoWrap(
    async (user_id: number): Promise<Post[]> => {
      const data = await this.database
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

      return plainToInstance(Post, data);
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
      await this.database.insertInto("posts").values(post).execute();
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

  private plainToModel = (
    post: SelectPosts | undefined
  ): Post | undefined => {
    return post ? plainToInstance(Post, post) : undefined;
  };
};

export default PostRepository;
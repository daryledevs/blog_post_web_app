import {
  NewPosts,
  SelectPosts,
  UpdatePosts,
}                          from "@/domain/types/table.types";
import db                  from "@/infrastructure/database/db.database";
import Post                from "@/domain/models/post.model";
import { DB }              from "@/domain/types/schema.types";
import { Kysely, sql }     from "kysely";
import IEPostRepository    from "@/domain/repositories/post.repository";
import CloudinaryService   from "@/application/libs/cloudinary-service.lib";
import { plainToInstance } from "class-transformer";

class PostRepository implements IEPostRepository {
  private database: Kysely<DB>;
  private cloudinary: CloudinaryService;

  constructor(cloudinary: CloudinaryService) {
    this.database = db;
    this.cloudinary = cloudinary;
  }

  public findPostsByPostId = async (
    uuid: string
  ): Promise<Post | undefined> => {
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
      .where("uuid", "=", sql`UUID_TO_BIN(${uuid})`)
      .executeTakeFirst();

    return this.plainToModel(data);
  };

  public findAllPostsByUserId = async (user_id: number): Promise<Post[]> => {
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
  };

  public findUserTotalPostsByUserId = async (
    user_id: number
  ): Promise<string | number | bigint> => {
    const query = this.database
      .selectFrom("posts")
      .select((eb) => eb.fn.count<number>("posts.id").as("count"))
      .where("user_id", "=", user_id);

    const { count } = await this.database
      .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
      .executeTakeFirstOrThrow();

    return count;
  };

  public createNewPost = async (post: NewPosts): Promise<void> => {
    await this.database.insertInto("posts").values(post).execute();
  };

  public editPostByPostId = async (
    uuid: string,
    post: UpdatePosts
  ): Promise<void> => {
    console.log(post);
    await this.database
      .updateTable("posts")
      .set(post)
      .where("uuid", "=", sql`UUID_TO_BIN(${uuid})`)
      .executeTakeFirst();
  };

  public deletePostById = async (post_id: number): Promise<void> => {
    const { image_id } = (await this.database
      .selectFrom("posts")
      .select(["image_id"])
      .where("id", "=", post_id)
      .executeTakeFirst()) as { image_id: string };

    // deletes the image associated with a user's post from the cloud storage
    await this.cloudinary.deleteImage(image_id);

    await this.database
      .deleteFrom("posts")
      .where("id", "=", post_id)
      .executeTakeFirst();
  };

  private plainToModel = (post: SelectPosts | undefined): Post | undefined => {
    return post ? plainToInstance(Post, post) : undefined;
  };
};

export default PostRepository;
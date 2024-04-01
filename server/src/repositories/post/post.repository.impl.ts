import {
  NewPosts,
  SelectLikes,
  SelectPosts,
  UpdatePosts,
}                        from "@/types/table.types";
import db                from "@/database/db.database";
import Exception         from "@/exceptions/error.exception";
import cloudinary        from "cloudinary";
import IPostRepository   from "./post.repository";
import DatabaseException from "@/exceptions/database.exception";

class PostRepository implements IPostRepository {
  async findPostsByPostId (post_id: number): Promise<SelectPosts | undefined>{
    try {
      return db
        .selectFrom("posts")
        .selectAll()
        .where("posts.post_id", "=", post_id)
        .executeTakeFirst();
    } catch (error) {
      throw error;
    };
  };

  async getUserPosts(user_id: number): Promise<SelectPosts[]> {
    try {
      return await db
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
          "posts.post_date",
          eb.fn.count<number>("likes.post_id").as("count"),
        ])
        .where("posts.user_id", "=", user_id)
        .orderBy("posts.post_date", "desc")
        .groupBy("posts.post_id")
        .execute();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async getUserTotalPosts(user_id: number): Promise<string | number | bigint> {
    try {
      const query = db
        .selectFrom("posts")
        .select((eb) => eb.fn.count<number>("posts.post_id").as("count"))
        .where("user_id", "=", user_id);

      const { count } = await db
        .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
        .executeTakeFirstOrThrow();

      return count;
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async newPost(post: NewPosts): Promise<string> {
    try {
      await db
        .insertInto("posts")
        .values(post)
        .execute();
      return "Post has been posted";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async editPost(post_id: number, post: UpdatePosts): Promise<string> {
    try {
      await db
        .updateTable("posts")
        .set(post)
        .where("post_id", "=", post_id)
        .executeTakeFirst();
      
      return "Edit post successfully";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async deletePost(post_id: number): Promise<string> {
    try {
      const { image_id } = await db
        .selectFrom("posts")
        .select(["image_id"])
        .where("post_id", "=", post_id)
        .executeTakeFirst() as { image_id: string };

      const status = await cloudinary.v2.uploader.destroy(image_id);
      if(status.result !== "ok") throw Exception.badRequest("Delete image failed");

      await db
        .deleteFrom("posts")
        .where("post_id", "=", post_id)
        .executeTakeFirst();
        
      return "Delete post successfully";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async getLikesCountForPost(post_id:number): Promise<number> {
    try {
      const query = db
        .selectFrom("likes")
        .select((eb) => eb.fn.count<number>("likes.post_id").as("count"))
        .where("likes.post_id", "=", post_id);

      const { count } = await db
        .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
        .executeTakeFirstOrThrow();

      return count;
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async isUserLikePost(like: SelectLikes): Promise<SelectLikes | undefined> {
    try {
      return await db
        .selectFrom("likes")
        .selectAll()
        .where((eb) => eb.and([
          eb("likes.post_id", "=", like.post_id),
          eb("likes.user_id", "=", like.user_id)
        ]))
        .executeTakeFirst();
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async toggleUserLikeForPost(like: SelectLikes): Promise<string> {
    try {
      await db
      .insertInto("likes")
      .values(like)
      .execute();

    return "Like post successfully";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };

  async removeUserLikeForPost(like: SelectLikes): Promise<string> {
    try {
      await db
      .deleteFrom("likes")
      .where((eb) => eb.and([
        eb("likes.post_id", "=", like.post_id),
        eb("likes.user_id", "=", like.user_id)
      ]))
      .execute();

      return "Removed like from a post";
    } catch (error) {
      throw DatabaseException.fromError(error);
    };
  };
};

export default PostRepository;
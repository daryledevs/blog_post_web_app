import db from "./database";

async function createSchemaTable() {
  await db.schema
    .createTable("users")
    .ifNotExists()
    .addColumn("user_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("username", "varchar(45)", (col) => col.notNull())
    .addColumn("email", "varchar(255)", (col) => col.notNull())
    .addColumn("password", "varchar(255)", (col) => col.notNull())
    .addColumn("roles", "varchar(45)", (col) => col.defaultTo("user"))
    .addColumn("avatar_url", "text", (col) => col.defaultTo(null))
    .addColumn("first_name", "varchar(45)", (col) => col.defaultTo(null))
    .addColumn("last_name", "varchar(45)", (col) => col.defaultTo(null))
    .addColumn("birthday", "varchar(45)", (col) => col.defaultTo(null))
    .addColumn("age", "integer", (col) => col.defaultTo(null))
    .addColumn("created_at", "timestamp")
    .execute()
    .then(() => console.log("Users table created"));
  
  await db.schema
    .createTable("reset_password_token")
    .ifNotExists()
    .addColumn("token_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("user_id", "integer", (col) => col.notNull())
    .addColumn("encrypted", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamp")
    .addForeignKeyConstraint(
      "reset_token_user_id_fk",
      ["user_id"],
      "users",
      ["user_id"],
    )
    .execute()
    .then(() => console.log("Reset Password Token table created"));

  await db.schema
    .createTable("recent_searches")
    .ifNotExists()
    .addColumn("recent_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("search_user_id", "integer", (col) => col.notNull())
    .addColumn("user_id", "integer", (col) => col.notNull())
    .addColumn("create_time", "datetime")
    .addForeignKeyConstraint(
      "recent_search_user_id_fk",
      ["search_user_id"],
      "users",
      ["user_id"],
    )
    .addForeignKeyConstraint(
      "recent_user_id_fk",
      ["user_id"],
      "users",
      ["user_id"],
    )
    .execute()
    .then(() => console.log("Recent Searches table created"));

  await db.schema
    .createTable("posts")
    .ifNotExists()
    .addColumn("post_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("user_id", "integer", (col) => col.notNull())
    .addColumn("image_id", "text", (col) => col.notNull())
    .addColumn("caption", "text", (col) => col.defaultTo(null))
    .addColumn("image_url", "text", (col) => col.defaultTo(null))
    .addColumn("privacy_level", "varchar(10)", (col) => col.defaultTo("public"))
    .addColumn("post_date", "timestamp")
    .addForeignKeyConstraint(
      "post_user_id_fk",
      ["user_id"],
      "users",
      ["user_id"],
    )
    .execute()
    .then(() => console.log("Posts table created"));
  
  await db.schema
    .createTable("comments")
    .ifNotExists()
    .addColumn("comment_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("post_id", "integer", (col) => col.notNull())
    .addColumn("user_id", "integer", (col) => col.notNull())
    .addColumn("comment", "text", (col) => col.notNull())
    .addColumn("comment_date", "timestamp")
    .addForeignKeyConstraint(
      "comment_post_id_fk",
      ["post_id"],
      "posts",
      ["post_id"],
    )
    .addForeignKeyConstraint(
      "comment_user_id_fk",
      ["user_id"],
      "users",
      ["user_id"],
    )
    .execute()
    .then(() => console.log("Comments table created"));

  await db.schema
    .createTable("likes")
    .ifNotExists()
    .addColumn("post_id", "integer", (col) => col.notNull())
    .addColumn("user_id", "integer", (col) => col.notNull())
    .addForeignKeyConstraint(
      "post_id_likes_fk",
      ["post_id"],
      "posts",
      ["post_id"],
    )
    .addForeignKeyConstraint(
      "user_id_likes_fk",
      ["user_id"],
      "users",
      ["user_id"],
    )
    .execute()
    .then(() => console.log("Likes table created"));

  await db.schema
    .createTable("followers")
    .ifNotExists()
    .addColumn("follower_id", "integer", (col) => col.notNull())
    .addColumn("followed_id", "integer", (col) => col.notNull())
    .addForeignKeyConstraint(
      "followed_user_id_fk",
      ["follower_id"],
      "users",
      ["user_id"],
    )
    .addForeignKeyConstraint(
      "follower_user_id_fk",
      ["followed_id"],
      "users",
      ["user_id"],
    )
    .execute()
    .then(() => console.log("Followers table created"));

  await db.schema
    .createTable("conversations")
    .ifNotExists()
    .addColumn("conversation_id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("user_one_id", "integer", (col) => col.notNull())
    .addColumn("user_two_id", "integer", (col) => col.notNull())
    .addForeignKeyConstraint(
      "conversation_user_id_one_fk",
      ["user_one_id"],
      "users",
      ["user_id"],
    )
    .addForeignKeyConstraint(
      "conversation_user_id_two_fk",
      ["user_two_id"],
      "users",
      ["user_id"],
    )
    .execute()
    .then(() => console.log("Conversations table created"));
};

createSchemaTable()
  .then(() => console.log("Finished: All tables created successfully!"))
  .catch((err) => console.log(err))
  .finally(() => db.destroy());

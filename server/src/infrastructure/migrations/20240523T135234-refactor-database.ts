import { type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("reset_password_token")
    .dropColumn("token_id")
    .execute()
    .then(() => console.log("Altered reset password token table successfully"));

  await db.schema
    .alterTable("reset_password_token")
    .dropConstraint("reset_token_user_id_fk")
    .execute()
    .then(() =>
      console.log("Dropped constraint reset_token_user_id_fk successfully")
    );

  await db.schema
    .alterTable("followers")
    .dropConstraint("follower_user_id_fk")
    .execute()
    .then(() =>
      console.log("Dropped constraint follower_user_id_fk successfully")
    );

  await db.schema
    .alterTable("followers")
    .dropConstraint("followed_user_id_fk")
    .execute()
    .then(() =>
      console.log("Dropped constraint followed_user_id_fk successfully")
    );

  await db.schema
    .dropTable("recent_searches")
    .execute()
    .then(() => console.log("Dropped Recent Searches Table successfully"));

  await db.schema
    .alterTable("comments")
    .dropColumn("comment_id")
    .execute()
    .then(() =>
      console.log("Dropped column 'comment_id' from 'comments' table")
    );

  await db.schema
    .alterTable("comments")
    .dropConstraint("comment_post_id_fk")
    .execute()
    .then(() =>
      console.log(
        "Dropped constraint 'comment_post_id_fk' from 'comments' table"
      )
    );

  await db.schema
    .alterTable("comments")
    .dropConstraint("comment_user_id_fk")
    .execute()
    .then(() =>
      console.log(
        "Dropped constraint 'comment_user_id_fk' from 'comments' table"
      )
    );

  await db.schema
    .alterTable("likes")
    .dropConstraint("user_id_likes_fk")
    .execute()
    .then(() =>
      console.log("Dropped user_id_likes_fk constraint successfully")
    );

  await db.schema
    .alterTable("likes")
    .dropConstraint("post_id_likes_fk")
    .execute()
    .then(() =>
      console.log("Dropped post_id_likes_fk constraint successfully")
    );

  await db.schema
    .alterTable("posts")
    .dropColumn("post_id")
    .execute()
    .then(() => console.log("Dropped post_id column successfully"));

  await db.schema
    .alterTable("posts")
    .dropConstraint("post_user_id_fk")
    .execute()
    .then(() => console.log("Dropped post_user_id_fk constraint successfully"));

  await db.schema
    .alterTable("messages")
    .dropColumn("message_id")
    .execute()
    .then(() =>
      console.log("Dropped column 'message_id' from 'messages' table")
    );

  await db.schema
    .alterTable("messages")
    .dropConstraint("message_conversation_id_fk")
    .execute()
    .then(() =>
      console.log(
        "Dropped constraint 'message_conversation_id_fk' from 'messages' table"
      )
    );

  await db.schema
    .alterTable("messages")
    .dropConstraint("message_sender_id_fk")
    .execute()
    .then(() =>
      console.log(
        "Dropped constraint 'message_sender_id_fk' from 'messages' table"
      )
    );

  await db.schema
    .dropTable("conversations")
    .execute()
    .then(() => console.log("Dropped Conversations table successfully"));

  await db.schema
    .alterTable("users")
    .dropColumn("user_Id")
    .execute()
    .then(() => console.log("Altered users table successfully"));
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("conversation_members").ifExists().execute().then(() => console.log("Conversation members table dropped"));
  await db.schema.dropTable("search_history").ifExists().execute().then(() => console.log("Search History table dropped"));
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("users")
        .ifNotExists()
        .addColumn("user_id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
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
        .createTable("followers")
        .ifNotExists()
        .addColumn("follower_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("followed_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("created_at", "timestamp")
        .addForeignKeyConstraint("followed_user_id_fk", ["follower_id"], "users", ["user_id"])
        .addForeignKeyConstraint("follower_user_id_fk", ["followed_id"], "users", ["user_id"])
        .execute()
        .then(() => console.log("Followers table created"));
    await db.schema
        .createTable("reset_password_token")
        .ifNotExists()
        .addColumn("token_id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("user_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("encrypted", "text", (col) => col.notNull())
        .addColumn("created_at", "timestamp")
        .addForeignKeyConstraint("reset_token_user_id_fk", ["user_id"], "users", ["user_id"])
        .execute()
        .then(() => console.log("Reset Password Token table created"));
    await db.schema
        .createTable("recent_searches")
        .ifNotExists()
        .addColumn("recent_id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("search_user_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("user_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("created_at", "timestamp")
        .addForeignKeyConstraint("recent_search_user_id_fk", ["search_user_id"], "users", ["user_id"])
        .addForeignKeyConstraint("recent_user_id_fk", ["user_id"], "users", ["user_id"])
        .execute()
        .then(() => console.log("Recent Searches table created"));
    await db.schema
        .createTable("posts")
        .ifNotExists()
        .addColumn("post_id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("user_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("image_id", "text", (col) => col.notNull())
        .addColumn("caption", "text", (col) => col.defaultTo(null))
        .addColumn("image_url", "text", (col) => col.defaultTo(null))
        .addColumn("privacy_level", "varchar(10)", (col) => col.defaultTo("public"))
        .addColumn("created_at", "timestamp")
        .addForeignKeyConstraint("post_user_id_fk", ["user_id"], "users", ["user_id"])
        .execute()
        .then(() => console.log("Posts table created"));
    await db.schema
        .createTable("comments")
        .ifNotExists()
        .addColumn("comment_id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("post_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("user_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("comment", "text", (col) => col.notNull())
        .addColumn("created_at", "timestamp")
        .addForeignKeyConstraint("comment_post_id_fk", ["post_id"], "posts", ["post_id"])
        .addForeignKeyConstraint("comment_user_id_fk", ["user_id"], "users", ["user_id"])
        .execute()
        .then(() => console.log("Comments table created"));
    await db.schema
        .createTable("likes")
        .ifNotExists()
        .addColumn("post_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("user_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("created_at", "timestamp")
        .addForeignKeyConstraint("post_id_likes_fk", ["post_id"], "posts", ["post_id"])
        .addForeignKeyConstraint("user_id_likes_fk", ["user_id"], "users", ["user_id"])
        .execute()
        .then(() => console.log("Likes table created"));
    await db.schema
        .createTable("conversations")
        .ifNotExists()
        .addColumn("conversation_id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("user_one_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("user_two_id", "integer", (col) => col.notNull().unsigned())
        .addForeignKeyConstraint("conversation_user_id_one_fk", ["user_one_id"], "users", ["user_id"])
        .addForeignKeyConstraint("conversation_user_id_two_fk", ["user_two_id"], "users", ["user_id"])
        .execute()
        .then(() => console.log("Conversations table created"));
    await db.schema
        .createTable("messages")
        .ifNotExists()
        .addColumn("message_id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("conversation_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("sender_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("text_message", "text", (col) => col.notNull())
        .addColumn("time_sent", "timestamp")
        .addForeignKeyConstraint("message_conversation_id_fk", ["conversation_id"], "conversations", ["conversation_id"])
        .addForeignKeyConstraint("message_sender_id_fk", ["sender_id"], "users", ["user_id"])
        .execute()
        .then(() => console.log("Messages table created"));
}
exports.up = up;
;
async function down(db) {
    await (0, kysely_1.sql) `SET FOREIGN_KEY_CHECKS = 0`.execute(db);
    await db.schema.dropTable("users").ifExists().execute().then(() => console.log("Users table dropped"));
    await db.schema.dropTable("reset_password_token").ifExists().execute().then(() => console.log("Reset Password Token table dropped"));
    await db.schema.dropTable("recent_searches").ifExists().execute().then(() => console.log("Recent Searches table dropped"));
    await db.schema.dropTable("posts").ifExists().execute().then(() => console.log("Posts table dropped"));
    await db.schema.dropTable("comments").ifExists().execute().then(() => console.log("Comments table dropped"));
    await db.schema.dropTable("likes").ifExists().execute().then(() => console.log("Likes table dropped"));
    await db.schema.dropTable("followers").ifExists().execute().then(() => console.log("Followers table dropped"));
    await db.schema.dropTable("conversations").ifExists().execute().then(() => console.log("Conversations table dropped"));
    await db.schema.dropTable("messages").ifExists().execute().then(() => console.log("Messages table dropped"));
    await (0, kysely_1.sql) `SET FOREIGN_KEY_CHECKS = 1`.execute(db);
}
exports.down = down;
;

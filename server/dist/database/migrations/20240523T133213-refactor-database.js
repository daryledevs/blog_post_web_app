"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const kysely_1 = require("kysely");
async function up(db) {
    // Alter the users table
    await db.schema
        .alterTable("users")
        .addColumn("id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("uuid", "char(36)", (col) => col.notNull().unique().defaultTo("(UUID())"))
        .modifyColumn("email", "varchar(255)", (col) => col.notNull().unique())
        .modifyColumn("username", "varchar(45)", (col) => col.notNull().unique())
        .modifyColumn("created_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute()
        .then(() => console.log("Altered users table successfully"));
    // Alter the followers table
    await db.schema
        .alterTable("followers")
        .modifyColumn("follower_id", "integer", (col) => col.notNull().unsigned().primaryKey())
        .modifyColumn("followed_id", "integer", (col) => col.notNull().unsigned().primaryKey())
        .modifyColumn("created_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute()
        .then(() => console.log("Modified column follower_id and followed_id successfully"));
    await db.schema
        .alterTable("followers")
        .addIndex("idx_follower_id")
        .column("follower_id")
        .execute()
        .then(() => console.log("Added index idx_follower_id successfully"));
    await db.schema
        .alterTable("followers")
        .addIndex("idx_followed_id")
        .column("followed_id")
        .execute()
        .then(() => console.log("Added index idx_followed_id successfully"));
    await db.schema
        .alterTable("followers")
        .addForeignKeyConstraint("fk_followed_id", ["followed_id"], "users", ["id"])
        .onDelete("cascade")
        .execute()
        .then(() => console.log("Added fk_followed_id foreign constraint with ON DELETE CASCADE successfully"));
    await db.schema
        .alterTable("followers")
        .addForeignKeyConstraint("fk_followed_id", ["followed_id"], "users", ["id"])
        .onDelete("cascade")
        .execute()
        .then(() => console.log("Added fk_followed_id foreign constraint successfully"));
    // Alter the reset password token table
    await db.schema
        .alterTable("reset_password_token")
        .addColumn("id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("uuid", "char(36)", (col) => col.notNull().unique().defaultTo("(UUID())"))
        .modifyColumn("created_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute()
        .then(() => console.log("Altered reset password token table successfully"));
    // Alter the recent searches table
    await db.schema
        .createTable("search_history")
        .ifNotExists()
        .addColumn("id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("uuid", "char(36)", (col) => col.notNull().unique().defaultTo("(UUID())"))
        .addColumn("searcher_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("search_id", "integer", (col) => col.notNull().unsigned())
        .addForeignKeyConstraint("fk_searcher_id", ["searcher_id"], "users", ["id"], (cb) => cb.onDelete("cascade"))
        .addForeignKeyConstraint("fk_search_id", ["search_id"], "users", ["id"], (cb) => cb.onDelete("cascade"))
        .addColumn("created_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute()
        .then(() => console.log("Search History Table created"));
    await db.schema
        .createIndex("idx_searcher_id")
        .on("search_history")
        .column("searcher_id")
        .execute()
        .then(() => console.log("Added index idx_searcher_id successfully"));
    await db.schema
        .createIndex("idx_search_id")
        .on("search_history")
        .column("search_id")
        .execute()
        .then(() => console.log("Added index idx_search_id successfully"));
    // Alter the posts table
    await db.schema
        .alterTable("posts")
        .addColumn("id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("uuid", "char(36)", (col) => col.notNull().unique().defaultTo("(UUID())"))
        .addColumn("created_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute()
        .then(() => console.log("Alter Posts Table successfully"));
    await db.schema
        .alterTable("posts")
        .addForeignKeyConstraint("fk_user_id", ["user_id"], "users", ["id"])
        .onDelete("cascade")
        .execute()
        .then(() => console.log("Alter Posts Table successfully"));
    await db.schema
        .alterTable("posts")
        .addIndex("idx_user_id")
        .column("user_id")
        .execute()
        .then(() => console.log("Added index idx_user_id successfully"));
    // Alter the comments table
    await db.schema
        .alterTable("comments")
        .addColumn("id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("uuid", "char(36)", (col) => col.notNull().unique().defaultTo("(UUID())"))
        .addColumn("comment", "text", (col) => col.notNull())
        .addColumn("created_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute()
        .then(() => console.log("Alter Comments table successfully"));
    await db.schema
        .alterTable("comments")
        .addForeignKeyConstraint("fk_post_id", ["post_id"], "posts", ["id"])
        .onDelete("cascade")
        .execute()
        .then(() => console.log("Altered comments table successfully"));
    await db.schema
        .alterTable("comments")
        .addIndex("idx_post_id")
        .column("post_id")
        .execute()
        .then(() => console.log("Added index idx_post_id successfully"));
    await db.schema
        .alterTable("comments")
        .addForeignKeyConstraint("fk_user_id", ["user_id"], "users", ["id"])
        .onDelete("cascade")
        .execute()
        .then(() => console.log("Altered comments table successfully"));
    await db.schema
        .alterTable("comments")
        .addIndex("idx_user_id")
        .column("user_id")
        .execute()
        .then(() => console.log("Added index idx_user_id successfully"));
    // Alter the likes table
    await db.schema
        .alterTable("likes")
        .modifyColumn("created_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute()
        .then(() => console.log("Likes table created"));
    await db.schema
        .alterTable("likes")
        .addForeignKeyConstraint("fk_post_id", ["post_id"], "posts", ["id"])
        .onDelete("cascade")
        .execute()
        .then(() => console.log("Altered likes table successfully"));
    await db.schema
        .alterTable("likes")
        .addForeignKeyConstraint("fk_user_id", ["user_id"], "users", ["id"])
        .onDelete("cascade")
        .execute()
        .then(() => console.log("Altered likes table successfully"));
    await db.schema
        .alterTable("likes")
        .addIndex("idx_post_id")
        .column("post_id")
        .execute()
        .then(() => console.log("Added index idx_post_id successfully"));
    await db.schema
        .alterTable("likes")
        .addIndex("idx_user_id")
        .column("user_id")
        .execute()
        .then(() => console.log("Added index idx_user_id successfully"));
    // Create conversations table
    await db.schema
        .createTable("conversations")
        .addColumn("id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("uuid", "char(36)", (col) => col.notNull().unique().defaultTo("(UUID())"))
        .addColumn("created_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute()
        .then(() => console.log("Created Conversations Table successfully"));
    await db.schema
        .createTable("conversation_members")
        .addColumn("id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("uuid", "char(36)", (col) => col.notNull().unique().defaultTo("(UUID())"))
        .addColumn("conversation_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("user_id", "integer", (col) => col.notNull().unsigned())
        .addForeignKeyConstraint("fk_conversation_id", ["conversation_id"], "users", ["id"])
        .addForeignKeyConstraint("fk_user_id", ["user_id"], "users", ["id"])
        .addColumn("joined_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute()
        .then(() => console.log("Created Conversation Members Table successfully"));
    await db.schema
        .createIndex("idx_conversation_id")
        .on("conversation_members")
        .column("conversation_id")
        .execute()
        .then(() => console.log("Created index 'idx_conversation_id' on 'conversation_members' table"));
    await db.schema
        .createIndex("idx_user_id")
        .on("conversation_members")
        .column("user_id")
        .execute()
        .then(() => console.log("Created index 'idx_user_id' on 'conversation_members' table"));
    // Alter messages table
    await db.schema
        .alterTable("messages")
        .addColumn("id", "integer", (col) => col.notNull().autoIncrement().unsigned().primaryKey())
        .addColumn("uuid", "char(36)", (col) => col.notNull().unique().defaultTo("(UUID())"))
        .addColumn("conversation_id", "integer", (col) => col.notNull().unsigned())
        .addColumn("sender_id", "integer", (col) => col.notNull().unsigned())
        .execute()
        .then(() => console.log("Altered Messages Table successfully"));
    await db.schema
        .alterTable("messages")
        .addForeignKeyConstraint("fk_conversation_id", ["conversation_id"], "conversation", ["id"])
        .onDelete("cascade")
        .execute()
        .then(() => console.log("Added foreign key 'fk_conversation_id' with ON DELETE CASCADE to 'messages' table"));
    await db.schema
        .createIndex("idx_conversation_id")
        .on("messages")
        .column("conversation_id")
        .execute()
        .then(() => console.log("Created index 'idx_conversation_id' on 'messages' table"));
    await db.schema
        .alterTable("messages")
        .addForeignKeyConstraint("fk_user_id", ["user_id"], "users", ["id"])
        .onDelete("cascade")
        .execute()
        .then(() => console.log("Added foreign key 'fk_user_id' with ON DELETE CASCADE to 'messages' table"));
    await db.schema
        .createIndex("idx_user_id")
        .on("messages")
        .column("user_id")
        .execute()
        .then(() => console.log("Created index 'idx_user_id' on 'messages' table"));
}
exports.up = up;
async function down(db) {
}
exports.down = down;

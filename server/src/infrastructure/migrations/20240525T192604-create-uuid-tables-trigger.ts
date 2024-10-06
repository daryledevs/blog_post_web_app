import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await Promise.all([
    // Trigger for 'users' table
    sql`CREATE TRIGGER before_insert_users BEFORE INSERT ON users FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID_TO_BIN(UUID()); END IF; END;`.execute(db),
    // Trigger for 'search_history' table
    sql`CREATE TRIGGER before_insert_search_history BEFORE INSERT ON search_history FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID_TO_BIN(UUID()); END IF; END;`.execute(db),
    // Trigger for 'reset_password_token' table
    sql`CREATE TRIGGER before_insert_reset_password_token BEFORE INSERT ON reset_password_token FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID_TO_BIN(UUID()); END IF; END;`.execute(db),
    // Trigger for 'posts' table
    sql`CREATE TRIGGER before_insert_posts BEFORE INSERT ON posts FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID_TO_BIN(UUID()); END IF; END;`.execute(db),
    // Trigger for 'messages' table
    sql`CREATE TRIGGER before_insert_messages BEFORE INSERT ON messages FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID_TO_BIN(UUID()); END IF; END;`.execute(db),
    // Trigger for 'likes' table
    sql`CREATE TRIGGER before_insert_likes BEFORE INSERT ON likes FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID_TO_BIN(UUID()); END IF; END;`.execute(db),
    // Trigger for 'conversation_members' table
    sql`CREATE TRIGGER before_insert_conversation_members BEFORE INSERT ON conversation_members FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID_TO_BIN(UUID()); END IF; END;`.execute(db),
    // Trigger for 'conversations' table
    sql`CREATE TRIGGER before_insert_conversations BEFORE INSERT ON conversations FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID_TO_BIN(UUID()); END IF; END;`.execute(db),
    // Trigger for 'comments' table
    sql`CREATE TRIGGER before_insert_comments BEFORE INSERT ON comments FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID_TO_BIN(UUID()); END IF; END;`.execute(db),
  ]);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP FUNCTION IF EXISTS UUID_V4`.execute(db);

  // drop the trigger for each table
  [
    "users",
    "search_history",
    "reset_password_token",
    "posts",
    "messages",
    "likes",
    "conversation_members",
    "conversations",
    "comments",
  ].map(async (table) =>
    await sql`DROP TRIGGER IF EXISTS before_insert_${sql.raw(table)}`.execute(db)
  );
}

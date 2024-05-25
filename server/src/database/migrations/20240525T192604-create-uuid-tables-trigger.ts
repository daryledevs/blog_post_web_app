import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await Promise.all([
    // Trigger for 'users' table
    sql`CREATE TRIGGER before_insert_users BEFORE INSERT ON users FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID(); END IF; END;`.execute(db),
    // Trigger for 'search_history' table
    sql`CREATE TRIGGER before_insert_search_history BEFORE INSERT ON search_history FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID(); END IF; END;`.execute(db),
    // Trigger for 'reset_password_token' table
    sql`CREATE TRIGGER before_insert_reset_password_token BEFORE INSERT ON reset_password_token FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID(); END IF; END;`.execute(db),
    // Trigger for 'posts' table
    sql`CREATE TRIGGER before_insert_posts BEFORE INSERT ON posts FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID(); END IF; END;`.execute(db),
    // Trigger for 'messages' table
    sql`CREATE TRIGGER before_insert_messages BEFORE INSERT ON messages FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID(); END IF; END;`.execute(db),
    // Trigger for 'likes' table
    sql`CREATE TRIGGER before_insert_likes BEFORE INSERT ON likes FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID(); END IF; END;`.execute(db),
    // Trigger for 'conversation_members' table
    sql`CREATE TRIGGER before_insert_conversation_members BEFORE INSERT ON conversation_members FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID(); END IF; END;`.execute(db),
    // Trigger for 'conversations' table
    sql`CREATE TRIGGER before_insert_conversations BEFORE INSERT ON conversations FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID(); END IF; END;`.execute(db),
    // Trigger for 'comments' table
    sql`CREATE TRIGGER before_insert_comments BEFORE INSERT ON comments FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID(); END IF; END;`.execute(db),
  ]);
}

export async function down(db: Kysely<any>): Promise<void> {
  await Promise.all([
    // Drop trigger for 'users' table
    sql`DROP TRIGGER IF EXISTS before_insert_users;`.execute(db),
    // Drop trigger for 'search_history' table
    sql`DROP TRIGGER IF EXISTS before_insert_search_history;`.execute(db),
    // Drop trigger for 'reset_password_token' table
    sql`DROP TRIGGER IF EXISTS before_insert_reset_password_token;`.execute(db),
    // Drop trigger for 'posts' table
    sql`DROP TRIGGER IF EXISTS before_insert_posts;`.execute(db),
    // Drop trigger for 'messages' table
    sql`DROP TRIGGER IF EXISTS before_insert_messages;`.execute(db),
    // Drop trigger for 'likes' table
    sql`DROP TRIGGER IF EXISTS before_insert_likes;`.execute(db),
    // Drop trigger for 'conversation_members' table
    sql`DROP TRIGGER IF EXISTS before_insert_conversation_members;`.execute(db),
    // Drop trigger for 'conversations' table
    sql`DROP TRIGGER IF EXISTS before_insert_conversations;`.execute(db),
    // Drop trigger for 'comments' table
    sql`DROP TRIGGER IF EXISTS before_insert_comments;`.execute(db),
  ]);
}

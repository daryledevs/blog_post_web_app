import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // create a custom UUID version 4 function
  await sql`CREATE FUNCTION UUID_V4() RETURNS CHAR(36) READS SQL DATA BEGIN RETURN LOWER(CONCAT(HEX(RANDOM_BYTES(4)), '-', HEX(RANDOM_BYTES(2)), '-4', SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3), '-', HEX(FLOOR(ASCII(RANDOM_BYTES(1)) / 64) + 8), SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3), '-', hex(RANDOM_BYTES(6)))); END;`.execute(db);

  // create a trigger for each table
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
    await sql`DROP TRIGGER IF EXISTS before_insert_${sql.raw(table)}; CREATE TRIGGER before_insert_${sql.raw(table)} BEFORE INSERT ON ${sql.raw(table)} FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID_TO_BIN(UUID_V4()); END IF; END;`.execute(db)
  )

}

export async function down(db: Kysely<any>): Promise<void> {};

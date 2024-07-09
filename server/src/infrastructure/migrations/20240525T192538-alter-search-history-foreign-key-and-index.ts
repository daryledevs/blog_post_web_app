import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`SET FOREIGN_KEY_CHECKS = 0;`.execute(db);

  await db.schema
    .alterTable("search_history")
    .dropConstraint("fk_search_id")
    .execute()
    .then(() =>
      console.log(
        "Constraint 'fk_search_id' dropped from 'search_history' table"
      )
    );

  await db.schema
    .dropIndex("idx_search_id")
    .on("search_history")
    .execute()
    .then(() =>
      console.log("Index 'idx_search_id' dropped from 'search_history' table")
    );

  await db.schema
    .alterTable("search_history")
    .dropColumn("search_id")
    .execute()
    .then(() =>
      console.log("Column 'searched_id' added to 'search_history' table")
    );

  await db.schema
    .alterTable("search_history")
    .addColumn("searched_id", "integer", (col) => col.notNull().unsigned())
    .execute()
    .then(() =>
      console.log("Column 'searched_id' added to 'search_history' table")
    );

  await db.schema
    .alterTable("search_history")
    .addForeignKeyConstraint("fk_searched_id", ["searched_id"], "users", ["id"])
    .onDelete("cascade")
    .execute()
    .then(() =>
      console.log(
        "Foreign key constraint 'fk_searched_id' added to 'search_history' table"
      )
    );

  await db.schema
    .createIndex("idx_searched_id")
    .on("search_history")
    .column("searched_id")
    .execute()
    .then(() =>
      console.log("Index 'idx_searched_id' created on 'search_history' table")
    );

  Promise.all([
    sql`ALTER TABLE search_history MODIFY COLUMN searched_id INT UNSIGNED NOT NULL AFTER searcher_id;`.execute(
      db
    ),
    sql`SET FOREIGN_KEY_CHECKS = 1;`.execute(db),
  ]);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`SET FOREIGN_KEY_CHECKS = 0;`.execute(db);

  await db.schema
    .alterTable("search_history")
    .dropConstraint("fk_searched_id")
    .execute()
    .then(() =>
      console.log(
        "Constraint 'fk_searched_id' dropped from 'search_history' table"
      )
    );

  await db.schema
    .dropIndex("idx_searched_id")
    .on("search_history")
    .execute()
    .then(() =>
      console.log("Index 'idx_searched_id' dropped from 'search_history' table")
    );

  await db.schema
    .alterTable("search_history")
    .dropColumn("searched_id")
    .execute()
    .then(() =>
      console.log("Column 'searched_id' dropped from 'search_history' table")
    );

  await db.schema
    .alterTable("search_history")
    .addColumn("search_id", "integer", (col) => col.notNull().unsigned())
    .execute()
    .then(() =>
      console.log("Column 'search_id' added to 'search_history' table")
    );

  await db.schema
    .alterTable("search_history")
    .addForeignKeyConstraint("fk_search_id", ["search_id"], "users", ["id"])
    .onDelete("cascade")
    .execute()
    .then(() =>
      console.log(
        "Foreign key constraint 'fk_search_id' added to 'search_history' table"
      )
    );

  await db.schema
    .createIndex("idx_search_id")
    .on("search_history")
    .column("search_id")
    .execute()
    .then(() =>
      console.log("Index 'idx_search_id' created on 'search_history' table")
    );

  Promise.all([
    sql`ALTER TABLE search_history MODIFY COLUMN search_id INT UNSIGNED NOT NULL AFTER searcher_id;`.execute(
      db
    ),
    sql`SET FOREIGN_KEY_CHECKS = 1;`.execute(db),
  ]);
}

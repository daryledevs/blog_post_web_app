import db                                  from "./db.database";
import { run }                             from "kysely-migration-cli";
import * as path                           from "path";
import { promises as fs }                  from "fs";
import { Migrator, FileMigrationProvider } from "kysely";

const migrationFolder = path.join(process.cwd(), "src/database/migrations");

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: migrationFolder,
  }),
});

run(db, migrator, migrationFolder);

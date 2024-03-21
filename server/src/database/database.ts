import * as dotenv                               from "dotenv";
import { type DB }                               from "../types/schema.types";
import { createPool }                            from "mysql2";
import { CamelCasePlugin, Kysely, MysqlDialect } from "kysely";
dotenv.config();

const dialect = new MysqlDialect({
  pool: createPool({
    database: `${process.env.DATABASE}`,
    host: `${process.env.DATABASE_HOST}`,
    port: process.env.DATABASE_PORT as unknown as number,
    user: `${process.env.USER}`,
    password: process.env.PASSWORD,
    waitForConnections: true,
    multipleStatements: true,
    charset: "utf8mb4",
    connectionLimit: `${process.env.DATABASE_CONNECTION_LIMIT}` as unknown as number,
    queueLimit: 0,
  }),
});

const db = new Kysely<DB>({ 
  dialect, 
  plugins: [new CamelCasePlugin] 
});

export default db;

import mysql                    from 'mysql';
import Database                 from "../types";
import { createPool }           from "mysql2";
import { Kysely, MysqlDialect } from "kysely";
import * as dotenv              from "dotenv";

dotenv.config();

const database = mysql.createPool({
  host: `${process.env.DATABASE_HOST}`,
  port: process.env.DATABASE_PORT as unknown as number,
  user: `${process.env.USER}`,
  password: process.env.PASSWORD,
  database: `${process.env.DATABASE}`,
  multipleStatements: true,
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: `${process.env.DATABASE_CONNECTION_LIMIT}` as unknown as number,
  queueLimit: 0,
});

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

export const db = new Kysely<Database>({ dialect });
export default database;

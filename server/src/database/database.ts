import mysql from 'mysql';
import * as dotenv from "dotenv";
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

export default database;

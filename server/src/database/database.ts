import mysql from 'mysql';
import * as dotenv from "dotenv";
dotenv.config();

const db_port = process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3306;

const database = mysql.createConnection({
  host: `${process.env.HOST}`,
  port: db_port,
  user: `${process.env.USER}`,
  password: process.env.PASSWORD,
  database: `${process.env.DATABASE}`,
  multipleStatements: true,
  charset: "utf8mb4",
});

export default database;

import mysql from 'mysql';
import * as dotenv from "dotenv";
dotenv.config();

const database = mysql.createConnection({
  host: "localhost",
  user: `${process.env.USER}`,
  password: process.env.PASSWORD,
  database: `${process.env.DATABASE}`,
  multipleStatements: true,
});

export default database;

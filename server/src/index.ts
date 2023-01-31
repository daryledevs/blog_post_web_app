import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import * as dotenv from "dotenv";
import database from "./database";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("tiny"));

database.connect((error) => {
  if(error) throw error;
  console.log("Connected to MySQL Server!");
});

app.listen(PORT, () => {
  console.log("Connected", PORT);
});
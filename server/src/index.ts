import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("tiny"));

app.listen(PORT, () => {
  console.log("Connected", PORT);
});
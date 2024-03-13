import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import * as dotenv from "dotenv";
import database from "./database/database";
import authRoutes from "./router/auth";
import userRoutes from './router/user';
import cookieParser from 'cookie-parser';
import socketController from "./socket";
import chatRoutes from "./router/chat";
import postRouter from "./router/post";
import feedRouter from "./router/feed";
import corsOptions from "./config/corsOption";
import tokenHandler from "./middleware/tokenHandler";
import rootPath from "./config/path";
import responseHandler from "./middleware/responseHandler";
import cookieOptions from "./middleware/cookieOptions";
import db from "./database/query";
dotenv.config();

const app = express();
const PORT = parseInt(process.env.SERVER_PORT ?? "5000");
const HOST = process.env.SERVER_HOST || "localhost";
const API = process.env.API;

app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieOptions);
app.use(cors(corsOptions));
app.use(tokenHandler);
app.use(responseHandler);
app.set("views", rootPath); // Set the views directory
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.use(morgan("tiny"));

// Routes
app.use(`${API}/`, authRoutes);
app.use(`${API}/chats`, chatRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/posts`, postRouter);
app.use(`${API}/feeds`, feedRouter);

database.getConnection(async (error) => {
  if (error) throw error;
  console.log("Connected to MySQL Server!");

  // force mysql not to lose connection
  // https://github.com/sidorares/node-mysql2/issues/836
  const [data] = await db("SELECT 1 + 1 AS solution", []);
  console.log("The solution is: ", data.solution);
});

app.listen(PORT, HOST, () => {
  socketController();
  console.log("Connected to", PORT, HOST, "in: ", app.settings.env);
});
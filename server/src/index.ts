import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import * as dotenv from "dotenv";
import database from "./database";
import authRoutes from "./router/auth";
import userRoutes from './router/user';
import cookieParser from 'cookie-parser';
import socketController from "./socket";
import chatRoutes from "./router/chat";
import postRouter from "./router/post";
import likeRouter from "./router/like";
import followRouter from "./router/follow";
import corsOptions from "./config/corsOption";
import refreshToken from "./middleware/refreshToken";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API = process.env.API;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(refreshToken);
app.use(morgan("tiny"));

// Routes
app.use(`${API}/`, authRoutes);
app.use(`${API}/chats`, chatRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/posts`, postRouter);
app.use(`${API}/likes`, likeRouter);
app.use(`${API}/follow`, followRouter);

database.connect((error) => {
  if(error) throw error;
  console.log("Connected to MySQL Server!");
});

app.listen(PORT, () => {
  socketController();
  console.log("Connected to", PORT, "in: ", app.settings.env);
});
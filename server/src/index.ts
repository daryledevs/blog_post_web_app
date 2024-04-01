import cors             from "cors";
import morgan           from "morgan";
import express          from "express";
import rootPath         from "./utils/path.util";
import { pool }         from "./database/db.database";
import bodyParser       from "body-parser";
import authRoutes       from "./routers/auth.router";
import userRoutes       from './routers/user.router';
import chatRoutes       from "./routers/chat.router";
import postRouter       from "./routers/post.router";
import feedRouter       from "./routers/feed.router";
import * as dotenv      from "dotenv";
import corsOptions      from "./config/cors-option.config";
import cookieParser     from 'cookie-parser';
import errorHandler     from "./helpers/error-handler.helper";
import tokenHandler     from "./middleware/token-handler.middleware";
import cookieOptions    from "./middleware/cookie-options.middleware";
import responseHandler  from "./middleware/response-handler.middleware";
import socketController from "./socket";
import { createServer } from "http";
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = parseInt(process.env.SERVER_PORT ?? "5000");
const HOST = process.env.SERVER_HOST || "localhost";
const API = process.env.API;

app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieOptions);
app.use(cors(corsOptions));
app.use(tokenHandler);
app.set("views", rootPath); // Set the views directory
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.use(morgan("tiny"));

// Routes
app.use(`${API}/`, authRoutes);
app.use(`${API}/chats`, chatRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/posts`, postRouter);
app.use(`${API}/feeds`, feedRouter);
app.use(errorHandler);

server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT} in ${app.settings.env}`);
  socketController()
});

pool.getConnection((err, connection) => {
  if (err) return console.error("error connecting: " + err.stack);
  console.log("Database connection ready!")
});

export default server;
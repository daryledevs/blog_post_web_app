import cors             from "cors";
import morgan           from "morgan";
import express          from "express";
import rootPath         from "./config/path";
import bodyParser       from "body-parser";
import authRoutes       from "./router/auth.route";
import userRoutes       from './router/user.router';
import chatRoutes       from "./router/chat.router";
import postRouter       from "./router/post.router";
import feedRouter       from "./router/feed";
import * as dotenv      from "dotenv";
import corsOptions      from "./config/corsOption";
import cookieParser     from 'cookie-parser';
import errorHandler     from "./helper/error-handler";
import tokenHandler     from "./middleware/token-handler";
import cookieOptions    from "./middleware/cookie-options";
import responseHandler  from "./middleware/response-handler";
import socketController from "./socket";
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

app.listen(PORT, HOST, () => {
  socketController();
  console.log("Connected to", PORT, HOST, "in: ", app.settings.env);
});

export default app;
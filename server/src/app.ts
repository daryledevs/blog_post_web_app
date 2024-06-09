import 'reflect-metadata';
import cors          from "cors";
import morgan        from "morgan";
import express       from "express";
import rootPath      from "./utils/path.util";
import validator    from './middleware/validator.middleware';
import bodyParser    from "body-parser";
import authRoutes    from "./routers/auth.router";
import userRoutes    from './routers/user.router';
import chatRoutes    from "./routers/chat.router";
import postRouter    from "./routers/post.router";
import feedRouter    from "./routers/feed.router";
import * as dotenv   from "dotenv";
import corsOptions   from "./config/cors-option.config";
import cookieParser  from 'cookie-parser';
import errorHandler  from "./helpers/error-handler.helper";
import tokenHandler  from "./middleware/token-handler.middleware";
import cookieOptions from "./middleware/cookie-options.middleware";
dotenv.config();

const app = express();
const API = process.env.API;

app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieOptions);
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator)  ;
app.use(tokenHandler);
app.set("views", rootPath); // Set the views directory
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.use(morgan("tiny"));

// Routes
app.use(`${API}/auth`, authRoutes);
app.use(`${API}/chats`, chatRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/posts`, postRouter);
app.use(`${API}/feeds`, feedRouter);
app.use(errorHandler);

export default app;
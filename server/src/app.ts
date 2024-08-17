import               'reflect-metadata';
import cors          from "cors";
import helmet        from "helmet";
import morgan        from "morgan";
import express       from "express";
import rootPath      from "./application/utils/path.util";
import validator     from './presentation/middlewares/validator.middleware';
import bodyParser    from "body-parser";
import authRoutes    from "./presentation/routers/auth.router";
import userRoutes    from './presentation/routers/user.router';
import chatRoutes    from "./presentation/routers/chat.router";
import postRouter    from "./presentation/routers/post.router";
import feedRouter    from "./presentation/routers/feed.router";
import compression   from "compression";
import * as dotenv   from "dotenv";
import rateLimiter   from './presentation/middlewares/rate-limiter.middleware';
import corsOptions   from "./config/cors-option.config";
import helmetConfig  from './config/helmet.config';
import cookieParser  from 'cookie-parser';
import errorHandler  from "./presentation/helpers/error-handler.helper";
import tokenHandler  from "./presentation/middlewares/token-handler.middleware";
import cookieOptions from "./presentation/middlewares/cookie-options.middleware";
dotenv.config();

const app = express();
const API = process.env.API;

app.disable("x-powered-by");
app.use(helmet(helmetConfig));
app.use(rateLimiter);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieOptions);
app.use(cors(corsOptions));
app.use(compression());
app.use(bodyParser.json({ limit: "50kb" }));
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
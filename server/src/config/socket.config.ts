import * as dotenv from "dotenv";
dotenv.config();

const socketConfig = {
  cors: {
    origin: [
      `${process.env.CLIENT_URL_NGINX}`,
      `${process.env.CLIENT_URL_ONE}`,
      `${process.env.CLIENT_URL_TWO}`,
      `${process.env.CLIENT_URL_THREE}`,
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
  path: `/socket.io`,
};

export default socketConfig;

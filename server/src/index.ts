import app              from "./app";
import { pool }         from "./database/db.database";
import { Server }       from "socket.io";
import * as dotenv      from "dotenv";
import socketConfig     from "./config/socket.config";
import SocketService    from "./libraries/socket/socket.lib";
import { createServer } from "http";
dotenv.config();

const server = createServer(app);
const io = new Server(server, socketConfig);
const socketService = new SocketService();

const PORT = parseInt(process.env.SERVER_PORT ?? "5000");
const HOST = process.env.SERVER_HOST || "localhost";

server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT} in ${app.settings.env}`);

  socketService.connection(io).then(() => {
    console.log("Socket connection ready!");
  });
});

pool.getConnection((err, connection) => {
  if (err) return console.error("error connecting: " + err.stack);
  console.log("Database connection ready!")
});

export default server;
import app              from "./app";
import { pool }         from "./database/db.database";
import * as dotenv      from "dotenv";
import socketController from "./socket";
import { createServer } from "http";
dotenv.config();

const server = createServer(app);
const PORT = parseInt(process.env.SERVER_PORT ?? "5000");
const HOST = process.env.SERVER_HOST || "localhost";

server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT} in ${app.settings.env}`);
  socketController()
});

pool.getConnection((err, connection) => {
  if (err) return console.error("error connecting: " + err.stack);
  console.log("Database connection ready!")
});

export default server;
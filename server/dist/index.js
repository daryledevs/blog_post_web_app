"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_database_1 = require("./database/db.database");
const socket_io_1 = require("socket.io");
const dotenv = __importStar(require("dotenv"));
const socket_config_1 = __importDefault(require("./config/socket.config"));
const socket_lib_1 = __importDefault(require("./libraries/socket/socket.lib"));
const http_1 = require("http");
dotenv.config();
const server = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(server, socket_config_1.default);
const socketService = new socket_lib_1.default();
const PORT = parseInt(process.env.SERVER_PORT ?? "5000");
const HOST = process.env.SERVER_HOST || "localhost";
server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT} in ${app_1.default.settings.env}`);
    socketService.connection(io).then(() => {
        console.log("Socket connection ready!");
    });
});
db_database_1.pool.getConnection((err, connection) => {
    if (err)
        return console.error("error connecting: " + err.stack);
    console.log("Database connection ready!");
});
exports.default = server;
